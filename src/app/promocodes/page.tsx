import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import PromocodeItem from "@/components/promocodes";

export default async function Promocodes() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/promocode`
  );
  const promocodes = await response.json();
  const sortedPromocodes = [...promocodes.data].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl">
      <Card className="mt-6 rounded-2xl">
        <CardHeader>
          <CardTitle>Промокоды</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">Где найти промокоды?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Промокоды публикуются в телеграм-канале альянса и на нашем сайте.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Куда вводить промокоды?</h3>
            <ol className="list-decimal list-inside text-sm text-muted-foreground mt-1">
              <li>
                Перейди по ссылке:{" "}
                <a
                  href="https://cdkey.lilith.com/warpath-global"
                  className="underline "
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://cdkey.lilith.com/warpath-global
                </a>{" "}
                .
              </li>
              <li>
                Введи свой идентификатор пользователя (ID) и нажми «Отправить
                код».
              </li>
              <li>
                Проверь внутриигровую почту в разделе SYSTEM — там будет код
                подтверждения.
              </li>
              <li>Скопируй этот код, вставь его на сайте и нажми LOGIN.</li>
              <li>Введи промокод и нажми «Использовать».</li>
            </ol>
          </div>
        </CardContent>
      </Card>
      {/* Блок с промокодами */}
      <Card className="md:col-span-1 rounded-2xl flex flex-col">
        <ul className="m-2 md:m-4 mt-8 md:mt-12 grid grid-cols-2 gap-2 flex-1">
          {sortedPromocodes.slice(0, 20).map((promocode, index) => (
            <PromocodeItem key={index} promocode={promocode} />
          ))}
        </ul>
      </Card>
    </div>
  );
}
