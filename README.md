### Статус тестов и линтера Хекслета:
[![Actions Status](https://github.com/ThisisHappyEL/frontend-project-11/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/ThisisHappyEL/frontend-project-11/actions)

[![Maintainability](https://api.codeclimate.com/v1/badges/8f8a8553bd2f8c368d06/maintainability)](https://codeclimate.com/github/ThisisHappyEL/frontend-project-11/maintainability)

[![Netlify Status](https://api.netlify.com/api/v1/badges/6d97840e-9e00-46b7-a69c-b4aeb841ee9f/deploy-status)](https://app.netlify.com/sites/rss-reader-bythisishappy/deploys)

# RSS Агрегатор

[Ссылка на задеплоиный на netify.com агрегатор](https://rss-reader-bythisishappy.netlify.app/)

## Что это?

RSS агрегатор - это сервис, для динамического отображения и обновления новостных RSS лент.
Вы можете добавить любое и количество и в реальном времени ознакамливаться с постоянно поступающими новостными сводками.

## Использованные технологии
JavaScript:
  [yup](https://github.com/jquense/yup),
  [axios](https://github.com/axios/axios),
  [onChange](https://github.com/Qard/onchange),
  [i18next](https://www.i18next.com/), promises (native)

CI/CD:
  [vercel](https://vercel.com),
  [codeclimate](https://codeclimate.com/),
  [github actions](https://github.com/nbagr/frontend-project-11/actions)

Сборщик: [webpack](https://webpack.js.org/)

Макет стилей: [bootstrap 5](https://getbootstrap.com/)

## Установка и использование

```bash
git clone git@github.com:ThisisHappyEL/frontend-project-11.git - Клонирование репозитория локально
make install - Установка зависимостей
make develop - Запуск локального сервера

Далее вам остаётся лишь вставить любую ссылку, содержащую в себе RSS XML поток.
В качестве примера можно скопировать ссылку ниже поля ввода для ознакомления с функционалом.
```