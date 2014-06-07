var socket = io.connect('http://localhost:8081');

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

function array_chunk(input, size, preserve_keys) {
    // http://kevin.vanzonneveld.net
    // +   original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // %        note 1: Important note: Per the ECMAScript specification, objects may not always iterate in a predictable order
    // *     example 1: array_chunk(['Kevin', 'van', 'Zonneveld'], 2);
    // *     returns 1: [['Kevin', 'van'], ['Zonneveld']]
    // *     example 2: array_chunk(['Kevin', 'van', 'Zonneveld'], 2, true);
    // *     returns 2: [{0:'Kevin', 1:'van'}, {2: 'Zonneveld'}]
    // *     example 3: array_chunk({1:'Kevin', 2:'van', 3:'Zonneveld'}, 2);
    // *     returns 3: [['Kevin', 'van'], ['Zonneveld']]
    // *     example 4: array_chunk({1:'Kevin', 2:'van', 3:'Zonneveld'}, 2, true);
    // *     returns 4: [{1: 'Kevin', 2: 'van'}, {3: 'Zonneveld'}]

    var x, p = '',
        i = 0,
        c = -1,
        l = input.length || 0,
        n = [];

    if (size < 1) {
        return null;
    }

    if (Object.prototype.toString.call(input) === '[object Array]') {
        if (preserve_keys) {
            while (i < l) {
                (x = i % size) ? n[c][i] = input[i] : n[++c] = {}, n[c][i] = input[i];
                i++;
            }
        } else {
            while (i < l) {
                (x = i % size) ? n[c][x] = input[i] : n[++c] = [input[i]];
                i++;
            }
        }
    } else {
        if (preserve_keys) {
            for (p in input) {
                if (input.hasOwnProperty(p)) {
                    (x = i % size) ? n[c][p] = input[p] : n[++c] = {}, n[c][p] = input[p];
                    i++;
                }
            }
        } else {
            for (p in input) {
                if (input.hasOwnProperty(p)) {
                    (x = i % size) ? n[c][x] = input[p] : n[++c] = [input[p]];
                    i++;
                }
            }
        }
    }
    return n;
}






var makeColor = function(r, g, b, a) {

    if (!a) {
        a = 100;
    }
    return new _color(r, g, b, a);
}


CONFIG = {
    showLightText: true,
    ShowOn: true
};

var Simulator = function() {


};


