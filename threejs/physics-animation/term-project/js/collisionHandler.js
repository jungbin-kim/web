function CollisionHandler(){

}
CollisionHandler.collisionBetweenParticleAndPlane = function(i, particle_array, planeObj){
	var particlePositionMinusP = particle_array[i].pos.clone().sub(planeObj.p); //b
	var particlePositionBeforeCollision = particle_array[i].pos.clone(); //x(tn)

	var particleVelocityBeforeCollision = particle_array[i].velo.clone();
	var normalVelocityBeforeCollision = planeObj.normal_vector.clone().multiplyScalar(particleVelocityBeforeCollision.dot(planeObj.normal_vector));
	var planeVelocityBeforeCollision = particleVelocityBeforeCollision.clone().sub(normalVelocityBeforeCollision);

    // EulerExplicit(i, particle_array);
    EulerSemiImplicit(i, particle_array);
    // EulerSemiImplicit2(i, particle_array);

	var particlePositionAfterCollision = particle_array[i].pos.clone();

	var veloVec3AfterCollision = normalVelocityBeforeCollision.clone().multiplyScalar(-e).add(planeVelocityBeforeCollision.clone().multiplyScalar(c));

	var a = new THREE.Vector3();
	a.subVectors(particlePositionBeforeCollision,particlePositionAfterCollision);

	var aCrossB = new THREE.Vector3();
	aCrossB.crossVectors(a, particlePositionMinusP);
	var uCrossVDotA = planeObj.uCrossV.dot(a);

	var s = aCrossB.dot(planeObj.v) / uCrossVDotA;
	var t = (-1 * aCrossB.dot(planeObj.u)) / uCrossVDotA
	var lamda =  planeObj.uCrossV.dot(particlePositionMinusP)/ uCrossVDotA;

	var posVec3AfterCollision = new THREE.Vector3();
	posVec3AfterCollision.addVectors(particlePositionBeforeCollision,veloVec3AfterCollision.clone().multiplyScalar((1-lamda)*dt));

    if((0 <= s && s <= 1) && (0 <= t && t <= 1) && (0 <= lamda && lamda <= 1)){
        console.log("Collision occur on the Finite Plane");
        particle_array[i].velo = veloVec3AfterCollision;
        particle_array[i].pos = posVec3AfterCollision;
        return true;
    }else{
        return false;
    }
}
/*
 CollisionHandler.collisionInRope = function(i, particles_array){
 for(var j = 0; j<particles_array.length; j++){
 if(j!==i){
 CollisionHandler.collisionTwoParticles(particles_array[i], particles_array[j]);
 }
 }
 }
 */

CollisionHandler.collisionParticles = function(particle_index, rope_index, rope_manager){

}

CollisionHandler.collisionBetweenParticles = function(i, particles_array){
    if (i < particles_array.length - 1 ){
        for (var j = i + 1 ; j < particles_array.length; j++) {
            CollisionHandler.collisionTwoParticles(particles_array[i], particles_array[j]);
        };
    }

    /*
     // input para: particleManager
     for (var i = 0; i < particleManager.length; i++) {
     for (var j = i + 1 ; j < particleManager.length; j++) {
     CollisionHandler.collisionTwoParticles(particleManager.particles_array[i], particleManager.particles_array[j]);
     };
     };
     */
}

