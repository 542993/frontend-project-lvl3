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
const checkForUpdate = (watchedState) => {
  const promises = watchedState.feeds.map((feed) => axios
    .get(routes.proxyUrl(feed.url))
    .then((response) => {
      const { posts: updatedPosts } = parse(response.data.contents, feed.url);
      const currentPosts = watchedState.posts
        .filter((post) => post.feedId === feed.id)
        .map((post) => post.title);
      const newPosts = updatedPosts.filter(
        (post) => !currentPosts.includes(post.title)
      );
      const postsWithId = newPosts.map((post) => ({
        ...post,
        id: _.uniqueId(),
        feedId: feed.id,
      }));
      watchedState.posts = [...postsWithId, ...watchedState.posts];
    })
    .catch((err) => console.error(err)));
  Promise.all(promises).then(() => setTimeout(() => checkForUpdate(watchedState), 5000));
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
      error: null,
      fields: {
        url: '',
      },
    },
    posts: [],
    feeds: [],
    processState: 'filling',
    processError: null,
    uiState: {
      viewedPosts: new Set(),
      openedModal: null,
    },
  };

  const elements = {
    formEl: document.querySelector('.rss-form'),
    inputEl: document.querySelector('#url-input'),
    buttonEl: document.querySelector('#submit-button'),
    feedBackEl: document.querySelector('.feedback'),
    postsContainer: document.querySelector('.posts'),
    feedsContainer: document.querySelector('.feeds'),
    modal: document.querySelector('#modal'),
  };
  const watchedState = onChange(state, render(elements, i18nInstance, state));

  elements.formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const urlValue = new FormData(e.target).get('url').trim();
    watchedState.formState.fields.url = urlValue;
    const listUrls = watchedState.feeds.map((feed) => feed.url);
    validate(urlValue, listUrls)
      .then(() => {
        watchedState.formState.valid = true;
        watchedState.processState = 'loading';
        watchedState.processError = null;
        return axios
          .get(routes.proxyUrl(watchedState.formState.fields.url))
          .then((response) => {
            const parseRes = parse(
              response.data.contents,
              watchedState.formState.fields.url
            );
            const { feed, posts } = parseRes;
            watchedState.processState = 'loaded';
            const feedWithId = {
              ...feed,
              id: _.uniqueId(),
            };
            const postsWithId = posts.map((post) => ({
              ...post,
              feedId: feedWithId.id,
              id: _.uniqueId(),
            }));
            watchedState.feeds = [feedWithId, ...watchedState.feeds];
            watchedState.posts = [...postsWithId, ...watchedState.posts];
          });
      })
      .catch((err) => {
        watchedState.processState = 'failed';
        watchedState.formState.valid = false;
        if (axios.isAxiosError(err)) {
          watchedState.processError = i18nInstance.t('messages.errors.network_error');
        } else if (err.isParsingError) {
          watchedState.processError = i18nInstance.t('messages.errors.not_rss');
        } else {
          watchedState.formState.error = i18nInstance.t(err.errors);
          watchedState.formState.valid = false;
        }
      });
  });
  elements.postsContainer.addEventListener('click', (e) => {
    const { id: linkedPostId } = e.target.dataset;
    watchedState.uiState.viewedPosts.add(linkedPostId);
    watchedState.uiState.openedModal = linkedPostId;
  });
  setTimeout(() => checkForUpdate(watchedState), 5000);
};
