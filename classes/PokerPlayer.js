/**
 * Created by Gwen on 12/12/14.
 */

var PokerPlayer = function () {
    this.numInputs = 10;
};

PokerPlayer.prototype.getWeight = function (hand1, hand2) {
    var cardsInCommon = 0;
    for (var i = 0; i < hand1.length; i++) {
        for (var j = 0; j < hand2.length; j++) {
            if (hand1[i] == hand2[j]) { cardsInCommon++; }
        }
    }
    //console.log(hand1);
    //console.log(hand2);
    //console.log(cardsInCommon);
    return cardsInCommon * 0.2;
};

PokerPlayer.prototype.getDecision = function (topCards) {
    var fitSum = 0;
    for (var i = 0; i < topCards.length; i++) {
        //Sum adjusted fitness and apply the sigmoid function
        fitSum += topCards[i][0] * topCards[i][1];
    }
    console.log(topCards);
    var fitness = this.sigmoid(fitSum);
    fitness = fitness * randomFloatBetween(0.95, 1.05, 4);
    console.log(fitness);
    return(fitness > 0.5);
};

PokerPlayer.prototype.sigmoid = function (t) {
    return 1/(1+Math.pow(Math.E, -t));
};

function randomFloatBetween(minValue,maxValue,precision){
    if(typeof(precision) == 'undefined'){
        precision = 2;
    }
    return parseFloat(Math.min(minValue + (Math.random() * (maxValue - minValue)),maxValue).toFixed(precision));
}

module.exports = new PokerPlayer();