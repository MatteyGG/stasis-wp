"use client";

import { useEffect, useRef, useState } from 'react';

interface TelegramCommentsProps {
  discussion: string;
  commentsLimit?: number;
  initialHeight?: number;
  color?: string;
  className?: string;
}

const TelegramComments = ({
  discussion,
  commentsLimit = 5,
  color,
  className = ""
}: TelegramCommentsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Очищаем контейнер
    containerRef.current.innerHTML = '';

    // Создаем элемент скрипта
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-discussion', discussion);
    script.setAttribute('data-comments-limit', commentsLimit.toString());
    
    if (color) {
      script.setAttribute('data-color', color);
    }

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [discussion, commentsLimit, color]);

  return (
    <div 
      className={`telegram-comments-container ${className}`}
      style={{ 
        width: '100%',
        margin: '0 auto',
        overflow: 'hidden'
      }}
    >
      <div 
        ref={containerRef}
        style={{ 
          width: '100%',
          overflow: 'hidden',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      />
      
    </div>
  );
};

export default TelegramComments;

