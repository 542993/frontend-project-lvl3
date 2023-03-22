const renderFeedback = (elements, message, mode = 'danger') => {
  elements.feedBackEl.textContent = '';
  elements.feedBackEl.classList.remove('text-danger', 'text-success');
  elements.feedBackEl.classList.add(`text-${mode}`);
  elements.feedBackEl.textContent = message;
};
const handleProcessState = (elements, processState) => {
  switch (processState) {
    case 'failed':
    case 'filling':
      elements.buttonEl.disabled = false;
      elements.inputEl.removeAttribute('readonly');
      break;
    case 'loading':
      elements.buttonEl.disabled = true;
      elements.inputEl.setAttribute('readonly', true);
      break;
    case 'loaded':
      elements.buttonEl.disabled = false;
      elements.inputEl.removeAttribute('readonly');
      break;
    default:
      throw new Error(`Unknown process state: ${processState}`);
  }
};
const buildCardElement = (title) => {
  const cardEl = document.createElement('div');
  cardEl.classList.add('card', 'border-0');
  const cardBodyEl = document.createElement('div');
  cardBodyEl.classList.add('card-body');
  const titleEl = document.createElement('h2');
  titleEl.classList.add('card-title', 'h4');
  titleEl.textContent = title;
  cardBodyEl.append(titleEl);
  const listEl = document.createElement('ul');
  listEl.classList.add('list-group', 'border-0', 'rounded-0');
  cardEl.append(cardBodyEl, listEl);
  return { cardEl, listEl };
};

const renderFeeds = (elements, value, i18next) => {
  elements.feedsContainer.innerHTML = '';
  const { cardEl, listEl } = buildCardElement(i18next.t('headings.feeds'));
  elements.feedsContainer.append(cardEl);
  const feedList = value.map((feed) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3 = document.createElement('h3');
    h3.classList.add('h-6', 'm-0');
    h3.textContent = feed.title;
    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = feed.decription;
    liEl.append(h3, p);
    return liEl;
  });
  listEl.append(...feedList);
};

const renderPosts = (elements, value, i18next, state) => {
  elements.postsContainer.innerHTML = '';
  const { cardEl, listEl } = buildCardElement(i18next.t('headings.posts'));
  elements.postsContainer.append(cardEl);
  const postList = value.map((post) => {
    const liEl = document.createElement('li');
    liEl.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );
    const aEl = document.createElement('a');
    aEl.href = post.link;
    aEl.classList.add(state.uiState.viewedPosts.has(post.id) ? ('fw-normal', 'link-secondary') : 'fw-bold');
    aEl.dataset.id = post.id;
    aEl.target = '_blank';
    aEl.rel = 'noopener noreferrer';
    aEl.textContent = post.title;
    const buttonEl = document.createElement('button');
    buttonEl.type = 'button';
    buttonEl.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    buttonEl.dataset.id = post.id;
    buttonEl.dataset.bsToggle = 'modal';
    buttonEl.dataset.bsTarget = '#modal';
    buttonEl.textContent = 'Просмотр';
    liEl.append(aEl, buttonEl);
    return liEl;
  });
  listEl.append(...postList);
};
const renderModal = (elements, value, state) => {
  const titleEl = elements.modal.querySelector('.modal-title');
  const descriptionEl = elements.modal.querySelector('.modal-body');
  const linkEl = elements.modal.querySelector('.modal-footer > a');
  const openedPost = state.posts.find((post) => post.id === value);
  const { link, description, title } = openedPost;
  titleEl.textContent = title;
  descriptionEl.textContent = description;
  linkEl.href = link;
};

const render = (elements, i18nInstance, state) => (path, value) => {
  switch (path) {
    case 'formState.valid':
      if (!value) {
        elements.inputEl.classList.add('is-invalid');
      } else {
        elements.inputEl.classList.remove('is-invalid');
      }
      break;
    case 'formState.error':
      renderFeedback(elements, value);
      break;
    case 'processError':
      renderFeedback(elements, value);
      break;
    case 'processState':
      handleProcessState(elements, value);
      break;
    case 'posts':
    case 'uiState.wievedPosts':
      renderPosts(elements, value, i18nInstance, state);
      break;
    case 'feeds':
      renderFeedback(elements, i18nInstance.t('messages.success.loaded'), 'success');
      renderFeeds(elements, value, i18nInstance);
      elements.formEl.reset();
      break;
    case 'uiState.openedModal':
      renderModal(elements, value, state);
      break;
    default:
      break;
  }
};

export default render;
