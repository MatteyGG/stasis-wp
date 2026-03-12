'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { updatePlayerData } from '@/app/actions/gameDataToPlayer';

interface UpdatePlayerButtonProps {
  lastUpdated?: Date | null;
}

export default function UpdatePlayerButton({ lastUpdated }: UpdatePlayerButtonProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdate = async () => {
    setIsUpdating(true);
    setMessage('');
    
    try {
      const result = await updatePlayerData();
      
      if (result.success) {
        setMessage(result.message);
        // Обновляем страницу через секунду, чтобы показать обновленные данные
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage('Произошла ошибка при обновлении данных');
    } finally {
      setIsUpdating(false);
    }
  };

  // Проверяем, можно ли обновлять данные (прошло ли 12 часов)
  const canUpdate = !lastUpdated || (Date.now() - new Date(lastUpdated).getTime()) > 12 * 60 * 60 * 1000;
  
  return (
    <div className="mt-8">
      <Button 
        onClick={handleUpdate}
        disabled={isUpdating || !canUpdate}
        variant={canUpdate ? "default" : "secondary"}
        className="w-full md:w-auto"
      >
        {isUpdating ? 'Обновление...' : 'Обновить игровые данные'}
      </Button>
      
      {message && (
        <div className={`mt-2 p-2 rounded text-sm ${
          message.includes('Ошибка') || message.includes('возможно только') 
            ? 'bg-red-100 text-red-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {message}
        </div>
      )}
      
      {lastUpdated && (
        <div className="mt-1 text-xs text-muted-foreground">
          Последнее обновление: {new Date(lastUpdated).toLocaleString('ru-RU')}
        </div>
      )}
    </div>
  );
}