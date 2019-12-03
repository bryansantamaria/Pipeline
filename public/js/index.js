import { ChatModule } from "./chat-module.js";

function log() {
    console.log('clicked');
}

let chatModule = new ChatModule(
    'Aliquam elit eros, suscipit quis semper eget, consectetur eget nisi. Donec consectetur quis nibh eget viverra. Aenean pulvinar mollis arcu, porta faucibus nibh pellentesque sit amet. Ut non tristique lorem, ut maximus mi. Quisque iaculis elit sed risus ultrices, blandit iaculis neque scelerisque.', 
    'DragonSlayer123',
    'localhost:3000',
    '11:26',
    log,
    log
);

let chatModule2 = new ChatModule(
    'Aliquam elit eros, suscipit quis semper eget, consectetur eget nisi. Donec consectetur quis nibh eget viverra. Aenean pulvinar mollis arcu, porta faucibus nibh pellentesque sit amet. Ut non tristique lorem, ut maximus mi. Quisque iaculis elit sed risus ultrices, blandit iaculis neque scelerisque.', 
    'DragonSlayer123',
    'localhost:3000',
    '11:26',
    log,
    log
);

chatModule.render(document.querySelector('message-root'));
chatModule2.render(document.querySelector('message-root'));