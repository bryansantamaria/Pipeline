export class AddToChat {
    constructor(parentElem, user) {
        this.html = {
            parent: parentElem,
            container: document.createElement('add-to-chat-item'),
            alias: document.createElement('p'),
            deleteBtn: document.createElement('span')
        }

        this.user = user;
    }

    render() {
        this.html.alias.innerText = this.user.alias;
        this.html.deleteBtn.innerHTML = '&times';
        this.html.container.appendChild(this.html.alias);
        this.html.container.appendChild(this.html.deleteBtn);
        this.html.parent.appendChild(this.html.container);

        this.html.deleteBtn.addEventListener('click', () => {
            this.html.parent.dispatchEvent(new CustomEvent('user-removed', {detail: this.user}));
            this.html.parent.removeChild(this.html.container);
        })
    }
}
