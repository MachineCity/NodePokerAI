/*var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./database/poker.db');

db.serialize(function() {
    //db.run("CREATE TABLE lorem (info TEXT)");

    /*var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    for (var i = 0; i < 10; i++) {
        stmt.run("Ipsum " + i);
    }
    stmt.finalize();

    db.each("SELECT * FROM BasicPlayerMemory", function(err, row) {
        console.log(row);
    });
});

db.close();
 */

var deck = require('./classes/Deck.js');

hand1 = deck.deal();
hand2 = deck.deal();
var handArr = [];
handArr.push(hand1);
handArr.push(hand2);
console.log(deck.checkWinner(handArr));