Simulator.prototype = {


    lightList: [],
    lightQuantity: 333,
    displayTime: 0.00001,
    canvas: null,
    ctx: null,
    canvasHeight: 950,
    canvasWidth: 950,
    register: null,
    pauseTime: 0,
    paused: false,
    playAudio: function(sound) {
        myAudio = new Audio(sound);
        myAudio.play();
    },
    add: function(id, light) {
        this.lightList[id] = light;
    },
    remove: function(id) {
        this.lightList[id].remove();
    },
    light: function(id) {
        if (!this.lightList[id]) {
            alert("No such light: " + id);
        }
        return this.lightList[id];
    },
    init: function(canvasID, showText) {
        CONFIG.showLightText = showText;

        this.canvas = document.getElementById(canvasID);
        this.canvas.height = (this.canvasHeight);
        this.canvas.width = (this.canvasWidth);
        var ctx = this.ctx = this.canvas.getContext('2d');
        this.canvas.backgroundColor = '#212830';


        for (var i in LightPosition) {



            var xy = LightPosition[i];
            //   console.log("positions["+i+"] = new Position("+xy[0]+","+xy[1]+"));");

            this.add(i, new Light(i, xy[0], xy[1], this.canvas, ctx, this));
        }


    },
    range: function(a, b, funct) {
        for (var i = a; i <= b; i++) {
            funct.call(this.light(i), i);
        }
    },
    addFunction: function(funct) {
        var dTime = this.displayTime;
        if (CONFIG.ShowOn) {
            setTimeout(funct, dTime);
        } else {
            funct.call();
        }
    },
    show: function() {
        if (CONFIG.ShowOn) {
            this.renderAll();
        }
    },
    display: function(time) {

        var self = this;



        var dTime = this.displayTime;
        time = time * 1000;
        this.displayTime += time;
        var o = this;
        setTimeout(function() {
            var data = self.collectLight();
            console.log(data);
            socket.emit('update', data);
            self.renderAll();
        }, dTime);


    },
    collectLight: function() {
        var collect = {};

        for (var i in this.lightList) {
            collect[i] = this.lightList[i].realColor;
        }
        return collect;


    },
    get: function(id) {
        var content = this.lightList[id].content;
        var text = this.lightList[id].text;
        return {
            text: text,
            content: content
        };
    },

    renderAll: function() {

        var self = this;
        if (this.paused) {

            setTimeout(function() {



            }, this.pauseTime);


        } else {

            var list = this.lightList;
            for (var i in list) {
                var light = list[i];
                light.redraw();
            }

        }
    },
    wait: function(time) {
        this.displayTime += time;
    },
    randomColor: function() {
        return makeColor(Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.round(Math.random() * 255));
    },
    sendData: function() {

        var content = this.Register.registry;

        var chunk = array_chunk(content, 3000);

        timer = 500;


        var fullLen = chunk.length;

        var pInterator = 0;

        function saveFilePrompt() {
            var name = prompt("Enter Name");
            var musicFile = prompt("Enter Music Name");
            if (name) {
                $.post("handle.php", {
                    save: 1,
                    name: name,
                    music: musicFile
                }, function(r) {
                    alert(r);
                });
            }
        }

        SendIterator = 0;
        var _last = false;

        function sendDataTo(data) {



            dataToSend = {
                data: data
            };
            if (_last) {
                dataToSend.end = 1;
            }

            $.post("collect.php", dataToSend, function(r) {
                pInterator++;
                var proc = pInterator / fullLen * 100;

                $('.bar').css('width', proc + '%').text(Math.round(proc) + '%');

                if (r == 'prompt') {
                    saveFilePrompt();
                    return;
                }
                if (chunk[SendIterator]) {


                    if (SendIterator == fullLen - 1) {
                        _last = true;
                    }
                    var theData = chunk[SendIterator];
                    sendDataTo(theData);
                    SendIterator++;
                }
            });



            //timer+=400;

        }
        var theData = chunk[SendIterator];
        sendDataTo(theData);

        /*var last = false;
        for(var i in chunk){
        
        	if(chunk[i]!='chunk')
        	{  
        		 
        		var theData = chunk[i];
        	     if(i == fullLen-1){last=true;}
        		    sendDataTo(theData,last);
        		    last =false;
        	}
        	
        }*/




    },
    Register: {
        registry: [],

        registerSleep: function(value) {
            this.registry.push({
                "cmd": 'sleep',
                "value": value
            });
        },

        registerColor: function(light, r, g, b) {
            this.registry.push({
                "cmd": 'color',
                "light_id": light,
                r: r,
                g: g,
                b: b
            });
        },
        registerDisplay: function() {
            this.registry.push({
                "cmd": 'display'
            });
        }

    },

    Color: {
        blend: function(rgb1, rgb2) {
            var result = [];
            for (var i = 0; i < rgb1.length; i++) {
                result.push(Math.floor(rgb1[i] * rgb2[i] / 255));
            }
            return this.create(result);
        },
        sum: function(rgb1, rgb2) {
            var result = [];
            for (var i = 0; i < rgb1.length; i++) {
                result.push(Math.floor((rgb1[i] + rgb2[i]) / 2));
            }
            return this.create(result);
        },
        create: function(rgb) {
            return makeColor(rgb[0], rgb[1], rgb[2]);
        }

    },
    Helpers: {
        shuffle: function(array) {
            for (var j, x, i = array.length; i; j = parseInt(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
            return (array);
        }

    }


}



var Light = function(id, x, y, canvas, ctx, sim) {
    this.init(id, x, y, canvas, ctx, sim);

};

Light.prototype = {

    id: 0,
    top: 5,
    left: 5,
    ctx: null,
    canvas: null,
    content: null,
    sim: null,
    text: null,
    realColor: null,
    color: makeColor(85, 85, 85).toRgba(),

    setColor: function(r, g, b) {
        var self = this;
        if (g == null) {
            this.sim.addFunction(function() {
                self.realColor = makeColor(r.r, r.g, r.b).realValue;
                self.color = r.toRgba();
            });
        } else {
            this.sim.addFunction(function() {
                //self.content.set('fill', c(r, g, b).toRgba());
                var c = makeColor(r, g, b);
                self.realColor = c.realValue;
                self.color = c.toRgba();
                // self.sim.Register.registerColor(self.id, r, g, b);

            });

        }
    },

    getColor: function() {

        return this.realColor;
    },
    remove: function() {
        this.canvas.remove(this.content);
        this.canvas.remove(this.text);
    },
    init: function(id, x, y, _canvas, ctx, sim) {
        this.id = id;
        this.top = y;
        this.left = x;
        this.sim = sim;
        this.ctx = ctx;
        this.canvas = _canvas;
        this.content = this.makeCircle()
        if (CONFIG.showLightText) {
            // this.text = this.makeText();
        }
        this.view();
    },
    view: function() {
        /*this.canvas.add(this.content);
              if (this.text) {
                  this.canvas.add(this.text);
              }*/
        this.makeCircle();

    },
    makeText: function() {

        var top = this.top + 1;
        var left = this.left;
        var color = this.color;

        var text = new fabric.Text(this.id.toString(), {
            fill: 'white',
            left: left,
            top: top,
            fontSize: 8
        });
        return text;
    },
    makeCircle: function() {
        var top = this.top;
        var left = this.left;
        var color = this.color;
        this.clearArc(left, top);
        this.drawArc(color, left, top);
    },
    drawArc: function(theColor, x, y) {

        ctx = this.ctx;
        ctx.closePath();
        ctx.beginPath();
        arc = ctx.arc(x, y, 9, 0, Math.PI * 2, false);
        ctx.fillStyle = theColor;
        ctx.fill();
        ctx.closePath();

    },
    clearArc: function(x, y) {
        ctx = this.ctx;
        var radius = 9;
        ctx.beginPath();
        ctx.clearRect(x - radius - 1, y - radius - 1, radius * 2 + 2, radius * 2 + 2);
        ctx.closePath();

    },
    redraw: function() {
        this.makeCircle();
    }


};


function range(start, end) {

    var arr = new Array();
    for (var i = start; i < end; i++) {
        arr[i] = parseInt(i);
    }
    return arr;
}

function rangeSimple(start, end) {

    var arr = new Array();
    for (var i = start; i < end; i++) {
        arr.push(i);
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