CollisionHandler.collisionTwoParticles = function (particleB, particleA){
	var distance = new THREE.Vector3();
	distance.subVectors(particleB.pos, particleA.pos);
	var z = distance.length() - (particleB.r + particleA.r);

	if(z < 0){
		var n = distance.clone().normalize();

		var uBeforeCollision = particleB.velo.clone().sub(particleA.velo).dot(n);

		var j = (1+e) * ((particleA.m * particleB.m)/( particleA.m + particleB.m )) * uBeforeCollision;

		particleA.velo.add(n.clone().multiplyScalar(j/particleA.m));

		particleB.velo.sub(n.clone().multiplyScalar(j/particleB.m));

		//console.log("Collision occurs between particles");

	}
}
CollisionHandler.collisionBetweenParticleAndPlanes = function(i, particle_array, planes){
	// console.log(planes);
	var particlePositionBeforeCollision = particle_array[i].pos.clone();
	var particleVelocityBeforeCollision = particle_array[i].velo.clone();
	EulerExplicit(i, particle_array);
	var particlePositionAfterCollision = particle_array[i].pos.clone();

	var a = new THREE.Vector3();
	a.subVectors(particlePositionBeforeCollision,particlePositionAfterCollision);

	for(var j = 0; j < planes.length; j++){
		var particlePositionMinusP = particlePositionBeforeCollision.clone().sub(planes[j].p);
		var normalVelocityBeforeCollision = planes[j].normal_vector.clone().multiplyScalar(particleVelocityBeforeCollision.dot(planes[j].normal_vector));
		var planeVelocityBeforeCollision = particleVelocityBeforeCollision.clone().sub(normalVelocityBeforeCollision);

		var veloVec3AfterCollision = normalVelocityBeforeCollision.clone().multiplyScalar(-e).add(planeVelocityBeforeCollision.clone().multiplyScalar(c));
		var aCrossB = new THREE.Vector3();
		aCrossB.crossVectors(a, particlePositionMinusP);
		var uCrossVDotA = planes[j].uCrossV.dot(a);

		var s = aCrossB.dot(planes[j].v) / uCrossVDotA;
		var t = (-1 * aCrossB.dot(planes[j].u)) / uCrossVDotA
		var lamda =  planes[j].uCrossV.dot(particlePositionMinusP) / uCrossVDotA;

		var posVec3AfterCollision = new THREE.Vector3();
		posVec3AfterCollision.addVectors(particlePositionBeforeCollision,veloVec3AfterCollision.clone().multiplyScalar((1-lamda)*dt));

		if((0 <= s && s <= 1) && (0 <= t && t <= 1) && (0 <= lamda && lamda <= 1)){
			// console.log("Collision occur on the Finite Plane");
			particle_array[i].velo = veloVec3AfterCollision;
			particle_array[i].pos = posVec3AfterCollision;
		}
	}
}

CollisionHandler.collisionPlanes = function(pre_particle_pos, pre_particle_velo, current_particle, planes){
    // console.log(planes);
    // var particlePositionBeforeCollision = pre_particle.pos.clone();
    // var particleVelocityBeforeCollision = pre_particle.velo.clone();
    var particlePositionBeforeCollision = pre_particle_pos;
    var particleVelocityBeforeCollision = pre_particle_velo;

    var particlePositionAfterCollision = current_particle.pos.clone();

    var a = new THREE.Vector3();
    a.subVectors(particlePositionBeforeCollision,particlePositionAfterCollision);

    for(var j = 0; j < planes.length; j++){
        var particlePositionMinusP = particlePositionBeforeCollision.clone().sub(planes[j].p);
        var normalVelocityBeforeCollision = planes[j].normal_vector.clone().multiplyScalar(particleVelocityBeforeCollision.dot(planes[j].normal_vector));
        var planeVelocityBeforeCollision = particleVelocityBeforeCollision.clone().sub(normalVelocityBeforeCollision);

        var veloVec3AfterCollision = normalVelocityBeforeCollision.clone().multiplyScalar(-e).add(planeVelocityBeforeCollision.clone().multiplyScalar(c));
        var aCrossB = new THREE.Vector3();
        aCrossB.crossVectors(a, particlePositionMinusP);
        var uCrossVDotA = planes[j].uCrossV.dot(a);

        var s = aCrossB.dot(planes[j].v) / uCrossVDotA;
        var t = (-1 * aCrossB.dot(planes[j].u)) / uCrossVDotA
        var lamda =  planes[j].uCrossV.dot(particlePositionMinusP) / uCrossVDotA;

        var posVec3AfterCollision = new THREE.Vector3();
        posVec3AfterCollision.addVectors(particlePositionBeforeCollision,veloVec3AfterCollision.clone().multiplyScalar((1-lamda)*dt));

        if((0 <= s && s <= 1) && (0 <= t && t <= 1) && (0 <= lamda && lamda <= 1)){
            current_particle.velo = veloVec3AfterCollision;
            current_particle.pos = posVec3AfterCollision;
        }
    }
}

