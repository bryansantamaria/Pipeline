$('#signUpBtn').click((e) => {
    console.log('working');
    e.preventDefault();
    window.location.assign("http://127.0.0.1:5000/chat");
});

$(document).ready(() => {
    $('create-account').hide();

    $('#register').on("click", e => {
        $('create-account').fadeIn();
        $('login-container').hide();
    })

    $('#login-link').on("click", e => {
        $('create-account').hide();
        $('login-container').fadeIn();
    })

    $(".toggle-password").click(function() {
        
        var input = $($(this).attr("toggle"));
        if (input.attr("type") == "text") {
          input.attr("type", "password");
          $(this).removeClass("fas fa-eye").addClass("fas fa-eye-slash");
        } else {
          input.attr("type", "text");
          $(this).removeClass("fas fa-eye-slash").addClass("fas fa-eye");
        }
      });
});
