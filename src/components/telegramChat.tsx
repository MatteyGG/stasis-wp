"use client";

import { useEffect, useRef, useState } from 'react';

interface TelegramCommentsProps {
  discussion: string;
  commentsLimit?: number;
  initialHeight?: number;
  color?: string;
  className?: string;
  maxWidth?: number;
}

const TelegramComments = ({
  discussion,
  commentsLimit = 5,
  initialHeight = 400,
  color,
  className = "",
  maxWidth = 800
}: TelegramCommentsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [calculatedHeight, setCalculatedHeight] = useState<number>(initialHeight);

  // Функция для обновления размеров
  const updateDimensions = () => {
    if (containerRef.current) {
      const width = containerRef.current.clientWidth;
      setContainerWidth(width);
      
      // Адаптивная высота: на мобильных уменьшаем, на десктопе увеличиваем
      const newHeight = width < 768 ? initialHeight * 0.8 : initialHeight;
      setCalculatedHeight(newHeight);
    }
  };

  useEffect(() => {
    // Инициализация размеров
    updateDimensions();
    
    // Слушатель изменения размеров окна
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [initialHeight]);

  useEffect(() => {
    if (!containerRef.current || containerWidth === 0) return;

    // Очищаем контейнер
    containerRef.current.innerHTML = '';

    // Создаем элемент скрипта
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-discussion', discussion);
    script.setAttribute('data-comments-limit', commentsLimit.toString());
    script.setAttribute('data-height', calculatedHeight.toString());
    script.setAttribute('data-width', '100%'); // Ширина всегда 100% от контейнера
    
    if (color) {
      script.setAttribute('data-color', color);
    }

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [discussion, commentsLimit, calculatedHeight, color, containerWidth]);

  return (
    <div 
      className={`telegram-comments-container ${className}`}
      style={{ 
        width: '100%', 
        maxWidth: `${maxWidth}px`,
        margin: '0 auto',
        overflow: 'hidden'
      }}
    >
      <div 
        ref={containerRef}
        style={{ 
          width: '100%',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          minHeight: '200px'
        }}
      />
      
      {/* Индикатор загрузки */}
      {containerWidth === 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: `${calculatedHeight}px`,
          backgroundColor: '#f5f5f5',
          borderRadius: '12px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '3px solid #0088cc',
              borderTop: '3px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 15px'
            }}></div>
            <p style={{ color: '#666', margin: 0 }}>Загрузка комментариев...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TelegramComments;