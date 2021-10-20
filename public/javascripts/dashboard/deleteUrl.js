$(document).ready(() => {
  $('.button-delete').click((e) => {
    Swal.fire({
      title: 'Do you want to delete this link?',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: 'rgb(255 60 60)',
    }).then((result) => {
      console.log(result);
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const id = e.target.id.split('-')[1];
        $.ajax({
          type: 'delete',
          url: '/link',
          data: {
            id,
          },
          success: (response) => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Your Link Has Been Deleted',
              showConfirmButton: false,
              timer: 2000,
            });
            setTimeout(() => {
              location.reload();
            }, 2000);
          },
        });
      } else if (result.isDismissed) {
        location.reload();
      }
    });
  });
});
