var sim = require('fountain').FountainClass.createFountain();
require('./functions');
console.log(sim);



function range(start, end) {

    var arr = new Array();
    for (var i = start; i < end; i++) {
        arr[i] = parseInt(i);
    }
    return arr;
};


for (var j in range(0, 100)) {


    for (var i in range(0, 333)) {
        sim.light(i).setColor(255, 0, 0);
    }
    sim.display(0.25);
}