function projectedPlanePoint(particle, plane){
	var u = plane.u.clone(),
		v = plane.v.clone(),
		uLengthSq = u.lengthSq(),
		vLengthSq = v.lengthSq(),
		uDotV = u.dot(v),
		particlePositionMinusP = particle.pos.clone().sub(plane.p),
		s,
		t;
	s = (1/((uLengthSq)*(vLengthSq)-Math.pow(uDotV,2)))*(u.multiplyScalar(vLengthSq).sub(v.multiplyScalar(uDotV))).dot(particlePositionMinusP);
	t = (1/((uLengthSq)*(vLengthSq)-Math.pow(uDotV,2)))*(u.multiplyScalar(-uDotV).add(v.multiplyScalar(uLengthSq))).dot(particlePositionMinusP);
	return plane.planeEquation(s,t);
}

var kDamping = 100;
var kSpring = 500;
var springLength = 0.05;

function calcForce_spring(num, particles_array){
	var centerPrev;
	var centerNext;
	if (num > 0){
		centerPrev = particles_array[num-1];
		// console.log(centerPrev);
	}else{
		centerPrev = particles_array[0];
	}
	if (num < particles_array.length-1){
		centerNext = particles_array[num+1];
	}else{
		centerNext = particles_array[num];
	}
	var gravity = Forces3.constantGravity(particles_array[num].m, g);
	// if(particles_array[num].velo.length() < 0 ){
	// 	console.log(particles_array[num]);
	// }
	var velo = particles_array[num].velo.clone().multiplyScalar(2).sub(centerPrev.velo).sub(centerNext.velo);
	var damping = Forces3.damping(kDamping, velo);

	prev_center = particles_array[num].pos.clone().sub(centerPrev.pos);
	var next_center = particles_array[num].pos.clone().sub(centerNext.pos);
	restoringPrev = prev_center.clone().normalize().multiplyScalar( -kSpring * ( prev_center.length() - springLength ) );
	var restoringNext = next_center.clone().normalize().multiplyScalar( -kSpring * ( next_center.length() - springLength ) );
	// console.log(restoringNext.x + "," + restoringNext.y + ","+restoringNext.z);

	// var displPrev = particles_array[num].pos.clone().sub(centerPrev);
	// var displNext = particles_array[num].pos.clone().sub(centerNext);
	// var extensionPrev = displPrev.clone().sub(displPrev.clone().normalize().multiplyScalar(springLength));
	// var extensionNext = displNext.clone().sub(displNext.clone().normalize().multiplyScalar(springLength));
	// var restoringPrev = Forces3.spring(kSpring,extensionPrev);
	// var restoringNext = Forces3.spring(kSpring,extensionNext);

	force = Forces3.add([gravity, damping, restoringPrev, restoringNext]);
	// force = Forces3.add([gravity]);
	// force = Forces3.add([gravity, restoringPrev, restoringNext]);
	// console.log(force);
}
// function updateAccel(mass){
// 	acc = force.multiply(1/mass);
// }
// function updateVelo(obj){
// 	obj.velo2D = obj.velo2D.addScaled(acc,dt);
// }

