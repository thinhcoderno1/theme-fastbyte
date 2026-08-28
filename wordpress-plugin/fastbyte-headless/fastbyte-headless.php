<?php
/**
 * Plugin Name: Fast Byte Headless
 * Description: Gửi webhook tới Next.js khi bài viết thay đổi để làm mới cache.
 * Version: 1.0.0
 * Author: Fast Byte
 */

if (!defined('ABSPATH')) {
    exit;
}

const FASTBYTE_HEADLESS_OPTION = 'fastbyte_headless_settings';

function fastbyte_headless_register_settings() {
    register_setting('fastbyte_headless', FASTBYTE_HEADLESS_OPTION, [
        'type' => 'array',
        'sanitize_callback' => 'fastbyte_headless_sanitize_settings',
        'default' => [],
    ]);
}
add_action('admin_init', 'fastbyte_headless_register_settings');

function fastbyte_headless_sanitize_settings($input) {
    return [
        'webhook_url' => esc_url_raw($input['webhook_url'] ?? ''),
        'webhook_secret' => sanitize_text_field($input['webhook_secret'] ?? ''),
    ];
}

function fastbyte_headless_add_settings_page() {
    add_options_page(
        'Fast Byte Headless',
        'Fast Byte Headless',
        'manage_options',
        'fastbyte-headless',
        'fastbyte_headless_render_settings_page'
    );
}
add_action('admin_menu', 'fastbyte_headless_add_settings_page');

function fastbyte_headless_render_settings_page() {
    if (!current_user_can('manage_options')) {
        return;
    }
    $settings = get_option(FASTBYTE_HEADLESS_OPTION, []);
    ?>
    <div class="wrap">
        <h1>Fast Byte Headless</h1>
        <p>Cấu hình endpoint revalidation của website Next.js. Secret chỉ được gửi trong HTTP header.</p>
        <form method="post" action="options.php">
            <?php settings_fields('fastbyte_headless'); ?>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="fastbyte-webhook-url">Webhook URL</label></th>
                    <td><input class="regular-text" type="url" id="fastbyte-webhook-url" name="<?php echo esc_attr(FASTBYTE_HEADLESS_OPTION); ?>[webhook_url]" value="<?php echo esc_attr($settings['webhook_url'] ?? ''); ?>" placeholder="http://host.docker.internal:3000/api/revalidate/wordpress" /></td>
                </tr>
                <tr>
                    <th scope="row"><label for="fastbyte-webhook-secret">Webhook secret</label></th>
                    <td><input class="regular-text" type="password" id="fastbyte-webhook-secret" name="<?php echo esc_attr(FASTBYTE_HEADLESS_OPTION); ?>[webhook_secret]" value="<?php echo esc_attr($settings['webhook_secret'] ?? ''); ?>" autocomplete="new-password" /></td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}

function fastbyte_headless_should_skip($post_id, $post) {
    return !$post
        || $post->post_type !== 'post'
        || wp_is_post_autosave($post_id)
        || wp_is_post_revision($post_id);
}

function fastbyte_headless_send_webhook($post_id, $post, $status_override = null) {
    if (fastbyte_headless_should_skip($post_id, $post)) {
        return;
    }

    $settings = get_option(FASTBYTE_HEADLESS_OPTION, []);
    $url = getenv('FASTBYTE_HEADLESS_WEBHOOK_URL') ?: ($settings['webhook_url'] ?? '');
    $secret = getenv('FASTBYTE_HEADLESS_WEBHOOK_SECRET') ?: ($settings['webhook_secret'] ?? '');
    if (!$url || !$secret) {
        return;
    }

    wp_remote_post($url, [
        'timeout' => 5,
        'blocking' => false,
        'redirection' => 0,
        'headers' => [
            'Content-Type' => 'application/json',
            'X-FastByte-Webhook-Secret' => $secret,
        ],
        'body' => wp_json_encode([
            'postId' => (int) $post_id,
            'slug' => $post->post_name,
            'status' => $status_override ?: $post->post_status,
            'postType' => $post->post_type,
        ]),
    ]);
}

function fastbyte_headless_after_insert($post_id, $post, $update, $post_before) {
    if (fastbyte_headless_should_skip($post_id, $post)) {
        return;
    }

    $was_public = $post_before && $post_before->post_status === 'publish';
    $is_public = $post->post_status === 'publish';
    if ($was_public || $is_public) {
        fastbyte_headless_send_webhook($post_id, $post);
    }
}
add_action('wp_after_insert_post', 'fastbyte_headless_after_insert', 10, 4);

function fastbyte_headless_before_delete($post_id, $post) {
    if (!fastbyte_headless_should_skip($post_id, $post)) {
        fastbyte_headless_send_webhook($post_id, $post, 'deleted');
    }
}
add_action('before_delete_post', 'fastbyte_headless_before_delete', 10, 2);
