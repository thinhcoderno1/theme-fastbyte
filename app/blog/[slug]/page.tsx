import { permanentRedirect } from 'next/navigation';
import { getPostPath } from '@/lib/wordpress/urls';

export default async function LegacyPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  permanentRedirect(getPostPath(slug));
}
