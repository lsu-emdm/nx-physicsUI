function TestParticleSystemQualities() {
    camera.position.y = 1;
    camera.position.z = 2.5;
    
    var psd = new b2ParticleSystemDef();
    psd.radius = 0.025;
    psd.dampingStrength = 0.2;
    
    var particleSystem = world.CreateParticleSystem(psd);
    var box = new b2PolygonShape();
    box.SetAsBoxXYCenterAngle(0.9, 2.9, new b2Vec2(0, 4.0), 0);
    
    var particleGroupDef = new b2ParticleGroupDef();
    particleGroupDef.shape = box;
    var particleGroup = particleSystem.CreateParticleGroup(particleGroupDef);
}
/*
TestWaveMachine.prototype.Step = function() {
    world.Step(timeStep, velocityIterations, positionIterations);
    this.time += 1 / 60;
 //   this.joint.SetMotorSpeed(0.05 * Math.cos(this.time) * Math.PI);
}*/