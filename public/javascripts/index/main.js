    $(document).ready(() => {
        $('#submitBTN').click(() => {
          let link = $('#linkInput').val();
          if (!link.includes('http://') && !link.includes('https://')) {
            link = `http://${link}`;
          }
          if (isValidURL(link)) {
            axios
              .post('/generate', {
                link: link,
              })
              .then((response) => {
                const host = location.host;
                $('#submitBTN').addClass('d-none');
                $('#generatedLink').append(
                  `<a class="btn btn-primary blink_me" href="http://${host}/${response.data.name}">Your Generated Link</a>`,
                );
              });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Enter a valid URL',
              text: 'Please enter a valid URL ... like http://google.com',
            });
          }
        });
      });

      function isValidURL(string) {
        var res = string.match(
          /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
        );
        return res != null;
      }