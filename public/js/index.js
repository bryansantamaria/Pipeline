$('#signUpBtn').click((e) => {
    console.log('working');
    e.preventDefault();
    window.location.assign("http://127.0.0.1:5000/chat");
});

let loginHtml = `

`;

$(document).ready(() => {
    $('create-account').hide();

    $('#registrer').on("click", e => {
        e.preventDefault();
        $('create-account').fadeIn();
        $('login-container').hide();
    })

    $('#to-login-btn').on("click", e => {
        e.preventDefault();
        $('create-account').hide();
        $('login-container').fadeIn();
    })
})
