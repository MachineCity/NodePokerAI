function Deck () {
    this.cards = [];
    //Add Cards to Deck
    var suits = ['C', 'H', 'D', 'S'];
    for (var i = 0; i < 4; i++)
    {
        for (var j = 1; j <= 13; j++)
        {
            this.cards.push(suits[i] + '-' + j);
        }
    }
    this.shuffle();
    this.shuffle();
}

Deck.prototype.shuffle = function () {
    //noinspection StatementWithEmptyBodyJS
    for (var j, x, i = this.cards.length; i; j = Math.floor(Math.random() * i), x = this.cards[--i], this.cards[i] = this.cards[j], this.cards[j] = x);
};

Deck.prototype.deal = function (numCards) {
    if (typeof(numCards) == "undefined") { numCards = 5; }
    var hand = [];
    for (var i = 0; i < numCards; i++)
    {
        var card = this.cards.shift();
        this.cards.push(card);
        hand.push(card);
    }
    return hand;
};

Deck.prototype.checkWinner = function (hands) {
    //Returns the index for which hand is the winner
    //Determine the state of each hand and compare

    var ranks = [];
    for (var i = 0; i < hands.length; i++)
    {
        //Determine it's Rank, and value within that rank

        //Check if a flush

    }
};

var checkRoyalFlush = function (hand) {
    for (var card = 0; card < hand.length; card++)
    {

    }
};




module.exports = new Deck();