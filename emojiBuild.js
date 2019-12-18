const fs = require('fs');
const monk = require("monk");
const pipelineDB = monk('localhost:27017/pipeline');

function parseEmoji() {
    fs.readFile('emoji/emoji.json', (err, emojis) => {
        //emojis = JSON.parse(emojis.emojis);
        if (err) throw err;
        let parsedEmojis = JSON.parse(emojis).emojis;
        let emojiCollection = pipelineDB.get('emojis');

        let emojiObjects = [];
        parsedEmojis.forEach(emoji => {
            //console.log(Object.getOwnPropertyNames(emoji));
            let emojiObj = {
                name: Object.getOwnPropertyNames(emoji)[0],
                char: emoji[Object.getOwnPropertyNames(emoji)].char,
                category: emoji[Object.getOwnPropertyNames(emoji)].category
            };

            emojiObjects.push(emojiObj);
        });

        let categoryNames = [];

        emojiObjects.forEach(emoji => {
            emojiCollection.insert(emoji);
            console.log(emoji);
        })
    })
}

parseEmoji();