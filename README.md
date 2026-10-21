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

## Заметки о точности

- Макет рассчитан на ширину 1440px, страница фиксированной ширины и центрируется.
- Высоты строк округлены до целых пикселей, как это делает Figma (например, 48px × 1.1 → 53px).
- Фон секции Autopilot — изображение + шейдер Figma «Water caustic» (WebGPU) в режиме
  `overlay` с непрозрачностью 80% + затемнение 20%. Режим наложения подобран по рендеру Figma.
  В браузерах без WebGPU шейдер не рисуется, остаётся изображение с затемнением.
- Прогрессивные блюры Figma повторены слоями `backdrop-filter` (радиус Figma R ≈ CSS `blur(R/2)`).
- Шрифт подписи «Jobscan users have been hired by» — коммерческий *Nimbus Sans Novus D*,
  он не входит в репозиторий. Чтобы подключить его, положите лицензионный `.woff2` в `public/assets/fonts/`
  и добавьте `url()` в `src/styles/fonts.css`.
