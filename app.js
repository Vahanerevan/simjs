var app = require('http').createServer();
var io = require('socket.io').listen(app);

app.listen(8081, '127.0.0.1');

io.sockets.on('connection', connected);
io.set('log level', 1);

function setLights(data) {
    //console.log(data);
    for (var i = 0; i < 333; ++i) {
        fn.light(i).setColor(data[i].r, data[i].g, data[i].b);
        lightsLive[i] = {
            r: data[i].r,
            g: data[i].g,
            b: data[i].b
        };
    }
    io.sockets.emit('update', lightsLive);
    fn.flush();
}

function connected(socket) {
    socket.emit('welcome', {});
    socket.on('update', setLights);
}

var fn = require('fountain').FountainClass.createFountain();
sim = fn;

function rgbToHex(r, g, b) {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);

    if (r.length == 1) r = '0' + r;
    if (g.length == 1) g = '0' + g;
    if (b.length == 1) b = '0' + b;

    return (r + g + b).toUpperCase();
}



_color = function(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    if (!a) {
        a = 100;
    }
    this.realValue = {
        r: r,
        g: g,
        b: b
    };
    this.toRgba = function() {
        return rgbToHex(r, g, b);
    };
};

function array_value(arr, key) {
    return arr[key];
}

function rangeSimple(start, end) {

    var arr = [];
    for (var i = start; i < end; i++) {
        arr.push(i);
    }
    return arr;


}


var makeColor = function(r, g, b, a) {

    if (!a) {
        a = 100;
    }
    return new _color(r, g, b, a);
};


function range(start, end) {

    var arr = new Array();
    for (var i = start; i < end; i++) {
        arr[i] = parseInt(i);
    }
    return arr;
}

function rangeReverse(start, end) {

    var arr = new Array();
    for (var i = end; i >= start; i--) {
        arr[end - i] = i;
    }

    return arr;

}



var lights = [];
var lightsLive = [];


function reset() {
    for (var i = 0; i < 333; ++i) {
        fn.light(i).setColor(0, 0, 0);
    }

    fn.flush();
}

//fn.evalFile(__dirname+'/shows/Night_Souls/js/show.js');