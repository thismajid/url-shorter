$(document).ready(() => {
  $('#repeatNewPassword').on('keyup', function () {
    if ($('#newPassword').val() == $('#repeatNewPassword').val()) {
      $('.result').html('They match');
      $('.result').css('color', 'black');
    } else {
      $('.result').html('They do not match');
      $('.result').css('color', 'red');
    }
  });

  $('#saveChanges').click(() => {
    const id = $('#userID').val();
    const oldPassword = $('#oldPassword').val();
    const newPassword = $('#newPassword').val();
    const repeatNewPassword = $('#repeatNewPassword').val();

    if (oldPassword && newPassword === repeatNewPassword) {
      $.ajax({
        type: 'put',
        url: '/dashboard/profile/reset',
        data: {
          id,
          oldPassword,
          newPassword,
        },
        success: function (response) {},
      });
    }
  });
});
