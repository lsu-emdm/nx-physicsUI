var veloAvg;
var veloDelta;
var prevVelo = 0;
var posAvg;
var posDelta;
var prevPos = 0;
var posMax;
var posMin;
var interpVelo = new Tone.CtrlInterpolate([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
var interpPos = new Tone.CtrlInterpolate([1, 2, 3, 4, 5, 6]);
var vibrato = new Tone.Vibrato({
    maxDelay: 0.005,
    frequency: 5,
    depth: 0.1,
    oscillator: {
        type: "sine"
    },
    wet: 0.5
}).toMaster();
var FMOsc = new Tone.FMOscillator({
    frequency: 233,
    detune: 0,
    modulationIndex: 2,
    harmonicity: 1,
    oscillator: {
        type: "sine",
    },
    modulationType: "square",
    phase: 0,
    partials: [1, 0.2, 0.01],
    volume: -6,
    mute: false
}).start().chain(vibrato);

//var sequence = new Tone.Sequence(playNote, ["E4", "C4", "F#4", ["A4", "Bb3"]]);

// This test is buggy :( todo debug the particle issues
//var pointer0 = 5485144; //all of the pointers show the same data in GetVelocityBuffer and GetPositionBuffer
//var pointer1 = 5485240;
//var pointer2 = 5485336;
//var pointerP = 5425664;

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
    this.vertices.push(new b2Vec2(-3, -0.1));
    this.vertices.push(new b2Vec2(-3, 6.1));
    this.vertices.push(new b2Vec2(-4, 6.1));
    this.ground.CreateFixtureFromShape(this.shape2, 0);

    this.shape3 = new b2PolygonShape();
    this.vertices = this.shape3.vertices;
    this.vertices.push(new b2Vec2(3, -0.1));
    this.vertices.push(new b2Vec2(4, -0.1));
    this.vertices.push(new b2Vec2(4, 6.1));
    this.vertices.push(new b2Vec2(3, 6.1));
    this.ground.CreateFixtureFromShape(this.shape3, 0);

    this.shape4 = new b2PolygonShape();
    this.vertices = this.shape4.vertices;
    this.vertices.push(new b2Vec2(-4, 6));
    this.vertices.push(new b2Vec2(4, 6));
    this.vertices.push(new b2Vec2(4, 7));
    this.vertices.push(new b2Vec2(-4, 7));
    this.ground.CreateFixtureFromShape(this.shape4, 0);

    this.psd = new b2ParticleSystemDef();
    this.psd.radius = 0.035;
    this.particleSystem = world.CreateParticleSystem(this.psd);

    // one group
    this.circle0 = new b2CircleShape();
    this.circle0.position.Set(0, 3);
    this.circle0.radius = 0.5;
    this.pgd0 = new b2ParticleGroupDef();
    this.pgd0.flags = b2_springParticle;
    this.pgd0.groupFlags = b2_solidParticleGroup;
    this.pgd0.shape = this.circle0;
    this.pgd0.color.Set(255, 0, 0, 255);
    this.pg0 = this.particleSystem.CreateParticleGroup(this.pgd0);

    // two group
    this.circle1 = new b2CircleShape();
    this.circle1.position.Set(-1, 3);
    this.circle1.radius = 0.5;
    this.pgd1 = new b2ParticleGroupDef();
    this.pgd1.flags = b2_elasticParticle;
    this.pgd1.groupFlags = b2_solidParticleGroup;
    this.pgd1.shape = this.circle1;
    this.pgd1.color.Set(0, 255, 0, 255);
    this.pg1 = this.particleSystem.CreateParticleGroup(this.pgd1);

    // third group
    this.box0 = new b2PolygonShape();
    this.pgd2 = new b2ParticleGroupDef();
    this.box0.SetAsBoxXY(1, 0.5);
    this.pgd2.flags = b2_elasticParticle;
    this.pgd2.groupFlags = b2_solidParticleGroup;
    this.pgd2.position.Set(1, 4);
    this.pgd2.angle = -0.5;
    this.pgd2.angularVelocity = 2;
    this.pgd2.shape = this.box0;
    this.pgd2.color.Set(0, 0, 255, 255);
    this.pg2 = this.particleSystem.CreateParticleGroup(this.pgd2);


    // circle
    this.bd = new b2BodyDef();
    this.circle3 = new b2CircleShape();
    this.bd.type = b2_dynamicBody;
    this.body = world.CreateBody(this.bd);
    this.circle3.position.Set(0, 1);
    this.circle3.radius = 0.5;
    this.body.CreateFixtureFromShape(this.circle3, 0.5);

    function synth() {
        omniOsc.start();
    }

    //console.log(this.pgd0.color);
    //console.log(this.pgd1.color);
    //console.log(this.pgd2.color);

    //this.posiBuffer = new Float32Array(this.particleSystem.GetPositionBuffer(this.pg0.ptr));
    //console.log(this.posiBuffer);
    //
    //this.veloBuffer = new Float32Array(this.particleSystem.GetVelocityBuffer(this.pg0.ptr));
    //console.log(this.veloBuffer);

}

TestElasticParticles.prototype.Step = function () {
    world.Step(timeStep, velocityIterations, positionIterations);
    this.time += 1 / 60;

    this.posBuffer = new Float32Array(this.particleSystem.GetPositionBuffer(this.pg0.ptr));
    //console.log(this.posiBuffer);

    this.veloBuffer = new Float32Array(this.particleSystem.GetVelocityBuffer(this.pg0.ptr));
    //console.log(this.veloBuffer);
    //find out the largest and smallest values in the buffer
    //use .sort(compareNumbers) to get delta value of largest and smallest numbers?
    //this.veloMax = new getMaxOfArray(this.veloBuffer); // up to 12.6
    //this.veloMin = new getMinOfArray(this.veloBuffer); // as low as -12.6
    //this.posiMax = new getMaxOfArray(this.posiBuffer); // returns Infinity
    //getMinOfArray(this.posiBuffer); // returns -Infinity
    //getMaxOfVelo(this.veloBuffer);
    //getMinOfVelo(this.veloBuffer);
    //getMaxOfPosi(this.posiBuffer);
    //getMinOfPosi(this.posiBuffer);
    //averagingArray(this.veloBuffer);
    deltaOfVelo(averagingArrayVelo(this.veloBuffer));
    deltaOfPos(averagingArrayPos(this.posBuffer));
    getMaxOfPosi(this.posBuffer);
    getMinOfPosi(this.posBuffer);
    FMOsc.harmonicity.value = veloDelta;
    FMOsc.modulationIndex.value = veloAvg;
    vibrato.wet.value = posAvg;
    vibrato.depth.value = posMax - posMin;
    //console.log(vibrato.depth.value);
    //FMOsc.frequency.value = (440 * veloAvg);
    //console.log(FMOsc.frequency.value);
}

function getMaxOfVelo(numArray) {
    var maxim = Math.max.apply(null, numArray);
    interpVelo.index = Math.abs(maxim);
    console.log(interpVelo.value);
    return interpVelo.value;
}

function getMaxOfPosi(numArray) {
    var maxim = Math.max.apply(null, numArray);
    interpPos.index = Math.abs(maxim);
    //console.log(interpPos.value);
    posMax = interpPos.value;
    return posMax;
}

function getMinOfVelo(numArray) {
    var minim = Math.min.apply(null, numArray);
    interpVelo.index = Math.abs(minim);
    console.log(interpVelo.value);
    return interpVelo.value;
}

function getMinOfPosi(numArray) {
    var minim = Math.min.apply(null, numArray);
    interpPos.index = Math.abs(minim);
    //console.log(interpPos.value);
    posMin = interpPos.value
    return posMin;
}

function averagingArrayVelo(aRRay) {
    var total = 0;
    for (var i = 0; i < aRRay.length; i++) {
        total += aRRay[i];
        var avg = total / aRRay.length;
    }
    //sconsole.log(avg);
    //console.log(avg.toPrecision(4));
    veloAvg = avg.toPrecision(4);
    //console.log(veloAvg);
    return veloAvg;
}

function averagingArrayPos(aRRay) {
    var total = 0;
    for (var i = 0; i < aRRay.length; i++) {
        total += aRRay[i];
        var avg = total / aRRay.length;
    }
    //sconsole.log(avg);
    //console.log(avg.toPrecision(4));
    posAvg = avg.toPrecision(4);
    //console.log(posAvg);
    return posAvg;
}

function deltaOfVelo(averaged) {
    var currentVelo = averaged;
    var deltaVelo = currentVelo - prevVelo;
    prevVelo = currentVelo;
    //console.log(deltaVelo.toPrecision(4));
    veloDelta = deltaVelo.toPrecision(4);
    return veloDelta;
}

function deltaOfPos(averaged) {
    var currentPos = averaged;
    var deltaPos = currentPos - prevPos;
    prevPos = currentPos;
    //console.log(deltaPos.toPrecision(4));
    posDelta = deltaPos.toPrecision(4);
    return posDelta;
}