

var numColumns = 7,
 		numRows = 5;


////// Tone

var synth = [];
var synthPitches = [];
var pitchOffset = 200;

var gain = new Tone.Gain(0.01).toMaster();

function createUniformSynths() {
	gain.gain.value = 1 / (numColumns * numRows);
	synth = [];
	if(noDisplacement[0]){
		for (var i = 0; i < noDisplacement.length; i++) {
			var freq = noDisplacement[i].x + noDisplacement[i].y + pitchOffset;
			// var freq = noDis[i].x + pitchOffset;
			synth[i] = new Tone.Oscillator(freq, "sine").connect(gain).start();
			// console.log("Freq: ", freq, i);
		}
	}	
	calcDisplacement = meshDisplacement;
}

function createMinorSynths() {
	var tonic = teoria.note('a')    // Create a note, A3
	var minor = tonic.scale('minor')  // Create a minor scale with that note as root (A minor)
	console.log("Minor Scale: ", minor.simple());	
	// console.log("Third: ",minor.get(3))     // Get the third note of the scale (C4)
	
	gain.gain.value = 1 / (numColumns * numRows);
	synth = [];
	synthPitches = [];
	
	if(noDisplacement[0]){			// Only create synths if initial displacement setting exists.
		for (var i = numRows-1; i >= 0; i--) {			// [4 3 2 1 0]
			for (var j = 0; j < numColumns; j++) {	// [0 1 2 3 4 5 6]
				var col = j - 3;	// [-3,5 -2,5 -1,5 0,5 1,5 2,5 3,5 -3,4 ...]
<<<<<<< HEAD
				var note = tonic.get(-1*(col*5));
				// synth[i] = new Tone.Oscillator(freq, "sine").connect(gain).start();
				synth.push(new Tone.Oscillator(note, "sine").connect(gain).start());
				// console.log("Freq: ", freq, i);
=======
				var note = minor.get(1+(col*4) + (i * 2));
				// console.log("Note: ", note.toString());
				synth.push(new Tone.Oscillator(note.fq(), "sine").connect(gain).start());
				synthPitches.push(note.fq());
>>>>>>> origin/master
			}
		}
	}
	console.log("SynthPitches: ", synthPitches);
		// Set function to calculate displacements...
	calcDisplacement = meshMinorDisplacement;
}
	

function updateSynthPitches(dis, noDis) {
	for (var i = 0; i < noDis.length; i++) {
		var freq = noDis[i].x + noDis[i].y + dis[i] + pitchOffset;
		// var freq = noDis[i].x + dis[i] + pitchOffset;
		// console.log("Freq: ", freq, i);
		synth[i].frequency.value = freq;
	}
}

function updateMinorSynthPitches(dis) {
	for (var i = 0; i < dis.length; i++) {
			// Y displacement for volume
		var vol = Math.abs(dis[i].y * 2.)-128;
		vol = Math.min(Math.max(vol, -128), 24);
		// console.log("vol: ", vol, Math.abs(dis[i].y)); 
			// X displacement to detune pitches
		var freq = synthPitches[i] + dis[i].x;
		// console.log("Freq: ", freq, i);
		synth[i].frequency.value = freq;
		synth[i].volume.value = vol;
	}
}


////// Mesh

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
		calcDisplacement();
	}
});


// add bodies
var group = Body.nextGroup(true),
    particleOptions = { friction: 0.00001, collisionFilter: { group: group }, render: { visible: false }},
    cloth = Composites.softBody(200, 200, numColumns, numRows, 25, 20, false, 8, particleOptions);

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
var typicalDisplacement = 0.0;

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
			typicalDisplacement = typicalDisplacement+ noDisplacement[index].x + noDisplacement[index].y;	
		}
	}
	typicalDisplacement = typicalDisplacement/noDisplacement.length;
	// console.log("No Displacement: ", noDisplacement);
	
	// createSynths(noDisplacement);
}


function calcDisplacement() {
	// no displacement yet... will replace with one of the below.
}


function meshDisplacement() {
	// console.log("Measure Displacement");
	var displacement = [];
	var displacementNormalized = [];
	var totalDisplacement = 0;
	for (var i = 0; i < cloth.rows; i++) { 
		for (var j = 0; j < cloth.columns; j++) {
			var index = [j+(i*cloth.rows)];
	    // console.log("Position: ", cloth.bodies[i+(i*j)].position.x, cloth.bodies[i+(i*j)].position.y);
			var disp = (cloth.bodies[index].position.x - noDisplacement[index].x) + (cloth.bodies[index].position.y - noDisplacement[index].y)
			displacement[index] = disp;
			displacementNormalized[index] = disp/typicalDisplacement;
			totalDisplacement = totalDisplacement + disp;
		}
	}
	// console.log("Total Displacement: ", totalDisplacement);
	//console.log("Displacement: ", displacement);
	//console.log("DisplacementNormalized: ", displacementNormalized);
	if(synth[0]){
		updateSynthPitches(displacement, noDisplacement);
	}
	
	return displacement;
}

function meshMinorDisplacement() {
	// console.log("Measure Displacement");
	var displacement = [];
	var displacementNormalized = [];
	var totalDisplacement = 0;
	for (var i = 0; i < cloth.rows; i++) { 
		for (var j = 0; j < cloth.columns; j++) {
			var index = [j+(i*cloth.rows)];
	    // console.log("Position: ", cloth.bodies[i+(i*j)].position.x, cloth.bodies[i+(i*j)].position.y);
			// var disp = (cloth.bodies[index].position.x - noDisplacement[index].x) + (cloth.bodies[index].position.y - noDisplacement[index].y)
			displacement[index] = {
				x:(cloth.bodies[index].position.x - noDisplacement[index].x),
				y:(cloth.bodies[index].position.y - noDisplacement[index].y)
			};
			// totalDisplacement = totalDisplacement + disp;
		}
	}
	// console.log("Total Displacement: ", totalDisplacement);
	//console.log("Displacement: ", displacement);
	//console.log("DisplacementNormalized: ", displacementNormalized);
	if(synth[0]){
		updateMinorSynthPitches(displacement);
	}
	
	return displacement;
}

