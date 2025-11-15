# STASIS-web

[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Telegram Bot](https://img.shields.io/badge/Telegram_Bot-26A5E4?logo=telegram&logoColor=white)](https://core.telegram.org/bots)
[![wakatime](https://wakatime.com/badge/user/85043d71-6099-4bd2-af51-2c3525efd2b8/project/b9a8c787-2262-4969-ab3d-a58fa4dde13e.svg)](https://wakatime.com/badge/user/85043d71-6099-4bd2-af51-2c3525efd2b8/project/b9a8c787-2262-4969-ab3d-a58fa4dde13e)

---

## 🎯 О проекте

**STASIS-web** — веб-платформа альянса **STASIS (ST)** из игры *Warpath*.  
Проект объединяет инструменты для:

- 📚 **Wiki / база знаний**
- ⚔️ **Статистика и аналитика C4**
- 👤 **Профили участников**
- 🤖 **Telegram-уведомления**
- 🧩 **Интеграция с внутриигровыми данными Warpath**

Платформа работает на Next.js и предназначена для внутренних нужд альянса.

---

## 🚀 Основные возможности

### 📚 Wiki
- MDX-статьи с категориями и тегами  
- Поддержка форматирования, таблиц, кода, видео  
- Просмотры, статистика активности  
- Лёгкий редактор и система публикаций  

### ⚔️ C4 аналитика
- Автоматический сбор данных игроков через Warpath API  
- Стартовые / финальные показатели:
  - Power
  - Kills
  - Deaths
  - KD
  - Сбор ресурсов  
- Полный отчёт по C4 + уведомление в Telegram  

### 👤 Профили игроков
- Синхронизация с игровыми данными  
- Настраиваемый профиль пользователя  
- Ранг, роль, Telegram-связка  
- Публичная страница игрока  

### 🤖 Telegram-уведомления
- Уведомления о:
  - завершении C4  
  - новых статьях  
  - предупреждениях  
  - массовых сообщениях  
- Поддержка фото + HTML-текста  

---

## 🛠 Технологии

- **Next.js 14+ (App Router)**
- **React 19**
- **TypeScript**
- **TailwindCSS / shadcn/ui / Radix UI**
- **Prisma ORM**
- **PostgreSQL**
- **NextAuth (Discord OAuth + Credentials)**
- **AWS S3**
- **Telegram Bot API**
- **Docker**

---

## 📁 Структура проекта

```
src/
 ├─ app/                  # Маршруты Next.js, страницы и API
 │   ├─ wiki/             # Рендеринг Wiki статей
 │   ├─ api/c4/           # Старт / финиш событий C4
 │   ├─ profile/          # Профиль пользователя
 │   └─ admin/            # Админ-панель
 │
 ├─ components/           # Повторно используемые UI-компоненты
 ├─ lib/
 │   ├─ prisma.ts         # Инициализация Prisma
 │   ├─ auth.ts           # Настройки авторизации
 │   ├─ sendTextByTelegram.ts # Telegram-уведомления
 │   └─ ...               # Утилиты, типы, дата-хелперы
 │
 └─ prisma/
     ├─ schema.prisma     # Схема базы данных
     └─ migrations/       # Миграции БД

```

---

## ⚙️ Запуск проекта

### 1. Клонирование

```bash
git clone https://github.com/MatteyGG/stasis-wp
cd stasis-wp
```

### 2. Установка

```bash
npm install
```

### 3. Окружение

Файл `.env.local`:

```
DATABASE_URL=...
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...
AUTH_SECRET=...
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET_NAME=...
S3_REGION=...
```

### 4. Миграции

```bash
npx prisma migrate dev
```

### 5. Dev-режим

```bash
npm run dev
```

---

## 👤 Вклад

Проект ведётся **одним разработчиком**.  
PR не принимаются, но можно отправлять идеи и замечания.

---

## 📄 Лицензия

Лицензия: **ISC**
