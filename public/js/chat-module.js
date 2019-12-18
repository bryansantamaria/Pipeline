export class ChatModule {
    constructor(message, alias, avatar, date, id, mentions) {
        this.html = {
            container: document.createElement('msg-container'),
            message: document.createElement('p'),
            alias: document.createElement('h1'),
            timestamp: document.createElement('span'),
            avatarContainer: document.createElement('avatar-container'),
            avatar: document.createElement('img'),
            editBtn: document.createElement('edit-btn'),
            deleteBtn: document.createElement('delete-btn')
        }
        this.content = {
            message: message,
            alias: alias,
            avatar: avatar,
            timestamp: date,
            _id: id,
            mentions: mentions || []
        }
    }
    setupEventListeners() {
        this.html.container.appendChild(this.html.editBtn);
        this.html.container.appendChild(this.html.deleteBtn);

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
    delete() {
        this.html.container.classList.add('removed-msg');
        setTimeout(() => {
            document.querySelector('message-root').removeChild(document.getElementById(this.content._id));
        }, 800)
    }
    edit(newText) {
        this.html.message.innerText = newText;
        this.content.message = newText;
    }
    render(targetNode) {
        this.html.avatar.setAttribute('src', this.content.avatar);
        this.html.avatar.setAttribute('onerror', `this.src = 'https://pngimage.net/wp-content/uploads/2018/05/default-user-profile-image-png-7.png';`);
        let messageWithMentions = this.content.message;
        this.content.mentions.forEach(mention => {
            messageWithMentions = messageWithMentions.replace(`@${mention.alias}`, `<span class="mention" mention="${mention._id}">@${mention.alias}</span>`)
        });
        this.html.message.innerHTML = `${messageWithMentions}`;
        this.html.timestamp.innerText = this.content.timestamp;
        this.html.alias.innerText = this.content.alias;
        this.html.editBtn.innerHTML = '<i class="fas fa-pen"></i>';
        this.html.deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
        this.html.container.setAttribute('id', this.content._id)
        this.html.deleteBtn.setAttribute("data-toggle", "modal")
        this.html.deleteBtn.setAttribute("data-target", "#delete-message-modal")
        this.html.editBtn.setAttribute("data-toggle", "modal")
        this.html.editBtn.setAttribute("data-target", "#edit-message-modal")
        this.html.avatarContainer.appendChild(this.html.avatar);
        this.html.container.appendChild(this.html.avatarContainer);
        this.html.container.appendChild(this.html.message);
        this.html.container.appendChild(this.html.timestamp);
        this.html.container.appendChild(this.html.alias);
        targetNode.appendChild(this.html.container);
        this.html.container.scrollIntoView();
    }
}
