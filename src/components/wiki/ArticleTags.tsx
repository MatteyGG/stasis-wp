import { Badge } from "@/components/ui/badge";

interface ArticleTagsProps {
  tags: string[];
  className?: string;
}

export default function ArticleTags({ tags, className = "" }: ArticleTagsProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag, index) => (
        <Badge 
          key={index} 
          variant="secondary"
          className="text-xs font-medium"
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}