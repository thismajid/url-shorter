function forgetPassword() {
  const email = $('#email').val();
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!email.match(emailRegex)) {
    $('#alertError').text('Email is incorrect').removeClass('d-none');
    return;
  } else {
    $('#loading').removeClass('d-none');
    $('#alertError').addClass('d-none');
    $.ajax({
      type: 'post',
      url: '/auth/forget',
      data: {
        email,
      },
      success: function (response) {
        $('#loading').addClass('d-none');
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Reset Password Link Has Been Sent To Your Email Address',
          showConfirmButton: false,
          timer: 2000,
        });
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 2000);
      },
      error: (err) => {
        $('#loading').addClass('d-none');
        if (err && err.responseText) {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: err.responseText,
            showConfirmButton: false,
            timer: 2000,
          });
        }
      },
    });
  }
}
