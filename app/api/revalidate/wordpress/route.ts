import { timingSafeEqual } from 'node:crypto';
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

const allowedStatuses = new Set(['publish', 'draft', 'pending', 'private', 'trash', 'deleted']);

interface WebhookPayload {
  postId?: unknown;
  slug?: unknown;
  status?: unknown;
  postType?: unknown;
}

function secretsMatch(received: string, expected: string): boolean {
  const receivedBuffer = Buffer.from(received);
  const expectedBuffer = Buffer.from(expected);
  return receivedBuffer.length === expectedBuffer.length && timingSafeEqual(receivedBuffer, expectedBuffer);
}

export async function POST(request: Request) {
  const expectedSecret = process.env.WORDPRESS_REVALIDATE_SECRET;
  if (!expectedSecret) {
    console.error('WORDPRESS_REVALIDATE_SECRET chưa được cấu hình.');
    return NextResponse.json({ ok: false, message: 'Webhook chưa được cấu hình.' }, { status: 503 });
  }

  const receivedSecret = request.headers.get('x-fastbyte-webhook-secret') || '';
  if (!secretsMatch(receivedSecret, expectedSecret)) {
    return NextResponse.json({ ok: false, message: 'Không được phép.' }, { status: 401 });
  }

  let payload: WebhookPayload;
  try {
    payload = await request.json() as WebhookPayload;
  } catch {
    return NextResponse.json({ ok: false, message: 'JSON không hợp lệ.' }, { status: 400 });
  }

  const postId = Number(payload.postId);
  const slug = typeof payload.slug === 'string' ? payload.slug.trim() : '';
  const status = typeof payload.status === 'string' ? payload.status : '';
  if (!Number.isInteger(postId) || postId <= 0 || payload.postType !== 'post' || !allowedStatuses.has(status) || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ ok: false, message: 'Payload không hợp lệ.' }, { status: 422 });
  }

  revalidateTag('wordpress-posts', 'max');
  revalidateTag(`wordpress-post-${slug}`, 'max');
  revalidateTag('wordpress-categories', 'max');
  revalidateTag('wordpress-tags', 'max');
  revalidatePath('/blog');
  revalidatePath(`/blog/${slug}`);
  revalidatePath('/blog/danh-muc/[slug]', 'page');
  revalidatePath('/sitemap.xml');

  return NextResponse.json({ ok: true, revalidated: true, postId, slug, status });
}
