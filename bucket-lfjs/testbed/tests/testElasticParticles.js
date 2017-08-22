// This test is buggy :( todo debug the particle issues
function TestElasticParticles() {
  camera.position.y = 3;
  camera.position.z = 6;

  this.bd = new b2BodyDef();
  this.ground = world.CreateBody(this.bd);

  this.shape1 = new b2PolygonShape();
  this.vertices = this.shape1.vertices;
  this.vertices.push(new b2Vec2(-4, -1));
  this.vertices.push(new b2Vec2(4, -1));
  this.vertices.push(new b2Vec2(4, 0));
  this.vertices.push(new b2Vec2(-4, 0));
  this.ground.CreateFixtureFromShape(this.shape1, 0);

  this.shape2 = new b2PolygonShape();
  this.vertices = this.shape2.vertices;
  this.vertices.push(new b2Vec2(-4, -0.1));
  this.vertices.push(new b2Vec2(-2, -0.1));
  this.vertices.push(new b2Vec2(-2, 2));
  this.vertices.push(new b2Vec2(-4, 2));
  this.ground.CreateFixtureFromShape(this.shape2, 0);

  this.shape3 = new b2PolygonShape();
  this.vertices = this.shape3.vertices;
  this.vertices.push(new b2Vec2(2, -0.1));
  this.vertices.push(new b2Vec2(4, -0.1));
  this.vertices.push(new b2Vec2(4, 2));
  this.vertices.push(new b2Vec2(2, 2));
  this.ground.CreateFixtureFromShape(this.shape3, 0);

  this.psd = new b2ParticleSystemDef();
  this.psd.radius = 0.035;
  this.particleSystem = world.CreateParticleSystem(this.psd);

  // one group
  this.circle = new b2CircleShape();
  this.circle.position.Set(0, 3);
  this.circle.radius = 0.5;
  this.pgd = new b2ParticleGroupDef();
  this.pgd.flags = b2_springParticle;
  this.pgd.groupFlags = b2_solidParticleGroup;
  this.pgd.shape = this.circle;
  this.pgd.color.Set(255, 0, 0, 255);
  this.particleSystem.CreateParticleGroup(this.pgd);

  // two group
  this.circle = new b2CircleShape();
  this.circle.position.Set(-1, 3);
  this.circle.radius = 0.5;
  this.pgd = new b2ParticleGroupDef();
  this.pgd.flags = b2_elasticParticle;
  this.pgd.groupFlags = b2_solidParticleGroup;
  this.pgd.shape = this.circle;
  this.pgd.color.Set(0, 255, 0, 255);
  this.particleSystem.CreateParticleGroup(this.pgd);

  // third group
  this.box = new b2PolygonShape();
  this.pgd = new b2ParticleGroupDef();
  this.box.SetAsBoxXY(1, 0.5);
  this.pgd.flags = b2_elasticParticle;
  this.pgd.groupFlags = b2_solidParticleGroup;
  this.pgd.position.Set(1, 4);
  this.pgd.angle = -0.5;
  this.pgd.angularVelocity = 2;
  this.pgd.shape = this.box;
  this.pgd.color.Set(0, 0, 255, 255);
  this.particleSystem.CreateParticleGroup(this.pgd);


  // circle
  this.bd = new b2BodyDef();
  this.circle = new b2CircleShape();
  this.bd.type = b2_staticBody;
  this.body = world.CreateBody(this.bd);
  this.circle.position.Set(0, 1);
  this.circle.radius = 0.5;
  this.body.CreateFixtureFromShape(this.circle, 0.5);
}