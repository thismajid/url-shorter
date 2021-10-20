$(document).ready(() => {
  if (window.location.href.includes('/dashboard/main')) {
    $('#mainIcon').addClass('text-danger');
  }
  if (
    window.location.href.includes('/dashboard/profile') ||
    window.location.href.includes('/dashboard/profile/reset')
  ) {
    $('#profileIcon').addClass('text-danger');
  }

  if (window.location.href.includes('/dashboard/users')) {
    $('#usersIcon').addClass('text-danger');
  }
});
