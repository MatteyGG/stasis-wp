// components/warpath/ui/WarpathCard.tsx
import { Card, CardProps } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface WarpathCardProps extends CardProps {}

export const WarpathCard = ({ className, ...props }: WarpathCardProps) => {
  return <Card className={cn("rounded-2xl", className)} {...props} />;
};
// components/warpath/ui/WarpathButton.tsx
import { Button, ButtonProps } from '@/components/ui/button';
export const WarpathButton = ({ className, ...props }: ButtonProps) => {
  return <Button className={cn("rounded-xl", className)} {...props} />;
};

// components/warpath/ui/ResourceTile.tsx
interface ResourceTileProps {
  title: string;
  value: string;
  className?: string;
}

export const ResourceTile = ({ title, value, className }: ResourceTileProps) => (
  <div className={cn("p-3 rounded-xl bg-muted", className)}>
    <div className="text-sm text-muted-foreground">{title}</div>
    <div className="text-xl font-semibold">{value}</div>
  </div>
);

// components/warpath/ui/NewsTile.tsx
interface NewsTileProps {
  title: string;
  body: string;
  time: string;
}

export const NewsTile = ({ title, body, time }: NewsTileProps) => (
  <div className="p-3 rounded-xl bg-muted">
    <div className="font-medium">{title}</div>
    <div className="text-sm text-muted-foreground">{body}</div>
    <div className="text-xs text-muted-foreground mt-1">{time}</div>
  </div>
);

// components/warpath/ui/StatTile.tsx
interface StatTileProps {
  title: string;
  value: string;
}

export const StatTile = ({ title, value }: StatTileProps) => (
  <div className="p-3 rounded-xl bg-muted">
    <div className="text-sm text-muted-foreground">{title}</div>
    <div className="text-2xl font-semibold">{value}</div>
  </div>
);