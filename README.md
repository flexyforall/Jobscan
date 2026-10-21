# Jobscan — Home

Вёрстка главной страницы Jobscan по макету Figma
([Jobscan, node 44:128](https://www.figma.com/design/9zsPxPC1Skxy98Qe10G3Yl/Jobscan?node-id=44-128)).

Стек: Vite + React + TypeScript, обычный CSS (по файлу стилей на компонент, токены в `src/styles/tokens.css`).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # сборка в dist/
```

## Структура

```
public/assets/
  fonts/    Instrument Sans (variable), Inter Medium — woff2 + лицензии OFL
  icons/    SVG-иконки из Figma
  images/   фоновые изображения (панель резюме, секция Autopilot)
  logos/    логотипы компаний
src/
  components/                 секции и компоненты страницы
  lib/custom-effect-runtime/  WebGPU-рантайм шейдеров Figma (без изменений)
  lib/custom-effects/         шейдер «Water caustic» фона секции Autopilot
  styles/                     шрифты, токены, базовые стили
```

## Анимация

По раскадровке Figma ([Loader, node 52:551](https://www.figma.com/design/9zsPxPC1Skxy98Qe10G3Yl/Jobscan?node-id=52-551)):

1. **Лоадер** (`src/components/Loader.tsx`): зелёная полоса сканирования ездит вверх-вниз;
   в квадрате 56×56 проценты реальной загрузки страницы (шрифты, все картинки, `window.load`),
   по штрихам вокруг вращается градиент яркости. Заполнение занимает минимум 1.6 с.
2. **Раскрытие:** квадрат становится окном на страницу и растёт 56×56 → 160×56 → 622×218 → весь экран.
3. **Появление контента:** элементы с атрибутом `data-reveal` плавно проявляются при попадании в экран
   (`src/intro.tsx`, `src/styles/motion.css`), цифры 88% считаются от нуля, полосы метрик раскрываются слева направо.
4. **Заголовки** «Your job search, on autopilot» и «Scan your resume. Beat the ATS.» (`RevealText`):
   текст из серого становится чёрным, ещё не проявленная часть фразы размыта.

При включённой в системе настройке «уменьшить движение» лоадер быстро исчезает, контент появляется без смещений.

## Заметки о точности

- Макет рассчитан на ширину 1440px, страница фиксированной ширины и центрируется.
- Высоты строк округлены до целых пикселей, как это делает Figma (например, 48px × 1.1 → 53px).
- Фон секции Autopilot — изображение + шейдер Figma «Water caustic» (WebGPU) в режиме
  `overlay` с непрозрачностью 80% + затемнение 20%. Режим наложения подобран по рендеру Figma.
  В браузерах без WebGPU шейдер не рисуется, остаётся изображение с затемнением.
- В макете заголовки зафиксированы в середине анимации («pilot» и «e ATS.» серые и размытые);
  после анимации они полностью чёрные.
- Прогрессивные блюры Figma повторены слоями `backdrop-filter` (радиус Figma R ≈ CSS `blur(R/2)`).
- Шрифт подписи «Jobscan users have been hired by» — коммерческий *Nimbus Sans Novus D*,
  он не входит в репозиторий. Чтобы подключить его, положите лицензионный `.woff2` в `public/assets/fonts/`
  и добавьте `url()` в `src/styles/fonts.css`.
