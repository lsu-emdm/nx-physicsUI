/* Newtons Cradle Widget
  Anthony T. Marasco [2017]
*/
var aMajPent = [57, 59, 61, 64, 66];
var poly;
var polyFM;
var poly2sine;
var convert;
var fund = 60;
var mixoScale = [fund, fund + 2, fund + 4, fund + 5, fund + 7, fund + 9, fund + 10]
var colors = ['#96ceb4', '#dd855c', '#ffeead', '#D81159', '#c2f2d0'];

var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Body = Matter.Body,
    Composites = Matter.Composites,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World;
    Events = Matter.Events;


Matter.use('matter-collision-events');

// create engine & world
var engine = Engine.create(),
    world = engine.world;

// create renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: Math.min(document.documentElement.clientWidth, 800),
        height: Math.min(document.documentElement.clientHeight, 600),
        showVelocity: true,
        wireframes: false,
        anchors: true
    }
});


var setupTone = function() {
    //make your synthy goodness happen here
    poly = new Tone.PolySynth(5, Tone.FMSynth).toMaster();

    poly2sine = new Tone.PolySynth(7, Tone.Synth).toMaster();
    convert = new Tone.Frequency();


    poly.set({
        "filter": {
            "type": "highpass"
        },
        "oscillator": {
            "type": "square"
        },
        "envelope": {
            "attack": 0.15,
            "sustain": 0.15
        }
    });

    poly2sine.set({
        "filter": {
            "type": "highpass"
        },
        "oscillator": {
            "type": "sine"
        },
        "envelope": {
            "attack": 0.15
        }
    });
    //polyFM.set({
    //});


};





// create runner
var runner = Runner.create();
Runner.run(runner, engine);
/*********************************************************************************************/

// add bodies and/or Composities


var cradle = Composites.newtonsCradle(280, 100, 5, 30, 200);
cradle.bodies[0].mass = 435;
cradle.bodies[4].mass = 135;

//name each body in the cradle
for (var i = 0; i < cradle.bodies.length; i++) {
    cradle.bodies[i].label = "C_Body" + i;
    for (var j = 0; j < cradle.bodies.length; j++) {
        cradle.bodies[j].pitch = aMajPent[j];
        cradle.bodies[j].note = "C_Body Pitch " + aMajPent[j];
        //cradle.bodies[j].mass=135.7;
        cradle.bodies[j].density = 0.01;
        cradle.bodies[j].cradleName = "Cradle";
    }
}






//place the starting position of the first cradle weight on load
//Body.translate(cradle.bodies[0], {
//    x: -100,
//    y: -200
//});

//assign each cradle body a pitch
//cradle.bodies[0].pitch = 60;

cradle2 = Composites.newtonsCradle(280, 380, 7, 20, 100);
for (var i = 0; i < cradle2.bodies.length; i++) {
    cradle2.bodies[i].label = "C2_Body" + i;
    for (var j = 0; j < cradle2.bodies.length; j++) {
        cradle2.bodies[j].pitch = mixoScale[j];
        cradle2.bodies[j].note = "C2_Body Pitch " + mixoScale[j];
        cradle2.bodies[j].cradleName = "Cradle2";
    }
}


Body.translate(cradle2.bodies[6], {
    x: 140,
    y: 100
});


/*********************************************************************************************/

//add bodies and/or Composites to the World
World.add(world, [cradle, cradle2]);
setupTone();

//Handle events here

Events.on(engine, 'collisionStart', function(event) {
    //console.log("boink!", event);
    var pairs = event.pairs;

    //console.log(pairs);
    for (var pair of pairs) {
        var collisionPitchA = pair.bodyA.pitch;
        var collisionPitchB = pair.bodyB.pitch;

        var mtof = convert.midiToFrequency(collisionPitchA);
        var mtof2 = convert.midiToFrequency(collisionPitchB);
        var velocSusA = pair.bodyA.velocity.x / 10;
        var velocSusB = Math.abs(pair.bodyB.velocity.x) / 10;

        cradle.bodies[0].onCollide(function(pairs) {
            //console.log('BoxB got hit!', pair);
            pair.bodyA.render.fillStyle = colors[Math.floor(Math.random() * colors.length)];
            pair.bodyB.render.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        });


        //try measuring the speed of pair.bodyA.speed is greater than that of bodyB, and take whichever one is faster!

        if (pair.bodyA.cradleName == "Cradle") {
            if (pair.bodyA.speed > pair.bodyB.speed) {
                poly.set({
                    "harmonicity": pair.bodyA.velocity.x*10,
                    "modulationIndex": pair.bodyA.velocity.x*10,
                    "envelope": {
                        "sustain": velocSusA
                    }

                });

                poly.triggerAttackRelease(mtof, velocSusA);
                console.log("pitch = ", mtof);
                console.log("veloc = ", velocSusA);
            } else if (pair.bodyB.speed > pair.bodyA.speed) {
                poly.set({
                  "harmonicity": pair.bodyB.velocity.x*-1,
                  "modulationIndex": pair.bodyB.velocity.x*-1,
                  "envelope": {
                      "sustain": velocSusB
                  }

              });
                poly.triggerAttackRelease(mtof2, velocSusB)
                console.log("pitch = ", mtof2);
                console.log("sustain = ", velocSusB);
                console.log(pair.bodyB.velocity.x);
            }
        }

        if (pair.bodyA.cradleName == "Cradle2") {
            if (pair.bodyA.speed > pair.bodyB.speed) {
                poly2sine.set({
                    "envelope": {
                        "sustain": velocSusA
                    }
                });
                poly2sine.triggerAttackRelease(mtof, velocSusA)
                console.log("pitch = ", collisionPitchA);
                console.log("sustain = ", velocSusA);
            } else if (pair.bodyB.speed > pair.bodyA.speed) {
                poly2sine.set({
                    "envelope": {
                        "sustain": velocSusB
                    }
                });
                poly2sine.triggerAttackRelease(mtof2, velocSusB)
                console.log("pitch = ", collisionPitchB);
                console.log("sustain = ", velocSusB);
            }
        }

    }
})

// add mouse control
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

World.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

// fit the render viewport to the scene
Render.lookAt(render, {
    min: {
        x: 0,
        y: 50
    },
    max: {
        x: 800,
        y: 600
    }
});
//Run the Renderer
Render.run(render);
