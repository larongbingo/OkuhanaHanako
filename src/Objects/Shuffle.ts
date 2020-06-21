// from :  https://github.com/coolaj86/knuth-shuffle

export class Shuffler {
    public static shuffleAndPickFromArray(array : Array<any>) : any {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array[Math.floor(Math.random() * array.length)];
    }
}