// components/profile/TelegramForm.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { updateTelegramRef } from '@/app/actions/telegram'

interface TelegramFormProps {
  currentTgRef: string
  userId: string
}

// Функция для извлечения username из различных форматов
function extractTelegramUsername(input: string): string | null {
  if (!input) return null
  
  // Убираем пробелы в начале и конце
  const cleanInput = input.trim()
  
  // Если это уже username (начинается с @)
  if (cleanInput.startsWith('@')) {
    return cleanInput.slice(1)
  }
  
  // Если это полная ссылка
  if (cleanInput.includes('t.me/')) {
    try {
      const url = new URL(cleanInput.startsWith('http') ? cleanInput : `https://${cleanInput}`)
      if (url.hostname === 't.me' || url.hostname.endsWith('.t.me')) {
        const pathParts = url.pathname.split('/').filter(part => part)
        if (pathParts.length > 0) {
          return pathParts[0]
        }
      }
    } catch (e) {
      console.error('Invalid Telegram link:', cleanInput + ' ' + e)
    }
  }
  
  // Если это просто текст без @, считаем это username
  return cleanInput
}

export default function TelegramForm({ currentTgRef, userId }: TelegramFormProps) {
  const [inputValue, setInputValue] = useState(currentTgRef ? `@${currentTgRef}` : '')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Извлекаем username из введенного значения
    const extractedUsername = extractTelegramUsername(inputValue)

    // Валидация
    if (!extractedUsername) {
      toast.error('Пожалуйста, введите имя пользователя Telegram или ссылку')
      setIsLoading(false)
      return
    }

    if (extractedUsername.length > 32) {
      toast.error('Слишком длинное имя пользователя Telegram (максимум 32 символа)')
      setIsLoading(false)
      return
    }

    // Проверяем допустимые символы (только буквы, цифры и подчеркивания)
    const validRegex = /^[a-zA-Z0-9_]*$/
    if (!validRegex.test(extractedUsername)) {
      toast.error('Имя пользователя Telegram может содержать только буквы, цифры и подчеркивания')
      setIsLoading(false)
      return
    }

    if (extractedUsername === currentTgRef) {
      toast.error('Это имя пользователя уже установлено')
      setIsLoading(false)
      return
    }

    try {
      const result = await updateTelegramRef(userId, extractedUsername)
      
      if (result.success) {
        toast.success('Имя пользователя Telegram успешно обновлено')
        setInputValue(`@${extractedUsername}`)
      } else {
        toast.error(result.error || 'Не удалось обновить имя пользователя')
      }
    } catch (error) {
      toast.error('Произошла ошибка при обновлении')
      console.error('Telegram update error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Обработка изменения значения в поле ввода
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    // Автоматически добавляем @, если пользователь начинает ввод
    if (value.length === 1 && value !== '@') {
      setInputValue('@' + value)
    } else {
      setInputValue(value)
    }
  }

  // Примеры допустимых форматов для подсказки
  const formatExamples = [
    { example: "@username", description: "Имя пользователя" },
    { example: "t.me/username", description: "Короткая ссылка" },
    { example: "https://t.me/username", description: "Полная ссылка" }
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tgref">Имя пользователя Telegram или ссылка</Label>
        <Input
          id="tgref"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="@username или https://t.me/username"
          className="max-w-md"
          disabled={isLoading}
        />
        <p className="text-sm text-muted-foreground">
          Текущее значение: {currentTgRef ? `@${currentTgRef}` : 'не указано'}
        </p>
        
        <div className="mt-2 p-3 bg-muted rounded-lg">
          <p className="text-sm font-medium mb-2">Примеры допустимых форматов:</p>
          <ul className="text-sm space-y-1">
            {formatExamples.map((item, index) => (
              <li key={index} className="flex">
                <span className="font-mono bg-background px-2 py-1 rounded mr-2">{item.example}</span>
                <span className="text-muted-foreground">— {item.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <Button 
        type="submit" 
        disabled={isLoading || extractTelegramUsername(inputValue) === currentTgRef}
        className="rounded-xl"
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin mr-2" />
            Обновление...
          </>
        ) : (
          'Обновить'
        )}
      </Button>
    </form>
  )
}