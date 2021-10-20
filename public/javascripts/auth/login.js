function login() {
  const username = $('#username').val();
  const password = $('#password').val();
  const remember = $('#rememberMe').is(':checked') ? true : false;
  axios
    .post('/auth/login', {
      username,
      password,
      remember,
    })
    .then(function (response) {
      window.location.href = '/';
    })
    .catch(function (err) {
      $('#alertError').removeClass('d-none');
    });
}
