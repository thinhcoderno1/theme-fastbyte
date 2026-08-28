interface WordPressContentProps {
  html: string;
}

export function WordPressContent({ html }: WordPressContentProps) {
  return <div className="wordpress-content" dangerouslySetInnerHTML={{ __html: html }} />;
}
