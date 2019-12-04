$('#signUpBtn').click((e) => {
    console.log('working');
    e.preventDefault();
    window.location.assign("http://127.0.0.1:5000/chat");
});