export class ChatModule {
    constructor(message, alias, avatar, date) {
        this.html = {
            container: document.createElement('msg-container'),
            message: document.createElement('p'),
            user: document.createElement('h1'),
            date: document.createElement('span'),
            avatar: document.createElement('img'),
            editBtn: document.createElement('edit-btn'),
            deleteBtn: document.createElement('delete-btn')
        }

        //Text content
        this.content = {
            message: message,
            alias: alias,
            avatar: avatar,
            date: date
        }
    }

    render(targetNode) {
        this.html.avatar.setAttribute('src', this.content.avatar);
        this.html.message.innerText = this.content.message;
        this.html.date.innerText = this.content.date;
        this.html.alias.innerText = this.content.alias;

        this.html.container.appendChild(this.html.avatar);
        this.html.container.appendChild(this.html.message);
        this.html.container.appendChild(this.html.date);
        this.html.container.appendChild(this.html.alias);
        this.html.container.appendChild(this.html.editBtn);
        this.html.container.appendChild(this.html.deleteBtn);
        
        targetNode.appendChild(this.html.container);
    }
}