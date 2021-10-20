const totaltime = 9;
function update(percent) {
  let deg;
  if (percent < totaltime / 2) {
    deg = 90 + (360 * percent) / totaltime;
    $('.pie').css(
      'background-image',
      'linear-gradient(' +
        deg +
        'deg, transparent 50%, white 50%),linear-gradient(90deg, white 50%, transparent 50%)',
    );
  } else if (percent >= totaltime / 2) {
    deg = -90 + (360 * percent) / totaltime;
    $('.pie').css(
      'background-image',
      'linear-gradient(' +
        deg +
        'deg, transparent 50%, rgb(100, 100, 100) 50%),linear-gradient(90deg, white 50%, transparent 50%)',
    );
  }
}
let count = parseInt($('#time').text());
myCounter = setInterval(function () {
  count += 1;
  $('#time').html(count);
  update(count);

  if (count == totaltime) {
    clearInterval(myCounter);
    $('#link').removeClass('disabled');
    $('#link').removeClass('btn-secondary');
    $('#link').addClass('btn-primary');
    window.location = $('#linkAddress').text();
    return;
  }
}, 1000);