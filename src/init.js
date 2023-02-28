import _ from 'lodash';
import i18next from 'i18next';
import onChange from 'on-change';
import render from './view.js';
import validate from './validate.js';
import ru from './locales/ru.js';

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
      error: null,
      fields: {
        url: '',
      },
    },
    posts: [],
    feeds: [
      { url: 'https://ru.hexlet.io/lessons.rss', title: '', description: '' },
    ],
  };

  const elements = {
    formEl: document.querySelector('.rss-form'),
    inputEl: document.querySelector('#url-input'),
    buttonEl: document.querySelector('button[type="submit]'),
  };
  const watchedState = onChange(state, render(elements));

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
          watchedState.formState.processState = 'sending';
        } else {
          watchedState.formState.processState = 'filling';
        }
      });
    console.log('state', watchedState);
  });
};
