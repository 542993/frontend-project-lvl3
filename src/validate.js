import * as yup from 'yup';

const validate = (fields, urls) => {
  yup.setLocale({
    string: {
      url: 'messages.errors.not_valid_url',
    },
    mixed: {
      notOneOf: 'messages.errors.already_exist_rss',
    },
  });
  // prettier-ignore
  const schema = yup
    .string()
    .trim()
    .required()
    .url()
    .notOneOf(urls);

  return schema.validate(fields);
};

export default validate;
