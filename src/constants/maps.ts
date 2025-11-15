export const maps = {
    cairo: "Каир",
    newyork: "Нью-Йорк",
    moscow: "Москва",
    sea: "Эгейское море",
    vancouver: "Ванкувер",
    berlin: "Берлин",
    paris: "Париж",
    london: "Лондон",
    rome: "Рим",
    chicago: "Чикаго",
    sanfrancisco: "Сан-Франциско",
    iceland: "Исландия",
    hawaii: "Гавайи"
};

// Функция для безопасного получения значения
export const getMapValue = (key: string): string => {
  return maps[key as keyof typeof maps] || Object.values(maps)[0] || '';
};

// Константа с безопасным значением по умолчанию
export const defaultMapValue = getMapValue('');

export type MapKeys = keyof typeof maps;
export type MapValues = typeof maps[MapKeys];