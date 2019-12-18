export class UserListItem {
    constructor(parentElem, user) {
        this.html = {
            parent: parentElem,
            container: document.createElement('user-list-item'),
            alias: document.createElement('span')
        }
        this.user = user;
    }
    render() {
        this.html.alias.innerText = this.user.alias;
        this.html.container.appendChild(this.html.alias);
        this.html.parent.appendChild(this.html.container);
        this.html.container.addEventListener('click', () => {
            this.html.parent.dispatchEvent(new CustomEvent('user-added', {detail: this.user}));
        })
    }
}
