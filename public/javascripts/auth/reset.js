function resetPassword() {
  console.log(window.location.search);
  const token = $('#token').val();
  const email = $('#email').val();
  const password = $('#password').val();
  const confirm_password = $('#confirm_password').val();
  if (password !== confirm_password) {
    $('#alertmsg').text('Password does not match').removeClass('d-none');
    return;
  }
  if (password.length < 6 || password.length > 20) {
    $('#alertmsg')
      .text('Password must be in range of (6,20)')
      .removeClass('d-none');
    return;
  }
  $('#alertmsg').addClass('d-none');
  $.ajax({
    type: 'put',
    url: '/auth/reset',
    data: { token, email, password },
    success: (response) => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your password has changed successfully',
        showConfirmButton: false,
        timer: 2000,
      });
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 2000);
    },
    error: (err) => {
      if (err && err.responseText) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: err.responseText,
          showConfirmButton: false,
          timer: 2000,
        });
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 2000);
      }
    },
  });
}
