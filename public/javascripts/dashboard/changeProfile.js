$(document).ready(() => {
  $('#saveProfile').click(() => {
    const id = $('#userID').val();
    const previousFirstName = $('#previousFirstName').val();
    const previousLastName = $('#previousLastName').val();
    const firstName = $('#firstName').val();
    const lastName = $('#lastName').val();

    if (previousFirstName !== firstName || previousLastName !== lastName) {
      console.log(3232);
      $.ajax({
        type: 'put',
        url: '/dashboard/profile',
        data: {
          id,
          firstName,
          lastName,
        },
        success: function (response) {
          console.log(response);
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your Profile Has Been Updated',
            showConfirmButton: false,
            timer: 2000,
          });
          setTimeout(() => {
            window.location.href = '/auth/logout';
          }, 2000);
        },
      });
    } else {
      location.reload();
    }
  });
});
