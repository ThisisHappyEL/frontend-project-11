import * as yup from 'yup';
import i18n from 'i18next';
import resources from './locales/index.js';
import locale from './locales/yupLocales.js';
import watcher from './watchers.js';
// import fs from 'fs';
// import axios from 'axios';

const app = () => {
  const state = {
    lng: 'ru',
    currentFeeds: [],
    urlForm: {
      stateError: null,
      urlValid: false,
    },
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    invalidUrlMessage: document.querySelector('.text-danger'),
    input: document.querySelector('#url-input'),
  };

  const i18nInstance = i18n.createInstance();
  const promise = i18nInstance.init({
    lng: state.lng,
    resources,
  })
    .then(() => {
      yup.setLocale(locale);
      const validateURL = (url) => {
        const schema = yup.string().required().url().notOneOf(state.currentFeeds);
        return schema.validate(url)
          .then(() => null)
          .catch((err) => i18nInstance.t(`errors.${err.message}`));
      };

      const watchedState = watcher(state, elements, i18nInstance);

      elements.form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const url = formData.get('url').trim();

        validateURL(url)
          .then((error) => {
            if (error) {
              watchedState.urlForm = {
                stateError: error,
                urlValid: false,
              };
            } else {
              watchedState.urlForm = {
                stateError: null,
                urlValid: true,
              };
              watchedState.currentFeeds.push(url);
            }
          });
      });
    });

  return promise;
};
export default app;
