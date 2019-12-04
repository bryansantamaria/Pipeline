import { ChatModule } from "./chat-module.js";

let chatModule = new ChatModule(
    'Aliquam elit eros, suscipit quis semper eget, consectetur eget nisi. Donec consectetur quis nibh eget viverra. Aenean pulvinar mollis arcu, porta faucibus nibh pellentesque sit amet. Ut non tristique lorem, ut maximus mi. Quisque iaculis elit sed risus ultrices, blandit iaculis neque scelerisque.',
    'Fabian Johansson',
    'https://scontent-arn2-1.xx.fbcdn.net/v/t1.0-9/74617601_2692609500763768_5275050151155597312_o.jpg?_nc_cat=103&_nc_ohc=XBoYWDubAUUAQmTc4DVWQe_05mCnZ0CL3rXU91R8LK5tH670PwiZwEaog&_nc_ht=scontent-arn2-1.xx&oh=d53991ce63884e4faa86b246edbff50b&oe=5E7797AA',
    '11:26'
);

let chatModule2 = new ChatModule(
    'Aliquam elit eros, suscipit quis semper eget, consectetur eget nisi. Donec consectetur quis nibh eget viverra. Aenean pulvinar mollis arcu, porta faucibus nibh pellentesque sit amet. Ut non tristique lorem, ut maximus mi. Quisque iaculis elit sed risus ultrices, blandit iaculis neque scelerisque.',
    'Bryan Santamaria',
    'https://scontent-arn2-1.xx.fbcdn.net/v/t31.0-8/13580553_10153540477521470_8547081405158753156_o.jpg?_nc_cat=111&_nc_ohc=w1OeQC-JqpUAQnyq8OfuNAvLuI8YrDBMTmZkQo4vtQl-uAZIjfdGDN2lw&_nc_ht=scontent-arn2-1.xx&oh=20045fa1123f617259ecb2a4d768ad27&oe=5E83EB6D',
    '11:26'
);

let chatModule3 = new ChatModule(
    'Aliquam elit eros, suscipit quis semper eget, consectetur eget nisi. Donec consectetur quis nibh eget viverra. Aenean pulvinar mollis arcu, porta faucibus nibh pellentesque sit amet. Ut non tristique lorem, ut maximus mi. Quisque iaculis elit sed risus ultrices, blandit iaculis neque scelerisque.',
    'Alexander Wilson',
    'https://scontent-arn2-1.xx.fbcdn.net/v/t1.0-9/51721821_10156909845079030_3534192012213354496_n.jpg?_nc_cat=109&_nc_ohc=CabSkySieYMAQlIvjyAJrkabzdmPpbzrfdZN9QL78W5gjN_cxQuE_-7Qg&_nc_ht=scontent-arn2-1.xx&oh=d57a7ebc3db7466ef4e5ec2822247038&oe=5E830A5E',
    '11:26'
);

//Globals
let chatGlobals = {
    deleteTarget: undefined,
    editTarget: undefined
}

//Delete events
document.addEventListener('delete-init', e => {
    chatGlobals.deleteTarget = e.detail;
})

document.querySelector('#delete-btn').addEventListener('click', () => {
    chatGlobals.deleteTarget.dispatchEvent(new CustomEvent('delete-confirm', {}));
});

//Edit Events
document.addEventListener('edit-init', e => {
    chatGlobals.editTarget = e.detail;
    document.querySelector('#edit-message').value = chatGlobals.editTarget.textContent;
})

document.querySelector('#edit-btn').addEventListener('click', () => {
    chatGlobals.editTarget.parentNode.dispatchEvent(new CustomEvent('edit-confirm', {
        detail: document.querySelector('#edit-message')
    }));
});


// $(function () {
//     const socket = io();
//     $('user-name').click((e) => {
//         let user = $('newUser').val();
//     });
// })

/*     //Genererar dagens datum och tid, convertar från millisekunder.
    function getTodaysDate() {
        var rightNow = new Date();
        var dd = String(rightNow.getDate()).padStart(2, '0');
        var mm = String(rightNow.getMonth() + 1).padStart(2, '0');
        var h = rightNow.getHours();
        var m = rightNow.getMinutes();

        var yyyy = rightNow.getFullYear();
        h = (h < 10) ? "0" + h : h;
        m = (m < 10) ? "0" + m : m;
        rightNow = yyyy + '-' + mm + '-' + dd + ' kl ' + h + ":" + m;
        return rightNow;
    }*/

chatModule.render(document.querySelector('message-root'));
chatModule2.render(document.querySelector('message-root'));
chatModule3.render(document.querySelector('message-root'));