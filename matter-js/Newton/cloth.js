
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

// add bodies
var group = Body.nextGroup(true),
    particleOptions = { friction: 0.00001, collisionFilter: { group: group }, render: { visible: true }},
    cloth = Composites.softBody(200, 200, 20, 12, 5, 5, false, 8, particleOptions);
		cloth.rows = 12;
		cloth.columns = 20;
		cloth.defaultSeparation = 8 + 8 + 5 - 1;

for (var i = 0; i < 20; i++) {
    cloth.bodies[i].isStatic = true;
}

World.add(world, [
    cloth,
    Bodies.circle(300, 500, 80),
    Bodies.rectangle(500, 480, 80, 80),
    Bodies.rectangle(400, 609, 1000, 50, { isStatic: true })
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

// Collision Events?
//Events.on(engine, 'collisionStart', function(event) {
//    var pairs = event.pairs;
//		console.log("Collisions: ", event);
//
//    // change object colours to show those starting a collision
//    for (var i = 0; i < pairs.length; i++) {
//        var pair = pairs[i];
//        pair.bodyA.render.fillStyle = '#333';
//        pair.bodyB.render.fillStyle = '#333';
//    }
//});

Events.on(engine, 'afterUpdate', function(event) {
    var engine = event.source;
		
		// CheckDistance every 5 seconds
		if (event.timestamp % 5000 < 50) {
			// console.log("checkDistances: ", event);
			checkDistances();
		}
});

var checkDistances = function() {
	var distances = [];
	var	row,
		col;
	var rows = cloth.rows;
	var columns = cloth.columns;
	
	console.log("cloth.rows: ", rows);
	
	for (row = 0; row < rows; row++) {
  	for (col = 1; col < columns; col++) {
			var index = (col-1) + (row * columns);
			bodyA = cloth.bodies[index];
      bodyB = cloth.bodies[index + 1];
			distances[index] = (Math.hypot(bodyB.position.x - bodyA.position.x, bodyB.position.y - bodyA.position.y) - cloth.defaultSeparation);
		}
	}
	
	console.log("Distances: ", distances);
	
	return distances
}


// fit the render viewport to the scene
Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 800, y: 600 }
});


