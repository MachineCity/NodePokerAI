function Deck () {
    this.cards = [];
    //Add Cards to Deck
    var suits = ['C', 'H', 'D', 'S'];
    for (var i = 0; i < 4; i++)
    {
        for (var j = 0; j < 13; j++)
        {
            this.cards.push(suits[i] + '-' + j);
        }
    }
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

module.exports = new Deck();