"use client";

import { useEffect, useState } from "react";

interface ViewCounterProps {
  views: number;
}

export function ViewCounter({ views }: ViewCounterProps) {
  const [animatedViews, setAnimatedViews] = useState(views);

  useEffect(() => {
    if (views > animatedViews) {
      const timer = setTimeout(() => {
        setAnimatedViews(prev => {
          const diff = views - prev;
          return prev + Math.ceil(diff / 10);
        });
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [animatedViews, views]);

  return (
    <span className="font-medium">
      Просмотров: {animatedViews.toLocaleString('ru-RU')}
    </span>
  );
}