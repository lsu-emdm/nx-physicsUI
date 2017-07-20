

////// Tone

var synth = [];
var pitchOffset = 200;

var gain = new Tone.Gain(0.01).toMaster();

function createSynths(noDis) {
	gain.gain.value = 1 / (numColumns * numRows);
	synth = [];
	for (var i = 0; i < noDis.length; i++) {
		var freq = noDis[i].x + noDis[i].y + pitchOffset;
		// var freq = noDis[i].x + pitchOffset;
		synth[i] = new Tone.Oscillator(freq, "sine").connect(gain).start();
		// console.log("Freq: ", freq, i);
	}
	
}

function updateSynthPitches(dis, noDis) {
	for (var i = 0; i < noDis.length; i++) {
		var freq = noDis[i].x + noDis[i].y + dis[i] + pitchOffset;
		// var freq = noDis[i].x + dis[i] + pitchOffset;
		// console.log("Freq: ", freq, i);
		synth[i].frequency.value = freq;
	}
}


////// Mesh

var numColumns = 20,
 		numRows = 12;

var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Body = Matter.Body,
    Composites = Matter.Composites,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
		Events = Matter.Events,
    World = Matter.World,
    Bodies = Matter.Bodies;

// create engine
var engine = Engine.create(),
    world = engine.world;

// create renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: Math.min(document.documentElement.clientWidth, 800),
        height: Math.min(document.documentElement.clientHeight, 600)
    }
});

Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

Events.on(engine, 'afterUpdate', function(event) {
	if(noDisplacement[0]){
		meshDisplacement();
	}

});


// add bodies
var group = Body.nextGroup(true),
    particleOptions = { friction: 0.00001, collisionFilter: { group: group }, render: { visible: false }},
    cloth = Composites.softBody(200, 200, numColumns, numRows, 5, 5, false, 8, particleOptions);

// attaching the first row of the cloth so that it won't move
for (var i = 0; i < numColumns; i++) {
    cloth.bodies[i].isStatic = true;
}

World.add(world, [
    cloth,
    //Bodies.circle(300, 500, 80, { isStatic: true }),
    //Bodies.rectangle(500, 480, 80, 80, { isStatic: true }),
   	Bodies.circle(50, 500, 80),
    Bodies.rectangle(500, 480, 80, 80),
    Bodies.rectangle(400, 609, 800, 50, { isStatic: true })
]);

// add mouse control
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.98,
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
    min: { x: 0, y: 0 },
    max: { x: 800, y: 600 }
});

var noDisplacement = [];

function setDisplacement() {
	// var noDisplacement = new Array();
	// console.log("Columns/Rows: ", cloth.columns, cloth.rows);
	for (var i = 0; i < cloth.rows; i++) {
		for (var j = 0; j < cloth.columns; j++) {
	    // console.log("Position: ", cloth.bodies[i+(i*j)].position.x, cloth.bodies[i+(i*j)].position.y);
			var index = [j+(i*cloth.rows)];
			noDisplacement[index] = {
				x:cloth.bodies[index].position.x,
				y:cloth.bodies[index].position.y
			};
		}
	}
	// console.log("No Displacement: ", noDisplacement);
	
	createSynths(noDisplacement);
	
}

function meshDisplacement() {
	// console.log("Measure Displacement");
	var displacement = [];
	var totalDisplacement = 0;
	for (var i = 0; i < cloth.rows; i++) { 
		for (var j = 0; j < cloth.columns; j++) {
			var index = [j+(i*cloth.rows)];
	    // console.log("Position: ", cloth.bodies[i+(i*j)].position.x, cloth.bodies[i+(i*j)].position.y);
			var disp = (cloth.bodies[index].position.x - noDisplacement[index].x) + (cloth.bodies[index].position.y - noDisplacement[index].y)
			displacement[index] = disp;
			totalDisplacement = totalDisplacement + disp;
		}
	}
	// console.log("Total Displacement: ", totalDisplacement);
	// console.log("Displacement: ", displacement);
	
	updateSynthPitches(displacement, noDisplacement);
	
	return displacement;
}


