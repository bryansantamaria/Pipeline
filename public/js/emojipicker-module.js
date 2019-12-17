export class EmojiPicker {
    constructor(emojiBtn, msgBox) {
        this.html = {
            emojiBtn: emojiBtn,
            msgBox: msgBox,
            picker: document.createElement('emoji-picker'),
            emojiContainer: document.createElement('emoji-container'),
            categoryPicker: document.createElement('category-picker'),
            categories: []
        }

        this.currentEmojis = [];
        this.categories = [
            {query:'people', symbol: '😀'},
            {query:'animals_and_nature', symbol: '🐅'},
            {query:'food_and_drink', symbol: '🍉'},
            {query:'activity', symbol: '🚗'},
            {query:'travel_and_places', symbol: '✈️'},
            {query:'objects', symbol: '🛠'},
            {query:'symbols', symbol: '💯'},
            {query:'flags', symbol: '🇸🇪'}
        ];
        
        this.open = false;

        this.html.emojiBtn.addEventListener('click', () => {
            this.html.picker.classList.toggle('hidden');
            this.open = !this.open;
            if (this.open) {
                this.loadEmojis('people');
            }
        });
    }

    loadEmojis(category) {
        fetch('/search/emoji/' + category)
            .then(res => res.json())
            .then(emojis => {
                emojis = JSON.parse(emojis);
                this.currentEmojis.forEach(emoji => {
                    emoji.destroy();
                })

                this.currentEmojis = [];
                emojis.forEach(emoji => {
                    let emojiObj = new Emoji(emoji.name, emoji.char, this.html.msgBox, this.html.emojiContainer);
                    emojiObj.render();
                    this.currentEmojis.push(emojiObj);
                })
            });
    }

    render() {
        this.html.picker.classList.add('hidden');
        this.categories.forEach(category => {
            let item = document.createElement('category-picker-item');
            item.innerHTML = category.symbol;
            item.addEventListener('click', () => {
                this.loadEmojis(category.query);
            });

            this.html.categoryPicker.appendChild(item);
        });

        this.html.picker.appendChild(this.html.categoryPicker);
        this.html.picker.appendChild(this.html.emojiContainer);
        document.querySelector('main-content').appendChild(this.html.picker);
    }
}

class Emoji {
    constructor(name, char, msgBox, parent) {
        this.name = name;
        this.char = char;
        this.msgBox = msgBox;
        this.parent = parent;
        this.container = document.createElement('span');
    }

    render() {
        this.container.innerHTML = this.char;

        this.parent.appendChild(this.container);

        this.container.addEventListener('click', () => {
            this.msgBox.value += this.char;
            this.msgBox.focus();
        })
    }

    destroy() {
        this.parent.removeChild(this.container);
    }
}