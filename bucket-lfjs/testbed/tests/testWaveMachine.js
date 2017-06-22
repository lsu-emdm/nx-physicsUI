// Consider color-mixing as AM synthesis
// Contact.NormalImpulse could be amplitude
// Contact Id's, contact listeners
// Contact events
// Get the fixtures from the contact, get the bodies from the fixtures
// pre-solve contact determines point state and approach velocity of collisions 
function TestWaveMachine() {
    camera.position.y = 1;
    camera.position.z = 2.5;
    
    var bd = new b2BodyDef(); //defines a body
    var ground = world.CreateBody(bd); //creates a bd (body) in the world
    
    // investigate making shapes, then bodies like this
    // this has to be at top b/c it uses bd and is static, else no body collisions
    bd = new b2BodyDef(); //define new body
    var circle = new b2CircleShape(); // create var for circle
    bd.type = b2_staticBody; //define new body as static
    var body = world.CreateBody(bd); // creates new static circle body (bd) in the world
    circle.position.Set(1.1, -0.3); // gives static circle body a position in the world
    circle.radius = 0.25; // size of static circle body
    body.CreateFixtureFromShape(circle, 0.5); // static cirle body (bd) is given a fixture (circle) and density
    
    bd.type = b2_dynamicBody;
    bd.allowSleep = false;
    bd.position.Set(0, 1);
    var body = world.CreateBody(bd);
    
    // b1.SetAsBoxXYCenterAngle(hx, hy, center in local coords, rotation in local coords or 0-3.14);
    // CreateFixtureFromShape(body, density);
    // rightwall
    var b1 = new b2PolygonShape();
    b1.SetAsBoxXYCenterAngle(0.05, 1, new b2Vec2(1, 0), 3.09);
    body.CreateFixtureFromShape(b1, 5);
    
    // left wall
    var b2 = new b2PolygonShape();
    b2.SetAsBoxXYCenterAngle(0.05, 1, new b2Vec2(-1, 0), 0.05);
    body.CreateFixtureFromShape(b2, 5);
    
    // top wall
    /*var b3 = new b2PolygonShape();
    b3.SetAsBoxXYCenterAngle(2, 0.05, new b2Vec2(0, 1), 0);
    body.CreateFixtureFromShape(b3, 5);*/
    
    // bottom wall
    var b4 = new b2PolygonShape();
    b4.SetAsBoxXYCenterAngle(1, 0.05, new b2Vec2(0, -1), 0);
    body.CreateFixtureFromShape(b4, 5);
    
    // counter-weight body
    var b5 = new b2PolygonShape();
    b5.SetAsBoxXYCenterAngle(0.25, 0.25, new b2Vec2(0.69, -0.7), 0);
    body.CreateFixtureFromShape(b5, 2);
    
    // motion
    var jd = new b2RevoluteJointDef();
    jd.motorSpeed = 0.05 * Math.PI;
    jd.maxMotorTorque = 1e7;
    jd.enableMotor = false; //true; to turn on motor
    this.joint = jd.InitializeAndCreate(ground, body, new b2Vec2(0, 0.75)); // investigate ground param
    this.time = 0;
    
    // setup particles
    var psd = new b2ParticleSystemDef();
    psd.radius = 0.025; // size of particles
    psd.dampingStrength = 0.2; // reduces velocity but I can't notice a difference yet.
    psd.b2ParticleFlag = b2_waterParticle;
    
    //world.SetContactFilter(psd); // look at testCollisionFiltering.js
    var particleSystem = world.CreateParticleSystem(psd);
    var box = new b2PolygonShape();
    box.SetAsBoxXYCenterAngle(0.9, 0.9, new b2Vec2(0, 1.0), 0);
    
    var particleGroupDef = new b2ParticleGroupDef();
    particleGroupDef.shape = box;
    var particleGroup = particleSystem.CreateParticleGroup(particleGroupDef);
    
    world.SetContactListener(psd); //listen to psd for contacts
}

TestWaveMachine.prototype.Step = function() {
    world.Step(timeStep, velocityIterations, positionIterations);
    this.time += 1 / 60;
    this.joint.SetMotorSpeed(0.05 * Math.cos(this.time) * Math.PI);
}

TestWaveMachine.prototype.Rub = function(contact) { // why doesn't this work?    
    if (b2_waterParticle) {
        console.log("testing contacts");
    }
}