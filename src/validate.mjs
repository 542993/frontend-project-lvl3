import * as yup from 'yup';

const validate = (fields) => {
const schema = yup.string().trim().required().url('Ссылка должна быть с валидным URL')//.notOneOf(urls,'RSS уже существует');

 return schema.validate(fields)
 .then(() => [])
 .catch((err) => err.errors)
}
validate('https://github.com').then(a => console.log(a))
export default validate;
