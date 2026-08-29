import { Search } from 'lucide-react';

interface BlogSearchFormProps {
  defaultValue?: string;
  className?: string;
}

export function BlogSearchForm({ defaultValue = '', className = '' }: BlogSearchFormProps) {
  return (
    <form
      action="/blog/tim-kiem/"
      method="get"
      role="search"
      aria-label="Tìm kiếm bài viết trong blog"
      className={`max-w-2xl ${className}`}
    >
      <label htmlFor="blog-search" className="mb-2 block text-sm font-semibold text-ink-700">
        Tìm kiếm trong blog
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
            size={19}
          />
          <input
            id="blog-search"
            name="q"
            type="search"
            defaultValue={defaultValue}
            maxLength={100}
            enterKeyHint="search"
            placeholder="Nhập chủ đề bạn muốn tìm..."
            className="h-12 w-full rounded-md border border-line-strong bg-white pl-11 pr-4 text-ink-900 outline-none placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <button
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-brand-700 px-6 font-semibold text-white transition-colors hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          type="submit"
        >
          <Search aria-hidden="true" size={18} />
          Tìm bài viết
        </button>
      </div>
    </form>
  );
}
