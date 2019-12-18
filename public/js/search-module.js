export class Search {
    constructor(path, targetElement) {
        this.path = path;
        this.targetElement = targetElement;
        this.result;
    }

    search(query) {
        if (query != '') {
            fetch('/search/' + this.path + '/' + query).then(res => {
                return res.json()
            }).then(result => {
                this.result = result;
                this.targetElement.dispatchEvent(new CustomEvent('search-result', {
                    detail: JSON.parse(this.result)
                }))
            }).catch(error => {
                console.error(error);
            })
        } /*else {
            this.targetElement.dispatchEvent(new CustomEvent('search-result', {
                detail: []
            }))
        }*/
    }
}