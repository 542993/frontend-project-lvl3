import * as yup from 'yup';

const validate = (fields, urls, i18nInstance) => {
  yup.setLocale({
    string: {
      url: i18nInstance.t('messages.errors.not_valid_url'),
    },
    mixed: {
      notOneOf: i18nInstance.t('messages.errors.already_exist_rss'),
    },
  });

  const schema = yup.string().trim().required().url().notOneOf(urls);

  return schema
    .validate(fields)
    .then(() => [])
    .catch((err) => err.errors);
};

export default validate;
