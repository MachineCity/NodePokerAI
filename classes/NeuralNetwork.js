var NeuralNetwork = function () {
    this.numNeurons = 0;
    this.numLayers  = 0;
    this.numInputs  = 0;

    this.layers = [];
    for (var i = 0; i < this.numLayers; i++) { this.layers.push(this.createLayer()); }
};

NeuralNetwork.prototype.init = function (numNeurons, numLayers, numInputs) {
    this.numNeurons = numNeurons;
    this.numLayers  = numLayers;
    this.numInputs  = numInputs;

    for (var i = 0; i < this.numLayers; i++) { this.layers.push(this.createLayer()); }
};

NeuralNetwork.prototype.createNeuron = function () {
    var neuron = [];
    for (var i = 0; i < this.numInputs+1; i++) { neuron.push(randomFloatBetween(-1,1,4)); }
    return neuron;
};

NeuralNetwork.prototype.createLayer = function () {
    var layer = [];
    for (var i = 0; i < this.numNeurons; i++) { layer.push(this.createNeuron()); }
    return layer;
};

NeuralNetwork.prototype.sigmoid = function (t) {
    return 1/(1+Math.pow(Math.E, -t));
};

NeuralNetwork.prototype.getOutput = function (inputs) {
    //Stores the outputs
    var outputs = [];

    //Check we have a valid number of inputs
    if (inputs.length != this.numInputs) {
        return outputs;
    }

    //For each layer
    for (var i = 0; i < this.numLayers; i++) {
        if (i > 0) {
            inputs = outputs;
        }

        //Clear the outputs
        outputs = [];


        //For each neuron, sum the weights
        for (var j = 0; j < this.numNeurons; j++) {
            var netInput = 0;

            //Sum the weights * inputs
            for (var k = 0; k < this.layers[i][j].length - 1; k++) {
                netInput += inputs[k] * this.layers[i][j][k];
            }
            //console.log(netInput);
            //Add in the bias
            netInput += parseFloat(-1) * parseFloat(this.layers[i][j][this.numInputs]);

            outputs.push(this.sigmoid(netInput));
        }
    }
    console.log(outputs);
    //Calculate output value, after it's been run through the layers
    var finalOut = 0
    for (var i = 0; i < outputs.length; i++) {
        finalOut += outputs[i];
    }
    return finalOut / outputs.length;
};



module.exports = new NeuralNetwork();