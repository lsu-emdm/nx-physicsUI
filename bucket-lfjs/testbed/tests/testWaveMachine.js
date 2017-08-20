// Consider color-mixing as AM synthesis
// Contact.NormalImpulse could be amplitude
// Contact Id's, contact listeners
// Contact events
// Get the fixtures from the contact, get the bodies from the fixtures
// pre-solve contact determines point state and approach velocity of collisions 

// make button to stop all physics
function TestWaveMachine() {
    camera.position.y = 1;
    camera.position.z = 2.5;
    
    var bd1 = new b2BodyDef(); //defines a body
    var ground = world.CreateBody(bd1); //creates a bd (body) in the world
    console.log(bd1);
    console.log(ground);
    
    // investigate making shapes, then bodies like this
    // this has to be at top b/c it uses bd and is static, else no body collisions
    //bd1 = new b2BodyDef(); //define new body
    var circle = new b2CircleShape(); // create var for circle
    bd1.type = b2_staticBody; //define new body as static
    var body1 = world.CreateBody(bd1); // creates new static circle body (bd) in the world
    circle.position.Set(1.1, -0.3); // gives static circle body a position in the world
    circle.radius = 0.25; // size of static circle body
    body1.CreateFixtureFromShape(circle, 0.5); // static cirle body (bd) is given a fixture (circle) and density
    console.log(circle);
    console.log(body1);
    
    var bd2 = new b2BodyDef();
    bd2.type = b2_dynamicBody;
    bd2.allowSleep = false;
    bd2.position.Set(0, 1);
    this.body2 = world.CreateBody(bd2);
    console.log(bd2);
    console.log(this.body2);
    
    // b1.SetAsBoxXYCenterAngle(hx, hy, center in local coords, rotation in local coords or 0-3.14);
    // CreateFixtureFromShape(body, density);
    // rightwall
    var b1 = new b2PolygonShape();
    b1.SetAsBoxXYCenterAngle(0.05, 1, new b2Vec2(1, 0), 3.09);
    this.body2.CreateFixtureFromShape(b1, 5);
    console.log(b1);
    
    // left wall
    var b2 = new b2PolygonShape();
    b2.SetAsBoxXYCenterAngle(0.05, 1, new b2Vec2(-1, 0), 0.05);
    this.body2.CreateFixtureFromShape(b2, 5);
    console.log(b2);
    
    // top wall
    /*var b3 = new b2PolygonShape();
    b3.SetAsBoxXYCenterAngle(2, 0.05, new b2Vec2(0, 1), 0);
    body.CreateFixtureFromShape(b3, 5);*/
    
    // bottom wall
    var b4 = new b2PolygonShape();
    b4.SetAsBoxXYCenterAngle(1, 0.05, new b2Vec2(0, -1), 0);
    this.body2.CreateFixtureFromShape(b4, 5);
    console.log(b4);
    
    // counter-weight body
    var b5 = new b2PolygonShape();
    b5.SetAsBoxXYCenterAngle(0.25, 0.25, new b2Vec2(0.69, -0.7), 0);
    this.body2.CreateFixtureFromShape(b5, 2);
    console.log(b5);
    
    // motion
    var jd = new b2RevoluteJointDef();
    jd.motorSpeed = 0.05 * Math.PI;
    jd.maxMotorTorque = 1e7;
    jd.enableMotor = false; //true; to turn on motor
    this.joint = jd.InitializeAndCreate(ground, this.body2, new b2Vec2(0, 0.75)); // investigate ground param
    this.time = 0;
    console.log(jd);
    console.log(this.joint);
    console.log(this.time);
    
    // put this inside a function (maybe onclick or something) so that a new group instance is made each time
    // each new group instance has different musical qualities, colors
    // setup particles
    var psd = new b2ParticleSystemDef();
    psd.radius = 0.025;
    psd.dampingStrength = 0.2;
    psd.destroyByAge = true;
    psd.repulsiveStrength = 0;
    
    var particleSystem = world.CreateParticleSystem(psd);
    
    var groupNum = 30;
    for (var i = 0; i < groupNum; i++) {
        var box = new b2PolygonShape();
        box.SetAsBoxXYCenterAngle(0.1, 0.499, new b2Vec2(0, 4+i), 0);
        var particleGroupDef = new b2ParticleGroupDef();
        particleGroupDef.shape = box;
        particleGroupDef.lifetime = 9;
        var particleGroup = particleSystem.CreateParticleGroup(particleGroupDef);
        //var destroyParticleGroup = particleGroup.DestroyParticles(particleGroupDef);
        //particleSystem.ParticleGroupDestroyed = [i];
    }
    
    var myLoop = setInterval(faucet, 7500);
    function faucet() {   
        var groupNum = 30;
        for (var i = 0; i < groupNum; i++) {
            var box = new b2PolygonShape();
            box.SetAsBoxXYCenterAngle(0.1, 0.499, new b2Vec2(0, 4+i), 0);
            var particleGroupDef = new b2ParticleGroupDef();
            particleGroupDef.shape = box;
            particleGroupDef.lifetime = 9;
            var particleGroup = particleSystem.CreateParticleGroup(particleGroupDef);
            //particleSystem.destroyOldestParticle = true;
        }
        //var shape = box;
        //var xf = new b2Transform;
        //xf.SetIdentity();
        //particleSystem.DestroyParticlesInShape(shape, xf);    
        //var destroyParticleSystem = world.DestroyParticleSystem(particleSystem);
    }
    // fill the buck up slower? color code each instance?
    // figure out how to delete them better.
    world.SetContactListener(this); //listen to contacts inside TestWaveMachine
    console.log(psd);
    console.log(particleSystem);
    console.log(particleGroupDef);
    console.log(particleGroup);
}

