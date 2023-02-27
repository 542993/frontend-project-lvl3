import _ from 'lodash';
import onChange from 'on-change';
import render from './view.js';
import validate from './validate.js';

export default () => {
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
    console.log('url is', urlValue);
    watchedState.formState.fields.url = urlValue;
    const listUrls = watchedState.feeds.map((feed) => feed.url);
    validate(urlValue, listUrls)
      .then((errors) => {
        console.log('ошибки', errors);
        watchedState.formState.error = errors;
      })
      .then(() => {
        console.log('isEmpty', _.isEmpty(watchedState.formState.error));
        watchedState.formState.valid = _.isEmpty(watchedState.formState.error);
        if (watchedState.formState.valid) {
          watchedState.formState.processState = 'sending';
        } else {
          watchedState.formState.processState = 'filling';
        }
      });
    console.log(watchedState);
  });
};
