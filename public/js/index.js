$('#signUpBtn').click((e) => {
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

        var password = $($(this).attr("toggle"));
        if (password.attr("type") == "text") {
          password.attr("type", "password");
          $(this).removeClass("fas fa-eye").addClass("fas fa-eye-slash");
        } else {
          password.attr("type", "text");
          $(this).removeClass("fas fa-eye-slash").addClass("fas fa-eye");
        }

        var verifyPw = $($('#verifyPassword').attr("toggle"));
        if (verifyPw.attr("type") == "text") {
          verifyPw.attr("type", "password");
        } else {
          verifyPw.attr("type", "text");
        }
      });
});
