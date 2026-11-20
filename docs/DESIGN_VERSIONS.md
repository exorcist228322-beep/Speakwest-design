# UI version map

Все версии живут в одном коде. Переключатель в UI пишет `sw-version` в `localStorage` и ставит класс `version-vXX` на shell.

## База

- **v1** — классический header + sidebar, home со stats + ученики
- **v2** — фон `bg-edu-pattern.svg`, та же структура
- **v3** — icon rail (сворачивается/раскрывается по hover)
- **3.1 (`v31`)** — серая «пластина», eagle logo
- **3.2 (`v32`)** — без top header, профиль в rail, Students = graduation cap
- **3.3 / 3.4** — более яркие палитры на базе 3.2

## Home redesign (v4.x)

- **4.1** — activity strip + 6 белых `stat-card` в сетке 3×2
- **4.2** — soft `metric-tile` (цветные заливки, иконка справа сверху)
- **4.3** — белые `panel-v43` с цветной полоской слева + стрелки
- **4.4** — как 4.3 + welcome-баннер вместо обычного page-top
- **4.6** — campus: плашка активности с blobs + цветные campus-карточки 3×2
- **4.7** — пропорции/плашка как 4.6, стиль плиток как 4.2  
  (ачивки = `0`, настройки без стрелки/числа)

## Где править

| Задача | Файл |
|--------|------|
| Список версий | `src/context/UiPrefs.tsx` |
| Кнопки переключателя / rail | `src/components/Layout.tsx` |
| Home layouts | `src/pages/Home.tsx` |
| Палитры и CSS блоков | `src/index.css` |
