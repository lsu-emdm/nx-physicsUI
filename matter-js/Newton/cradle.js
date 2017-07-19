
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Body = Matter.Body,
    Composites = Matter.Composites,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World;

// create engine
var engine = Engine.create(),
    world = engine.world;

// create renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: Math.min(document.documentElement.clientWidth, 800),
        height: Math.min(document.documentElement.clientHeight, 600),
        showVelocity: true
    }
});

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

// add bodies
var cradle = Composites.newtonsCradle(180, 100, 7, 60, 100);
World.add(world, cradle);
Body.translate(cradle.bodies[0], { x: -180, y: -100 });

cradle = Composites.newtonsCradle(280, 380, 7, 20, 140);
World.add(world, cradle);
Body.translate(cradle.bodies[0], { x: -140, y: -100 });

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
    min: { x: 0, y: 50 },
    max: { x: 800, y: 600 }
});

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);