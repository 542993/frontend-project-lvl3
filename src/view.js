const renderError = (elements, value) => {
  const parentForm = elements.formEl.parentElement;
  parentForm.lastChild.remove();
  const p = document.createElement('p');
  p.classList.add('m-0', 'position-absolute', 'small', 'text-danger');
  p.textContent = value;
  parentForm.append(p);
};

const render = (elements) => (path, value) => {
  switch (path) {
    case 'formState.valid':
      console.log('elements', elements);
      console.log('valid is changed');
      if (value === false) {
        elements.inputEl.classList.add('is-invalid');
      } else {
        elements.inputEl.classList.remove('is-invalid');
      }
      break;
    case 'formState.error':
      renderError(elements, value);
      break;
    default:
      break;
  }
};

export default render;
