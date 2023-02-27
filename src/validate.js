import * as yup from 'yup';

const validate = (fields, urls) => {
  const schema = yup
    .string()
    .trim()
    .required()
    .url('Ссылка должна быть с валидным URL')
    .notOneOf(urls, 'RSS уже существует');

  return schema
    .validate(fields)
    .then(() => [])
    .catch((err) => err.errors);
};

export default validate;
