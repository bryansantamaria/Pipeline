export class MentionsItem {
    constructor(parentElem, user) {
        this.html = {
            parent: parentElem,
            container: document.createElement('mentions-item'),
        }

        this.user = user;
    }

    render() {
        console.log(this);
        this.html.container.innerText = this.user.alias;
        this.html.parent.appendChild(this.html.container);

        this.html.container.addEventListener('click', () => {
            
            this.html.parent.dispatchEvent(new CustomEvent('mention-user', {detail: this.user}));
            console.log('You mentioned user >');
            console.log(this.user);
        })
    }
}