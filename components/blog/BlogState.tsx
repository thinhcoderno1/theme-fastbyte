import { BookOpen, RefreshCw } from 'lucide-react';

export function BlogEmptyState({ message = 'Chưa có bài viết nào được xuất bản.' }: { message?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-line-strong bg-surface-subtle px-6 py-14 text-center">
      <BookOpen className="mx-auto text-brand-500" size={34} />
      <p className="mt-4 font-semibold text-ink-700">{message}</p>
    </div>
  );
}

export function BlogErrorState() {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-6 py-12 text-center" role="status">
      <RefreshCw className="mx-auto text-amber-700" size={32} />
      <h2 className="mt-4 text-xl">Blog tạm thời chưa thể tải</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-amber-900/80">WordPress chưa sẵn sàng hoặc kết nối đang gián đoạn. Vui lòng thử lại sau.</p>
    </div>
  );
}
