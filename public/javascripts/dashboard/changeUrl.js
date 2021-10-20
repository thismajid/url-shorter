$(document).ready(() => {
  $('.button-edit').on('click', async (e) => {
    const id = e.target.id.split('-')[1];
    const link = await axios.get(`/link/${id}`);
    $('#editModal').modal('show');
    $('#modalBody').html(`<div class="input-group mb-3">
              <input type="text" class="form-control d-none" value="${link.data._id}" id="linkID">
              <span class="input-group-text" id="basic-addon1">Link</span>
              <input type="text" class="form-control" value="${link.data.link}" id="newLink">
            </div>
          <div class="input-group mb-3">
              <span class="input-group-text" id="basic-addon1">${window.location.origin}/</span>
              <input type="text" class="form-control d-none" value="${link.data.name}" id="previousNameLink">
              <input type="text" class="form-control" value="${link.data.name}" id="newNameLink">
            </div>`);
  });
});

function changeUrl() {
  const linkID = $('#linkID').val();
  const newUrl = $('#newLink').val();
  const previousNameLink = $('#previousNameLink').val();
  const newNameUrl = $('#newNameLink').val();
  const newUrlIsMatched = newUrl.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
  );
  if (newUrlIsMatched) {
    $('#newLink').removeClass('error-border');
    $.ajax({
      type: 'put',
      url: '/changeUrl',
      data: {
        id: linkID,
        link: newUrl,
        previousNameLink,
        name: newNameUrl,
      },
      success: (response) => {
        $('#newNameLink').removeClass('error-border');
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your Link Has Been Updated',
          showConfirmButton: false,
          timer: 2000,
        });
        setTimeout(() => {
          location.reload();
        }, 2000);
      },
      error: (err) => {
        if (err.responseJSON.message === 'Cannot pick up this name') {
          $('#newNameLink').addClass('error-border');
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Cannot pick up this name',
            showConfirmButton: false,
            timer: 2000,
          });
        }
      },
    });
  } else {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Please enter a valid URL ... like http://google.com',
      showConfirmButton: false,
      timer: 2000,
    });
    $('#newLink').addClass('error-border');
  }
}
