import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, MessageCircle, Users, Sword, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl">
      <h1 className="text-4xl md:text-6xl font-bold text-primary mb-8 text-center">
        О нас
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Users className="h-6 w-6" />
              Кто мы?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">
              Стазис — международный альянс, в основном состоящий из русскоязычных игроков. 
              Мы ценим общение и часто общаемся в голосовом чате — не только по игре, 
              но и для приятного времяпрепровождения.
            </p>
            <p className="text-lg leading-relaxed mt-4">
              Наши игроки имеют опыт более года, что помогает нам уверенно справляться 
              с любыми задачами. Мы любим сражаться, но также понимаем важность дипломатии.
            </p>
            <p className="text-lg leading-relaxed mt-4">
              В нашем альянсе открыты к новым идеям и множеству точек зрения. 
              Мы всегда готовы поддержать интересные предложения, чтобы сделать 
              наше сообщество ещё сильнее и интереснее.
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-center items-center">
          <Image
            className="w-full max-w-xs hover:scale-105 transition-transform duration-500"
            src="/source/icon/Stasis_logo.png"
            width={400}
            height={400}
            alt="Логотип альянса Стазис"
            priority
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="text-center rounded-2xl">
          <CardHeader>
            <div className="flex justify-center">
              <Users className="h-12 w-12 text-primary" />
            </div>
            <CardTitle>Сообщество</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-lg">
              Активное русскоязычное сообщество с дружеской атмосферой
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="text-center rounded-2xl">
          <CardHeader>
            <div className="flex justify-center">
              <Sword className="h-12 w-12 text-primary" />
            </div>
            <CardTitle>Опыт</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-lg">
              Игроки с опытом более года, готовые к любым вызовам
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="text-center rounded-2xl">
          <CardHeader>
            <div className="flex justify-center">
              <Heart className="h-12 w-12 text-primary" />
            </div>
            <CardTitle>Поддержка</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-lg">
              Всегда готовы помочь новым участникам и выслушать идеи
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Кому писать?</CardTitle>
          <CardDescription className="text-center">
            Свяжитесь с нами по любым вопросам
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Технические вопросы
              </h3>
              <p className="text-muted-foreground mb-4">
                По вопросам, связанным с техническим состоянием сайта и предложениям по его улучшению
              </p>
              <div className="flex flex-col gap-3">
                <Button asChild variant="outline" className="justify-start">
                  <Link href="https://t.me/ser_dantes_r" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    @ser_dantes_r
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link href="mailto:stasis.wp@gmail.com">
                    <Mail className="mr-2 h-4 w-4" />
                    stasis.wp@gmail.com
                  </Link>
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Игровые вопросы
              </h3>
              <p className="text-muted-foreground mb-4">
                По вопросам, связанным с игрой, вступлением в альянс и участием в мероприятиях
              </p>
              <div className="flex flex-col gap-3">
                <Button asChild variant="outline" className="justify-start">
                  <Link href="https://t.me/mafon101" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    @mafon101
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link href="mailto:stasis.wp@gmail.com">
                    <Mail className="mr-2 h-4 w-4" />
                    stasis.wp@gmail.com
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center mt-12 text-muted-foreground">
        <p>Присоединяйтесь к нам и станьте частью дружной команды!</p>
      </div>
    </div>
  );
}