function Validate() {
  const firstName = $('#firstName').val();
  const lastName = $('#lastName').val();
  const email = $('#email').val();
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const username = $('#username').val();
  const password = $('#password').val();
  const confirm_password = $('#confirm_password').val();
  if (firstName.length < 3 || firstName.length > 20) {
    $('#alertmsg')
      .text('Firstname must be in range of (3,20)')
      .removeClass('d-none');
    return;
  }
  if (lastName.length < 3 || lastName.length > 20) {
    $('#alertmsg')
      .text('Lastname must be in range of (3,20)')
      .removeClass('d-none');
    return;
  }
  if (!email.match(emailRegex)) {
    $('#alertmsg').text('Email is incorrect').removeClass('d-none');
    return;
  }
  if (lastName.length < 3 || lastName.length > 20) {
    $('#alertmsg')
      .text('Username must be in range of (3,20)')
      .removeClass('d-none');
    return;
  }
  if (password !== confirm_password) {
    $('#alertmsg').text('Password does not match').removeClass('d-none');
    return;
  }
  if (password.length < 6 || password.length > 20) {
    $('#alertmsg')
      .text('Password must be in range of (6,20)')
      .removeClass('d-none');
    return;
  } else {
    $('#alertmsg').addClass('d-none');
    $.ajax({
      type: 'post',
      url: '/auth/register',
      data: { firstName, lastName, email, username, password },
      success: function (response) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Account Has Been Created',
          showConfirmButton: false,
          timer: 2000,
        });
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 2000);
      },
      error: (err) => {
        if (err && err.responseText === 'Email Duplication') {
          $('#alertmsg')
            .text('Please enter another email address')
            .removeClass('d-none');
        }
        if (err && err.responseText === 'Username Duplication') {
          $('#alertmsg')
            .text('Please select another username')
            .removeClass('d-none');
        }
      },
    });
  }
}
