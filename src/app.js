import * as yup from 'yup';
import _ from 'lodash';
import axios from 'axios';
import i18n from 'i18next';
import resources from './locales/index.js';
import locale from './locales/yupLocales.js';
import watcher from './watchers.js';
import parse from './rss.js';

const fetchingIntervalTime = 5000;

const addProxy = (url) => {
  const urlWithProxy = new URL('/get', 'https://allorigins.hexlet.app');
  urlWithProxy.searchParams.set('url', url);
  urlWithProxy.searchParams.set('disableCache', 'true');
  return urlWithProxy.toString();
};

const getLoadingProcessError = (error) => {
  if (error.isParsingError) {
    return 'notIncludeRSS';
  }
  if (error.isAxiosError) {
    return 'networkError';
  }
  return 'unknown';
};

const fetchNewPosts = (watchedState) => {
  Promise.all(watchedState.currentFeeds.map((feed) => {
    const proxyUrl = addProxy(feed.url);
    return axios.get(proxyUrl)
      .then((response) => {
        const feedData = parse(response.data.contents);
        const allPosts = feedData.news.map((item) => ({ ...item, channelId: feed.id }));
        const previousPosts = watchedState.posts.filter((post) => post.channelId === feed.id);
        const posts = _.differenceWith(
          allPosts,
          previousPosts,
          (p1, p2) => p1.itemTitle === p2.itemTitle,
        )
          .map((post) => ({ ...post, id: _.uniqueId() }));
        watchedState.posts.unshift(...posts);
      })
      .catch((er) => {
        console.log(`Не удалось добавить новый пост ${er}`);
      });
  }))
    .finally(() => {
      setTimeout(() => fetchNewPosts(watchedState), fetchingIntervalTime);
    });
};

const loadRss = (watchedState, url) => {
  const { loadingProcess } = watchedState;
  loadingProcess.status = 'loading';
  const proxyUrl = addProxy(url);
  return axios.get(proxyUrl)
    .then((response) => {
      const data = parse(response.data.contents);
      const feed = {
        url, id: _.uniqueId(), title: data.title, description: data.description,
      };
      const posts = data.news.map((item) => ({ ...item, channelId: feed.id, id: _.uniqueId() }));
      watchedState.posts.unshift(...posts);
      watchedState.currentFeeds.unshift(feed);

      loadingProcess.error = null;
      loadingProcess.status = 'idle';
    })
    .catch((er) => {
      loadingProcess.error = getLoadingProcessError(er);
      loadingProcess.status = 'failed';
    });
};

const app = () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    feedbackInscription: document.querySelector('.text-danger'),
    input: document.querySelector('#url-input'),
    submit: document.querySelector('button[type="submit"]'),
    feedsMain: document.querySelector('.feeds'),
    postsMain: document.querySelector('.posts'),
    modalWindow: document.querySelector('#modal'),
  };

  const state = {
    lng: 'ru',
    currentFeeds: [],
    posts: [],
    loadingProcess: {
      status: 'idle',
      error: null,
    },
    urlForm: {
      stateError: null,
      urlValid: false,
    },
    modalState: {
      postId: null,
    },
    interfaceState: {
      seenPosts: new Set(),
    },
  };

  const i18nInstance = i18n.createInstance();
  const promise = i18nInstance.init({
    lng: state.lng,
    resources,
  })
    .then(() => {
      yup.setLocale(locale);
      const validateURL = (url, currentFeeds) => {
        const feedsUrl = currentFeeds.map((feed) => feed.url);
        const schema = yup.string().required().url().notOneOf(feedsUrl);

        return schema.validate(url)
          .then(() => null)
          .catch((err) => i18nInstance.t(`errors.${err.message}`));
      };

      const watchedState = watcher(state, elements, i18nInstance);

      elements.form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const url = formData.get('url').trim();

        validateURL(url, watchedState.currentFeeds)
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
              loadRss(watchedState, url);
            }
          })
          .catch((er) => console.log(`Проблема с валидацией - ${er}`));
      });

      elements.postsMain.addEventListener('click', (clickZone) => {
        if ('id' in clickZone.target.dataset) {
          const { id } = clickZone.target.dataset;
          watchedState.modalState.postId = String(id);
          watchedState.interfaceState.seenPosts.add(id);
        }
        return 'none clicable';
      });

      setTimeout(() => fetchNewPosts(watchedState), fetchingIntervalTime);
    })
    .catch((er) => console.log(`Ошибка на уровне создания локалей валидации - ${er}`));

  return promise;
};
export default app;
