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
};

function rangeReverse(start, end) {

    var arr = new Array();
    for (var i = end; i >= start; i--) {
        arr[end - i] = i;
    }

    return arr;

}