function jacobianVeloMultiplication(particles_array){
    var result=[],
        pre, current;
    for(var i=0; i<particles_array.length; i++){
        if( i == particles_array.length-1 ){
            result.push(pre.multiplyScalar(-1));
        }else{
            if(i == 0){
                pre = implicitGV(particles_array[i],particles_array[i+1]);
                result.push(pre);
            }else{
                current = implicitGV(particles_array[i],particles_array[i+1]);
                result.push( current.clone().sub(pre) );
                pre = current;
            }
        }
    }
    return result;
}

function getB(particles_array){
    var result=[],
        pre, current;
    for(var i=0; i<particles_array.length; i++){
        if( i == particles_array.length-1 ){
            /* Last One */
            result.push(pre.multiplyScalar(-1));
        }else{
            var sForce = springForce(particles_array[i],particles_array[i+1]).multiplyScalar( dt / p.m ).clone();
            var gv = implicitGV(particles_array[i],particles_array[i+1]).multiplyScalar( dt * dt / p.m ).clone();
            if(i == 0){
                /* First one */
                pre = sForce.add(gv);
                result.push(pre);
            }else{
                current = sForce.add(gv);
                result.push( current.clone().sub(pre) );
                pre = current;
            }
        }
    }
    return result;
}

function implicitGV(p, pNext){
    var d = pNext.pos.clone().sub(p.pos);
    var l = d.length();
    var a = ( kSpring * ( springLength - l ) ) / l;
    var veloDiffer = p.velo.clone().sub(pNext.velo);
    var gv = veloDiffer.clone().multiplyScalar(a).sub(d.clone().multiplyScalar( d.dot( veloDiffer ) * ( kSpring / ( l*l ))));
    return gv;
}
function springForce(p, pNext){
    var d = pNext.pos.clone().sub(p.pos);
    var l = d.length();
    var a = ( kSpring * ( l - springLength ) ) / l;
    var gi = pNext.pos.clone().sub(p.pos).multiplyScalar(a);
    return gi;
}
/*
 function implicitGV(num, particles_array){
 var nextParticle;
 if (num < particles_array.length-1){
 nextParticle = particles_array[num+1];
 }else{
 nextParticle = particles_array[num];
 }
 var d = nextParticle.pos.clone().sub(particles_array[num].pos);
 var l = d.length();
 var a = ( kSpring * ( springLength - l ) ) / l;
 var gv = particles_array[num].velo.clone().multiplyScalar(a).sub(d.clone().multiplyScalar( d.dot(particles_array[num].velo) * ( kSpring / l )));

 return gv;
 }
 */
function EulerSemiImplicit(num, particle_array){
    var obj = particle_array[num];
    acc = getAcc( num, particle_array );
    obj.velo.add( acc.multiplyScalar(dt) );
    obj.pos.add( obj.velo.clone().multiplyScalar(dt) );
}
function EulerSemiImplicit2(num, particle_array){
    var obj = particle_array[num];
    obj.pos.add( obj.velo.clone().multiplyScalar(dt) );
    acc = getAcc( num, particle_array );
    obj.velo.add( acc.clone().multiplyScalar(dt) );
}

function EulerExplicit(num, particle_array){
	// acc = getAcc(obj.pos.clone(),obj.velo.clone());
	var obj = particle_array[num];
	acc = getAcc(num, particle_array);
	obj.pos=obj.pos.add(obj.velo.clone().multiplyScalar(dt));
	obj.velo=obj.velo.add(acc.clone().multiplyScalar(dt));
}
function getAcc(num, particle_array){
	var obj = particle_array[num];
	calcForce_spring(num, particle_array);
	// calcForce(num, particle_array);
	return force.multiplyScalar(1/obj.m);
}

function calcForce(num, particle_array){
	var obj = particle_array[num];
	var gravity = Forces3.constantGravity(obj.m,g);
	console.log(obj);
	// var drag = Forces3D.linearDrag(k,vel);
	// force = Forces3D.add([gravity, drag]);
	force = Forces3.add([gravity]);
	// console.log(force);
}