TestWaveMachine.prototype.Step = function() {
    world.Step(timeStep, velocityIterations, positionIterations);
    this.time += 1 / 60;
    this.joint.SetMotorSpeed(0.05 * Math.cos(this.time) * Math.PI);
}

TestWaveMachine.prototype.BeginContact = function(contact, impulse) {
    console.log(particleSystem, particleContact);    
}


//TestWaveMachine.prototype.PostSolve = function(contact, impulse) {
//    console.log(contact);
//}

/*
TestWaveMachine.prototype.PreSolve = function(contact, oldManifold) {
    var worldManifold = b2WorldManifold;
    contact = GetWorldManifold(worldManifold);
    var state1[2] = b2PointState;
    var state2[2] = b2PointState;

    b2GetPointStates(state1, state2, oldManifold, contact->GetManifold());
    if (state2[0] == b2_addState) {
       const b2Body* bodyA = contact->GetFixtureA()->GetBody();
       const b2Body* bodyB = contact->GetFixtureB()->GetBody();
       b2Vec2 point = worldManifold.points[0];
       b2Vec2 vA = bodyA->GetLinearVelocityFromWorldPoint(point);
       b2Vec2 vB = bodyB->GetLinearVelocityFromWorldPoint(point);
       float32 approachVelocity = b2Dot(vB – vA, worldManifold.normal);
       if (approachVelocity > 1.0f)
       {
          MyPlayCollisionSound();
       }
    }
}
*/
//TestWaveMachine.prototype.PostSolve = function(contact, impulse) { // best for gathering impulses  
    
    
    //console.log(contact.GetFixtureA()); // polygon shape // I think this is just the bucket touching the stopper
    //console.log(contact.GetFixtureB()); // circle shape
    //console.log(contact.GetFixtureA().body.GetLinearVelocity());
    
    // detect what is colliding - circle and bucket, not particles
    // get fixture from A and B
    // check shape, get user data, set user data, 
    // get list of particles generated
    // use array to attach pitch, etc. to particles 1-100
    // calculate on fly, assign, or put data into object (this is most obj orient);
//}

/*
About particles:
Behaviors can be set
Create a group and set group properties. See b2ParticleGroupFlag.
To create particles: b2ParticleDef object, specify behaviors, call CreateParticle(particleName) method (CreateParticle returns an index)
Particle Group begins in a shape (try a for loop that names each particle for ID)
b2ParticleGroupFlag: use b2_elasticParticle; pd.flags = b2_elasticParticle;
Properties: Color: pd.color.Set(r, g, b, a); Size, Position: pd.position.Set(x, y); Velocity, Angle, Strength

About collisions:
collision module contains shapes and functions that operate on them
shapes describe collision geometry
you can test a point of overlap on shapes
Binary functions in collision module: overlap, contact manifolds, distance, time of impact
inspect broad and narrow phase collision processing 

Contact ID's are used to match contact points across time steps
contacts are created when 2 FIXTURE'S AABB's overlap. Sometimes collision filtering will prevent the creation of contacts.
Contact class is created and destroyed by liquidfun
You can access the contact class and interact with it: GetManifold();
use IsTouching(); for sensors (boolean)
You can get the fixtures from a contact. From those you can get the bodies.

   b2Fixture* fixtureA = myContact->GetFixtureA();
   b2Body* bodyA = fixtureA->GetBody();
   MyActor* actorA = (MyActor*)bodyA->GetUserData();
   
You can access all contacts in the world:
for (b2Contact* c = myWorld->GetContactList(); c; c = c->GetNext())
   {
      // process c
   }

Contact listener is most accurate
listeners support events: begin, end, pre-solve, post-solve

The pre-solve event is also a good place to determine the point state and the approach velocity of collisions.

   void PreSolve(b2Contact* contact, const b2Manifold* oldManifold)
   {
      b2WorldManifold worldManifold;
      contact->GetWorldManifold(&worldManifold);
      b2PointState state1[2], state2[2];
      b2GetPointStates(state1, state2, oldManifold, contact->GetManifold());
      if (state2[0] == b2_addState)
      {
         const b2Body* bodyA = contact->GetFixtureA()->GetBody();
         const b2Body* bodyB = contact->GetFixtureB()->GetBody();
         b2Vec2 point = worldManifold.points[0];
         b2Vec2 vA = bodyA->GetLinearVelocityFromWorldPoint(point);
         b2Vec2 vB = bodyB->GetLinearVelocityFromWorldPoint(point);
         float32 approachVelocity = b2Dot(vB – vA, worldManifold.normal);
         if (approachVelocity > 1.0f)
         {
            MyPlayCollisionSound();
         }
      }
   }
   
Contact filtering decides what objects collide.
*/
