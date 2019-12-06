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
})
