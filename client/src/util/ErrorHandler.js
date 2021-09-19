import alertify from 'alertifyjs';

export const handleErrors = (req) => {
  console.log(req);
  const errors = req.response.data.errors;
  if (errors && errors.length) {
    for (let i = 0; i < errors.length; i++) {
      alertify.error(errors[i].msg);
    }
  }
};
