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
var sqlite3 = require('sqlite3').verbose();
var deck    = require('./classes/Deck.js');
var db      = new sqlite3.Database('./database/poker.db');
var ai      = require('./classes/PokerPlayer.js');

//Run 100 games at first, will increase the number later
//2 players for now, later on more maybe

//To deal with asynchronous behavior, pull the whole DB
var moneyEarned = 0;
db.all("SELECT * FROM BasicPlayerMemory ORDER BY id DESC", function (err, rows) {
    var memory = [];
    var newId  = 1;
    for (var game = 0; game < 1000; game++) {
        var player   = deck.deal();
        var opponent = deck.deal();
        //Find the best weights in the memory
        var weights = [];
        for (var i = 0; i < memory.length; i++) {
            //Get hand for comparison
            var compHand = [memory[i].Card1, memory[i].Card2, memory[i].Card3, memory[i].Card4, memory[i].Card5];
            var weight = ai.getWeight(player, compHand);
            if (weight > 0) { weights.push([weight, memory[i].Fitness,memory[i].id]); }
        }
        weights = weights.sort(function(a, b) { return b[0] - a[0]; });
        weights = weights.slice(0, 10);
        console.log(weights);
        var decision = ai.getDecision(weights);
        if (decision) {
            //Let's bid
            var winner = deck.checkWinner([player, opponent]);
            if (winner == 0) {
                //We win, increase fitness and save
                console.log("WE WIN");
                moneyEarned += 10;
                for (var i = 0; i < weights.length; i++) {
                    if (weights[i][0] == 1) {
                        //Exists in the DB
                        var id = weights[i][2];
                        console.log(id);
                        var updated = true;
                        var newFitness = weights[i][1] + 0.5;
                        //Use Update query
                        var updateQuery = "UPDATE BasicPlayerMemory Fitness = '"+newFitness+"' WHERE id = '"+id+"'";
                        //Update local memory
                        for (var j = 0; j < memory.length; j++) {
                            if (memory[j].id == id) { memory[j].Fitness = newFitness; }
                        }
                        db.run(updateQuery, function (err, updateRes){});
                    }
                }
                if (!updated) {
                    //Use INSERT query
                    var insertQuery = "INSERT INTO BasicPlayerMemory (Card1, Card2, Card3, Card4, Card5, Fitness)  " +
                                      "VALUES ('"+player[0]+"', '"+player[1]+"', '"+player[2]+"', '"+player[3]+"', " +
                                      "'"+player[4]+"', '0.5')";
                    //Update Local memory
                    var handObj = {
                        id      : newId,
                        Card1   : player[0],
                        Card2   : player[1],
                        Card3   : player[2],
                        Card4   : player[3],
                        Card5   : player[4],
                        Fitness : 0.5
                    };
                    newId++;
                    memory.unshift(handObj);
                    db.run(insertQuery, function (err, insertRes){});
                }
            } else if (winner == 1) {
                //We win, increase fitness and save
                console.log("WE LOSE");
                moneyEarned += -10;
                for (var i = 0; i < weights.length; i++) {
                    if (weights[i][0] == 1) {
                        //Exists in the DB
                        var id = weights[i][2];
                        console.log(id);
                        var updated = true;
                        var newFitness = weights[i][1] - 0.5;
                        //Use Update query
                        var updateQuery = "UPDATE BasicPlayerMemory Fitness = '"+newFitness+"' WHERE id = '"+id+"'";
                        //Update local memory
                        for (var j = 0; j < memory.length; j++) {
                            if (memory[j].id == id) { memory[j].Fitness = newFitness; }
                        }
                        console.log(updateQuery);
                        db.run(updateQuery, function (err, updateRes){});
                    }
                }
                if (!updated) {
                    //Use INSERT query
                    var insertQuery = "INSERT INTO BasicPlayerMemory (Card1, Card2, Card3, Card4, Card5, Fitness)  " +
                        "VALUES ('"+player[0]+"', '"+player[1]+"', '"+player[2]+"', '"+player[3]+"', " +
                        "'"+player[4]+"', '-0.5')";
                    //Update Local memory
                    var handObj = {
                        id      : newId,
                        Card1   : player[0],
                        Card2   : player[1],
                        Card3   : player[2],
                        Card4   : player[3],
                        Card5   : player[4],
                        Fitness : -0.5
                    };
                    memory.unshift(handObj);
                    newId++;
                    db.run(insertQuery, function (err, insertRes){});
                }
            }
        } else {
            //We fold
            console.log("WE FOLD");
        }
    }
    console.log(memory);
    console.log(moneyEarned);
});

