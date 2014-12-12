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

        //Split and sort cards for easier checking
        var suitArr = [];
        var numArr  = [];

        for (var card = 0; card < hands[i].length; card++) {
            var cardArr = hands[i][card].split('-');
            suitArr.push(cardArr[0]);
            numArr.push (parseInt(cardArr[1]));
        }
        suitArr = suitArr.sort();
        numArr  = numArr.sort(function(a,b){return a - b});

        //Check if a flush
        if      (checkRoyalFlush   (suitArr, numArr)) { ranks.push([9,'RF'])                   ; }
        else if (checkStraightFlush(suitArr, numArr)) { ranks.push([8,numArr[numArr.length-1]]); }
        else if (checkFourOfKind   (         numArr)) { ranks.push([7,getFourOfKind (numArr)]) ; }
        else if (checkFullHouse    (         numArr)) { ranks.push([6,getThreeOfKind(numArr)]) ; }
        else if (checkFlush        (suitArr        )) { ranks.push([5,numArr[numArr.length-1]]); }
        else if (checkStraight     (         numArr)) { ranks.push([4,numArr[0]])              ; }
        else if (checkThreeOfKind  (         numArr)) { ranks.push([3,getThreeOfKind(numArr)]) ; }
        else if (checkTwoPairs     (         numArr)) { ranks.push([2,getTwoPairs   (numArr)]) ; }
        else if (checkPair         (         numArr)) { ranks.push([1,getPair       (numArr)]) ; }
        else                                          { ranks.push([0,numArr[numArr.length-1]]); }
        console.log(hands[i] + " : " + ranks[i]);
    }
    //Now compare hands
    var largest  = ranks[0];
    var largesti = 0;
    var tie      = false;
    for (var i = 1; i < ranks.length; i++) {
        if (parseInt(ranks[i][0]) > parseInt(largest[0])) {
            largest  = ranks[i];
            largesti = i;
        }
        else if (parseInt(ranks[i][0]) == parseInt(largest[0])) {
            if (parseInt(ranks[i][1]) > parseInt(largest[1]) || (parseInt(ranks[i][1]) == 1 && parseInt(largest[1]) > 1)) {
                largest  = ranks[i];
                largesti = i;
            }
            else if (parseInt(ranks[i][1]) == parseInt(largest[1]))
            {
                tie = true;
            }
        }
    }
    if (tie)
    {
        return 'tie';
    }
    else
    {
        return largesti;
    }
};

var checkRoyalFlush = function (suits, nums) {
    //Get counts
    var suitCounts = {};
    suits.forEach(function(x) { suitCounts[x] = (suitCounts[x] || 0)+1; });

    var suitTotal = Object.keys(suitCounts).length;
    if (suitTotal == 1)
    {
        //All the same suit
        var royalArr = JSON.stringify([1,10,11,12,13]);
        return (royalArr == JSON.stringify(nums));
    }
    else
    {
        return false;
    }
};

var checkStraightFlush = function (suits, nums) {
    //Get counts
    var numCounts = {};
    nums.forEach(function(x) { numCounts[x] = (numCounts[x] || 0)+1; });

    var suitCounts = {};
    suits.forEach(function(x) { suitCounts[x] = (suitCounts[x] || 0)+1; });

    var suitTotal = Object.keys(suitCounts).length;

    if (suitTotal == 1) {
        //All the same suit
        for (var i = 0; i < nums.length - 1; i++) {
            if (nums[i+1] != nums[i] + 1) {
                return false;
            }
        }
        return true;
    }
    else {
        return false;
    }
};

var checkFourOfKind = function (nums) {
    //Get counts
    var numCounts = {};
    nums.forEach(function(x) { numCounts[x] = (numCounts[x] || 0)+1; });
    for (var key in numCounts) { if (numCounts[key] == 4) { return true; } }
    return false;
};

var checkFullHouse = function (nums) {
    var numCounts = {};
    nums.forEach(function(x) { numCounts[x] = (numCounts[x] || 0)+1; });

    //Check for a 3, and a 2
    for (var key in numCounts) {
        if (numCounts[key] == 3)
        {
            for (var i in numCounts) {
                if (numCounts[i] == 2) { return true; }
            }
        }
    }
    return false;
};

var checkFlush = function (suits) {
    //Get counts
    var suitCounts = {};
    suits.forEach(function(x) { suitCounts[x] = (suitCounts[x] || 0)+1; });
    return(Object.keys(suitCounts).length == 1);
};

var checkStraight = function (nums) {
    //First check for royal flush
    var royalHand = JSON.stringify([1,10,11,12,13]);
    if (JSON.stringify(nums) == royalHand) { return true; }

    for (var i = 0; i < nums.length - 1; i++) {
        if (nums[i+1] != nums[i] + 1) { return false; }
    }
    return true;
};

var checkThreeOfKind = function (nums) {
    //Get counts
    var numCounts = {};
    nums.forEach(function(x) { numCounts[x] = (numCounts[x] || 0)+1; });
    for (var key in numCounts) { if (numCounts[key] == 3) { return true; } }
    return false;
};

var checkTwoPairs = function (nums) {
    //Get counts
    var numCounts = {};
    nums.forEach(function(x) { numCounts[x] = (numCounts[x] || 0)+1; });
    for (var key in numCounts) {
        if (numCounts[key] == 2) {
            //Check if there's another pair
            var oldKey = key;
            for (var i in numCounts) {
                if (numCounts[i] == 2 && i != oldKey) { return true; }
            }
        }
    }
    return false;
};

var checkPair = function (nums) {
    //Get counts
    var numCounts = {};
    nums.forEach(function(x) { numCounts[x] = (numCounts[x] || 0)+1; });
    for (var key in numCounts) { if (numCounts[key] == 2) { return true; } }
    return false;
};

var getPair = function (nums) {
    //Get counts
    var numCounts = {};
    nums.forEach(function(x) { numCounts[x] = (numCounts[x] || 0)+1; });
    for (var key in numCounts) { if (numCounts[key] == 2) { return key; } }
    return false;
};

var getTwoPairs = function (nums) {
    //Get counts
    var numCounts = {};
    nums.forEach(function(x) { numCounts[x] = (numCounts[x] || 0)+1; });
    for (var key in numCounts) {
        if (numCounts[key] == 2) {
            //Check if there's another pair
            var oldKey = key;
            for (var i in numCounts) {
                if (numCounts[i] == 2 && i != oldKey) {
                    if (i > oldKey) {
                        return i;
                    }
                    else {
                        return oldKey;
                    }
                }
            }
        }
    }
    return false;
};

var getFourOfKind = function (nums) {
    //Get counts
    var numCounts = {};
    nums.forEach(function(x) { numCounts[x] = (numCounts[x] || 0)+1; });
    for (var key in numCounts) { if (numCounts[key] == 4) { return key; } }
    return false;
};

var getThreeOfKind = function (nums) {
    //Get counts
    var numCounts = {};
    nums.forEach(function(x) { numCounts[x] = (numCounts[x] || 0)+1; });
    for (var key in numCounts) { if (numCounts[key] == 3) { return key; } }
    return false;
};

module.exports = new Deck();