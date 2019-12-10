// import { Socket } from "dgram";

export class ChatModule {
    constructor(message, alias, avatar, date, id) {
        //Creates HTML elements
        this.html = {
            container: document.createElement('msg-container'),
            message: document.createElement('p'),
            alias: document.createElement('h1'),
            date: document.createElement('span'),
            avatarContainer: document.createElement('avatar-container'),
            avatar: document.createElement('img'),
            editBtn: document.createElement('edit-btn'),
            deleteBtn: document.createElement('delete-btn')
        }

        //Text content
        this.content = {
            message: message,
            alias: alias,
            avatar: avatar,
            date: date,
            _id: id
        }

        this.setupEventListeners();
    }

    //Registrers unique event listeners for each button in each message container
    setupEventListeners() {
        this.html.editBtn.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('edit-init', {
                detail: {html : this.html.message, content: this.content}
            }));
        });

        this.html.deleteBtn.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('delete-init', {
                detail: this.content
            }));
        });
    }


    //Runs on confirmed delete
    delete() {
        this.html.container.classList.add('removed-msg');
        console.log(this.html.container);

        setTimeout(() => {
            document.querySelector('message-root').removeChild(document.getElementById(this.content._id));
        }, 800)
    }

    //Runs on confirmed edit
    edit(newText) {
        this.html.message.innerText = newText;
        this.content.message = newText;
    }

    //Appends message to target node
    render(targetNode) {
        this.html.avatar.setAttribute('src', this.content.avatar);
        this.html.message.innerText = this.content.message;
        this.html.date.innerText = this.content.date;
        this.html.alias.innerText = this.content.alias;
        this.html.editBtn.innerHTML = '<i class="fas fa-pen"></i>';
        this.html.deleteBtn.innerHTML = '<i class="fas fa-times"></i>';

        this.html.container.setAttribute('id', this.content._id)

        //Links to bootstrap delete modal
        this.html.deleteBtn.setAttribute("data-toggle", "modal")
        this.html.deleteBtn.setAttribute("data-target", "#delete-message-modal")

        //Links to bootstrap edit modal
        this.html.editBtn.setAttribute("data-toggle", "modal")
        this.html.editBtn.setAttribute("data-target", "#edit-message-modal")

        this.html.avatarContainer.appendChild(this.html.avatar);
        this.html.container.appendChild(this.html.avatarContainer);
        this.html.container.appendChild(this.html.message);
        this.html.container.appendChild(this.html.date);
        this.html.container.appendChild(this.html.alias);
        this.html.container.appendChild(this.html.editBtn);
        this.html.container.appendChild(this.html.deleteBtn);

        targetNode.appendChild(this.html.container);
    }
}