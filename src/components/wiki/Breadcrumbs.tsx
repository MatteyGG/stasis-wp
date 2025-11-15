// components/wiki/Breadcrumbs.tsx
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from "../ui/badge";

interface BreadcrumbsProps {
  category?: string | "";
  title?: string | "";
}

export default function Breadcrumbs({ category, title }: BreadcrumbsProps) {
  return (
    <nav className=" flex items-center space-x-1 text-sm md:text-xl text-muted-foreground mb-6">
      <Badge className="bg-gray-300" variant={"outline"}>
        <Link href="/wiki" className="hover:text-primary transition-colors">
          Вики
        </Link>

        {category && (
          <>
            <ChevronRight className="h-4 w-4" />
            <Link
              href={`/wiki/${category}`}
              className="hover:text-primary transition-colors"
            >
              {category}
            </Link>
          </>
        )}

        {title && (
          <>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{title}</span>
          </>
        )}
      </Badge>
    </nav>
  );
}
