import { ChatModule } from "./chat-module.js";

function log() {
    console.log('clicked');
}

let chatModule = new ChatModule(
    'Aliquam elit eros, suscipit quis semper eget, consectetur eget nisi. Donec consectetur quis nibh eget viverra. Aenean pulvinar mollis arcu, porta faucibus nibh pellentesque sit amet. Ut non tristique lorem, ut maximus mi. Quisque iaculis elit sed risus ultrices, blandit iaculis neque scelerisque.', 
    'Fabian Johansson',
    'https://icon-library.net/images/icon-for-user/icon-for-user-8.jpg',
    '11:26'
);

let chatModule2 = new ChatModule(
    'Aliquam elit eros, suscipit quis semper eget, consectetur eget nisi. Donec consectetur quis nibh eget viverra. Aenean pulvinar mollis arcu, porta faucibus nibh pellentesque sit amet. Ut non tristique lorem, ut maximus mi. Quisque iaculis elit sed risus ultrices, blandit iaculis neque scelerisque.', 
    'Bryan Santamaria',
    'https://icon-library.net/images/icon-for-user/icon-for-user-8.jpg',
    '11:26'
);

let chatModule3 = new ChatModule(
    'Aliquam elit eros, suscipit quis semper eget, consectetur eget nisi. Donec consectetur quis nibh eget viverra. Aenean pulvinar mollis arcu, porta faucibus nibh pellentesque sit amet. Ut non tristique lorem, ut maximus mi. Quisque iaculis elit sed risus ultrices, blandit iaculis neque scelerisque.', 
    'Alexander Wilson',
    'https://icon-library.net/images/icon-for-user/icon-for-user-8.jpg',
    '11:26'
);

// $(function () {
//     const socket = io();
//     $('user-name').click((e) => {
//         let user = $('newUser').val();
//     });
// })



chatModule.render(document.querySelector('message-root'));
chatModule2.render(document.querySelector('message-root'));
chatModule3.render(document.querySelector('message-root'));