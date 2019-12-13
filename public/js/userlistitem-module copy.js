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
        console.log(this.html);
        this.html.alias.innerText = this.user.alias;
        this.html.container.appendChild(this.html.alias);
        this.html.parent.appendChild(this.html.container);

        this.html.container.addEventListener('click', () => {
            /*console.log('You clicked on user >');
            console.log(this.user);*/
            this.html.parent.dispatchEvent(new CustomEvent('user-added', {detail: this.user}));
        })
    }
}