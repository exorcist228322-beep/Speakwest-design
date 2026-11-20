# SpeakWest Edu — UI prototype

Локальный кликабельный макет кабинета учителя SpeakWest Edu.  
Это **дизайн-прототип**: данные моковые, бэкенда нет. Нужен, чтобы сравнивать варианты UI и править визуал.

Репозиторий: [exorcist228322-beep/Speakwest-design](https://github.com/exorcist228322-beep/Speakwest-design)

## Быстрый старт

```bash
npm install
npm run dev
```

Открой URL из терминала (обычно `http://127.0.0.1:5173`).

Сборка:

```bash
npm run build
npm run preview
```

## Стек

- Vite + React 19 + TypeScript
- `react-router-dom` для страниц
- CSS-переменные и классы версий в `src/index.css`
- Тема и версия макета хранятся в `localStorage`

## Как устроены версии макета

В правом нижнем углу есть переключатель **Макет** (`v1` … `4.8`).

| Версия | Что смотреть |
|--------|----------------|
| v1 | Базовый кабинет + гамбургер |
| v2 | WhatsApp-like фон-паттерн |
| v3 / 3.1 | Edvibe-like icon rail |
| 3.2–3.4 | Rail без верхнего хедера, профиль в сайдбаре, разные палитры |
| 4.1 | Home: activity + сетка 3×2 белых stat-карточек |
| 4.2 | Home: цветные soft metric-tiles |
| 4.3–4.4 | Панели с accent-линией, welcome-баннер в 4.4 |
| 4.6 | Campus-карточки + плашка активности |
| 4.7 | Пропорции как 4.6 + стиль плиток как 4.2 + плашка как 4.6 |
| **4.8** | Как 4.7, но карточки как в 4.4; разделы, «Ученики» и «Настройки» как в EdVibe |

Тема (светлая/тёмная) и logout — в меню профиля в rail (версии 3.2+).

Подробнее: [`docs/DESIGN_VERSIONS.md`](docs/DESIGN_VERSIONS.md)

## Структура проекта

```
src/
  App.tsx                 # роутинг
  main.tsx
  index.css               # весь визуал + палитры версий
  context/UiPrefs.tsx     # theme + version (localStorage)
  data/mock.ts            # моковые ученики/курсы
  components/
    Layout.tsx            # shell, rail, version switcher
    Icons.tsx
    NewCourseModal.tsx
  pages/
    Home.tsx              # главная: разные layout по version
    Courses.tsx
    CourseDetail.tsx
    Lesson.tsx
    Students.tsx          # 4.8 → StudentsEdvibe.tsx
    Settings.tsx          # профиль и тема
    Review.tsx
public/                   # логотипы, паттерн фона
```

## Ветки

| Ветка | Назначение |
|-------|------------|
| `main` | Актуальный полный прототип |
| `develop` | Рабочая ветка для следующих правок |
| `design/home-v47` | Точка для итераций home 4.7 |
| `docs/onboarding` | Документация для онбординга разработчика |

Новые UI-эксперименты лучше вести от `develop` отдельной веткой `design/...`, затем мержить.

## Что можно кликать

- Навигация: Главная, Курсы, Ученики, Проверка
- Курсы → карточка → урок
- «Новый курс» (модалка-заглушка)
- Переключатель макетов и темы

## Для другого разработчика

1. Не ломай существующие версии без нужды — правь через `version === 'vXX'` / классы `.version-vXX`.
2. Новая версия макета:
   - добавить тип в `UiPrefs.tsx`
   - кнопку в `Layout.tsx`
   - CSS-переменные `.version-vXX`
   - разметку в `Home.tsx` (и при необходимости других страницах)
   - включить `vXX` в `:is(...)` селекторы rail в `index.css`
3. Стили версий 3.2+ для rail собраны через `:is(.version-v32, ...)` — при добавлении версии допиши класс туда.
4. Секретов/API-ключей в репо нет.
