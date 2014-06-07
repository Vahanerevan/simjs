var sim = new Simulator();




$(function() {

    sim.init('canvas');

    //  sim.playAudio('sound.mp3');
    //  sim.light(12);
    //  sim.light(12).setColor(255,255,0);
    //  sim.wait(0.5);
    //  sim.display(0.8);
    //  sim.Helpers;
    //  sim.Color;

    /*START CODE HERE */


    for (var i in range(0, 333)) {
        sim.light(i).setColor(255, 0, 0);
    }
    sim.display(5);



    for (var i in range(0, 333)) {
        sim.light(i).setColor(0, 255, 0);
    }

    sim.display(5);

    for (var i in range(0, 333)) {
        sim.light(i).setColor(0, 0, 255);
    }



    sim.display(5);






    /*END CODE HERE */

});