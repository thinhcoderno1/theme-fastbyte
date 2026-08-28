'use client';

import { useState } from 'react';
import { Check, Copy, Facebook, Linkedin } from 'lucide-react';

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  const buttonClass = 'inline-flex h-9 items-center gap-1.5 rounded-md border border-line-strong px-3 text-xs font-semibold text-ink-700 hover:border-brand-300 hover:text-brand-700';
  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Chia sẻ bài viết">
      <span className="mr-1 text-sm font-semibold text-ink-700">Chia sẻ:</span>
      <a className={buttonClass} href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer"><Facebook size={15} /> Facebook</a>
      <a className={buttonClass} href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}`} target="_blank" rel="noopener noreferrer"><Linkedin size={15} /> LinkedIn</a>
      <button type="button" className={buttonClass} onClick={copyLink}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Đã sao chép' : 'Sao chép link'}</button>
    </div>
  );
}
