const yup = require('yup')

const schema = yup.string().trim().required();
const validate = (fields) => {
 return schema.validate(fields)
 .then(console.log)
 .catch(console.log)
}
validate({})