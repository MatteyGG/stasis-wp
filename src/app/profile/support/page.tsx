import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Mail, MessageCircle } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="flex flex-col p-4 md:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Поддержка</h1>
        <p className="text-muted-foreground mt-2">
          Свяжитесь с нами, если у вас возникли вопросы или проблемы
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Телеграм
            </CardTitle>
            <CardDescription>
              Напишите нам в Telegram для быстрой связи
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Техническая поддержка:</h3>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="https://t.me/ser_dantes_r" target="_blank" rel="noopener noreferrer">
                  @ser_dantes_r
                </Link>
              </Button>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Лидер альянса:</h3>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="https://t.me/mafon101" target="_blank" rel="noopener noreferrer">
                  @mafon101
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Электронная почта
            </CardTitle>
            <CardDescription>
              Напишите нам на почту для официальных обращений
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="mailto:stasis.wp@gmail.com">
                stasis.wp@gmail.com
              </Link>
            </Button>
            
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Обычно отвечаем в течение 24 часов</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 rounded-2xl">
        <CardHeader>
          <CardTitle>Часто задаваемые вопросы</CardTitle>
          <CardDescription>
            Возможно, ответ на ваш вопрос уже есть здесь
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">Как часто обновляется игровая статистика?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Зависит от сторонних серверов, обычно в течение 2-3 дней.
            </p>
          </div>
          
          
          <div>
            <h3 className="font-medium">Где найти промокоды?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Промокоды публикуются в телеграм-канале альянса и на нашем сайте.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Куда вводить промокоды?</h3>
            <ol className="list-decimal list-inside text-sm text-muted-foreground mt-1">
              <li>Перейди по ссылке: <a href="https://cdkey.lilith.com/warpath-global" className='underline ' target="_blank" rel="noopener noreferrer">https://cdkey.lilith.com/warpath-global</a> .</li>
              <li>Введи свой идентификатор пользователя (ID) и нажми «Отправить код».</li>
              <li>Проверь внутриигровую почту в разделе SYSTEM — там будет код подтверждения.</li>
              <li>Скопируй этот код, вставь его на сайте и нажми LOGIN.</li>
              <li>Введи промокод и нажми «Использовать».</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}