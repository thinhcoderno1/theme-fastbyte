# TLS certificate files

Place the certificate chains and matching unencrypted private keys here:

- `app.crt` and `app.key` for `app.example.com`

The directory is mounted read-only at `/etc/nginx/certs`. Certificate and key
files are ignored by Git. On Linux, restrict private keys with `chmod 600
nginx/certs/*.key` before starting the stack.
