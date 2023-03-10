import _ from 'lodash';
import i18next from 'i18next';
import onChange from 'on-change';
import axios from 'axios';
import render from './view.js';
import validate from './validate.js';
import ru from './locales/ru.js';
import parse from './parser.js';

const routes = {
  proxyUrl: (url) => {
    const proxyUrl = new URL('https://allorigins.hexlet.app/get');
    proxyUrl.searchParams.set('disableCache', 'true');
    proxyUrl.searchParams.set('url', url);
    return proxyUrl.toString();
  },
};
export default () => {
  const defaultLanguege = 'ru';
  const i18nInstance = i18next.createInstance();
  i18nInstance
    .init({
      lng: defaultLanguege,
      debug: false,
      resources: {
        ru,
      },
    })
    .then(console.log)
    .catch((err) => console.log('error', err));

  const state = {
    formState: {
      valid: true,
      processState: 'filling',
      processError: null,
      error: [],
      fields: {
        url: '',
      },
    },
    posts: [],
    feeds: [],
  };

  const elements = {
    formEl: document.querySelector('.rss-form'),
    inputEl: document.querySelector('#url-input'),
    buttonEl: document.querySelector('button[type="submit]'),
    feedBackEl: document.querySelector('.feedback'),
    postsContainer: document.querySelector('.posts'),
    feedsContainer: document.querySelector('.feeds'),
  };
  const watchedState = onChange(state, render(elements, i18nInstance));

  console.log(elements.formEl);
  elements.formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const urlValue = new FormData(e.target).get('url').trim();
    watchedState.formState.fields.url = urlValue;
    const listUrls = watchedState.feeds.map((feed) => feed.url);
    validate(urlValue, listUrls, i18nInstance)
      .then((errors) => {
        watchedState.formState.error = errors;
      })
      .then(() => {
        watchedState.formState.valid = _.isEmpty(watchedState.formState.error);
        if (watchedState.formState.valid) {
          watchedState.formState.processState = 'loading';
          watchedState.formState.processError = null;
          axios
            .get(routes.proxyUrl(watchedState.formState.fields.url))
            .then((response) => {
              const parseRes = parse(response.data.contents, watchedState.formState.fields.url);
              const { feed, posts } = parseRes;
              watchedState.formState.processState = 'loaded';
              watchedState.feeds = [feed, ...watchedState.feeds];
              watchedState.posts = [...posts, ...watchedState.posts];
            })
            .catch((err) => {
              watchedState.formState.processState = 'failed';
              if (axios.isAxiosError(err)) {
                watchedState.formState.processError = [i18nInstance.t('messages.errors.network_error')];
              } else {
                watchedState.formState.processError = [i18nInstance.t('messages.errors.not_rss')];
              }
            });
        } else {
          watchedState.formState.processState = 'filling';
        }
      });
    console.log('state', watchedState);
  });
};
