$(document).ready(() => {
  $('.button-role').click((e) => {
    const id = e.target.id.split('-')[1];
    $.ajax({
      type: 'put',
      url: '/dashboard/user/role',
      data: {
        id,
      },
      success: function (response) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Role Has Been Updated',
          showConfirmButton: false,
          timer: 2000,
        });
        setTimeout(() => {
          location.reload();
        }, 2000);
      },
    });
  });
});
