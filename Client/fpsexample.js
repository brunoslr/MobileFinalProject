var debugBuild = true;
//this.onload = function () {
var score = 0;

var shootVelo = 55;
var camera, scene, renderer;
var geometry;
var controls;
var player, player2;
var shootVelo = 8.5;
var objects = [];
var enemies= [];
var health = 100;

//3d model loading
var loader;

var inputManager = new InputManager();

var enemyManager = new EnemyManager();
var worldManager = new WorldManager();
var networkManager;
var raycaster;


var geometry = new THREE.SphereGeometry( 2, 8,6 );
var ballMaterial = new THREE.MeshPhongMaterial({
	wireframe: true,
	color: 0xff0000
});

var projector = new THREE.Projector();
var balls1 = [];
var fVectors = [];

var blocker = document.getElementById('blocker');
var instructions = document.getElementById('instructions');

	
	
    var ballShape = new CANNON.Sphere(2);
    var ballMaterial = new THREE.MeshPhongMaterial({
        wireframe: true,
        color: 0xff0000
    });
    var ballGeometry = new THREE.SphereGeometry(ballShape.radius, 8, 6);
    var shootDirection = new THREE.Vector3();
    var projector = new THREE.Projector();
    var balls = [];
    var ballMeshes = [];
this.onload = function () {
	var healthbar = document.getElementById('progress-bar');

    // http://www.html5rocks.com/en/tutorials/pointerlock/intro/

    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

    if (havePointerLock) {
        var element = document.body;
        var pointerlockchange = function (event) {
            if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
                inputManager.controlsEnabled = true;
                controls.enabled = true;
                blocker.style.display = 'none';

            }
            else {
                blocker.style.display = '-webkit-box';
                blocker.style.display = '-moz-box';
                blocker.style.display = 'box';
                instructions.style.display = '';
            }
        }

        var pointerlockerror = function (event) {
            // instructions.style.display = '';
        }

        // Hook pointer lock state change events
        document.addEventListener('pointerlockchange', pointerlockchange, false);
        document.addEventListener('mozpointerlockchange', pointerlockchange, false);
        document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

        document.addEventListener('pointerlockerror', pointerlockerror, false);
        document.addEventListener('mozpointerlockerror', pointerlockerror, false);
        document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

        instructions.addEventListener('click', function (event) {
            instructions.style.display = 'none';
            // Ask the browser to lock the pointer
            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

            if (/Firefox/i.test(navigator.userAgent)) {
                var fullscreenchange = function (event) {
                    if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {
                        document.removeEventListener('fullscreenchange', fullscreenchange);
                        document.removeEventListener('mozfullscreenchange', fullscreenchange);
                        element.requestPointerLock();
                    }
                }
                document.addEventListener('fullscreenchange', fullscreenchange, false);
                document.addEventListener('mozfullscreenchange', fullscreenchange, false);
                element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
                element.requestFullscreen();
            } else {
                element.requestPointerLock();
            }

        }, false);

    } else {
        //instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
    }
    init();
    update();
    draw();

    var prevTime = performance.now();
    var velocity = new THREE.Vector3();

    function init()
    {
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

        scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0xffffff, 0, 750);

        worldManager.addLight(scene);

        loader= new THREE.JSONLoader();

        controls = new THREE.PointerLockControls(camera);

        player = controls.getObject();;
        scene.add(player);
        player2 = controls.getObject();;
        scene.add(player2);
		networkManager = new NetworkManager();

        raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);
		
        loader = new THREE.JSONLoader();
        //init floor
        worldManager.initFloor(scene);

        // objects
        worldManager.addBoxes(scene, objects);

		//enemies
        enemyManager.initEnemies(scene, enemies, loader);

	var geometry = new THREE.BoxGeometry( 10, 20, 10 );
	for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {

		var face = geometry.faces[ i ];
		face.vertexColors[ 0 ] = new THREE.Color( 1,0,0 );
		face.vertexColors[ 1 ] = new THREE.Color( 1,0,0);
		face.vertexColors[ 2 ] = new THREE.Color( 1,0,0 );

	}

	for ( var i = 0; i < 0; i ++ ) {

		var material = new THREE.MeshPhongMaterial( { specular: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );

		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
		// mesh.position.y = Math.floor( Math.random() * 20 ) * 20 + 10;
		mesh.position.y=10;
		mesh.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;
		scene.add( mesh );

		material.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

		enemies.push( mesh );
	}
		
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0xffffff);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        window.addEventListener('resize', onWindowResize, false);  
    }



    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function update()
    {
        if (inputManager.controlsEnabled)
        {
			networkManager.update(controls);
            
			collisionDetectionAndMovement();
			
            if (player.position.y < 10) {
                velocity.y = 0;
                player.position.y = 10;
                inputManager.canJump = true;
            }
            raycaster.ray.origin.copy(player.position);	
            raycaster.ray.origin.y -= 10;

            moveProjectiles();
            bulletsHandle();

            enemyManager.moveEnemies(enemies, player);
        }
    }
	
	function collisionDetectionAndMovement()
	{
		
		// https://github.com/mrdoob/three.js/issues/1606
		// http://stackoverflow.com/questions/15696963/three-js-set-and-read-camera-look-vector
		
		
		// Set the player's velocity
		var time = performance.now();
		var delta = (time - prevTime) / 1000;
		velocity.x -= velocity.x * 10.0 * delta;
		velocity.z -= velocity.z * 10.0 * delta;
		velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
		
		// check if jumping
		if (inputManager.moveJump) {
			velocity.y += 350;
			inputManager.moveJump = false;
		}
		
		// check about if the player is moving 
		if (inputManager.moveForward) velocity.z -= 400.0 * delta;
		if (inputManager.moveBackward) velocity.z += 400.0 * delta;
		if (inputManager.moveLeft) velocity.x -= 400.0 * delta;
		if (inputManager.moveRight) velocity.x += 400.0 * delta;
		
		// move the player, preemptively
		player.translateX(velocity.x * delta);
		player.translateY(velocity.y * delta);
		player.translateZ(velocity.z * delta);
		
		// Create a new matrix and vector
		var matrix = new THREE.Matrix4();
		matrix.extractRotation( player2.matrix );
		var direction = new THREE.Vector3( 0, 0, -1 );  // Forward
		direction = matrix.multiplyVector3( direction );
		
		// raycast from the player's temp posistion in the direction they are facing
		var raycaster = new THREE.Raycaster(player2.position, direction);
		raycaster.intersectObjects(objects);
		var intersections = raycaster.intersectObjects(objects);
		var isColliding = false;
		for(var i = 0; i < intersections.length; i++)
		{
			if(intersections[i].distance <= 2 )
			{
				isColliding = true;
			}
		}
		
		
		// Create a new matrix and vector
		var matrix2 = new THREE.Matrix4();
		matrix2.extractRotation( player2.matrix );
		var direction2 = new THREE.Vector3( 0, 0, 1 ); // Backward
		direction2 = matrix2.multiplyVector3( direction2 );
		
		// raycast from the player's temp posistion in the direction they are facing
		var raycaster2 = new THREE.Raycaster(player2.position, direction2);
		raycaster2.intersectObjects(objects);
		var intersections2 = raycaster2.intersectObjects(objects);
		for(var i = 0; i < intersections2.length; i++)
		{
			if(intersections2[i].distance <= 2 )
			{
				isColliding = true;
			}
		}
		
		
		// Create a new matrix and vector
		var matrix3 = new THREE.Matrix4();
		matrix3.extractRotation( player2.matrix );
		var direction3 = new THREE.Vector3( 1, 0, 0 ); // Left?
		direction3 = matrix3.multiplyVector3( direction3 );
		
		// raycast from the player's temp posistion in the direction they are facing
		var raycaster3 = new THREE.Raycaster(player2.position, direction3);
		raycaster3.intersectObjects(objects);
		var intersections3 = raycaster3.intersectObjects(objects);
		for(var i = 0; i < intersections3.length; i++)
		{
			if(intersections3[i].distance <= 2 )
			{
				isColliding = true;
			}
		}
		
		
		// Create a new matrix and vector
		var matrix4 = new THREE.Matrix4();
		matrix4.extractRotation( player2.matrix );
		var direction4 = new THREE.Vector3( -1, 0, 0 ); // Right?
		direction4 = matrix3.multiplyVector3( direction4 );
		
		// raycast from the player's temp posistion in the direction they are facing
		var raycaster4 = new THREE.Raycaster(player2.position, direction4);
		raycaster4.intersectObjects(objects);
		var intersections4 = raycaster4.intersectObjects(objects);
		for(var i = 0; i < intersections4.length; i++)
		{
			if(intersections4[i].distance <= 2 )
			{
				isColliding = true;
			}
		}
		
		// if the player is colliding then move them back/prevent them
		if(isColliding == true)
		{
			player.translateX(-velocity.x * delta);
			player.translateY(velocity.y * delta);
			player.translateZ(-velocity.z * delta);
		}
		else
		{
			// do nothing
		}
		

		prevTime = time;
		
	}

    function bulletsHandle()
    {
        for (var i = 0; i < balls1.length; i++) {

            enemyManager.checkEnemyCollision(enemies, balls1[i], scene, score);

            if (balls1[i].position.distanceTo(player.position) > 10000 || balls1[i].position.y <= 1.5) //balls[i].radius)
            {
                scene.remove(balls1[i]);
                balls1.splice(i, 1);
                fVectors.splice(i,1);
            }
        }
		score = enemies.length;
		//ctx.fillText('Score: ' + score, canvas.width - 140, 30);
    }

    function draw() {
        update();
        requestAnimationFrame(draw);
        renderer.render(scene, camera);
    }
    
	function getShootDir(targetVec) {
        var vector = targetVec;
        targetVec.set(0, 0, 1);
        projector.unprojectVector(vector, camera);
        var ray = new THREE.Ray(player.position, vector.sub(player.position).normalize());
        targetVec.copy(ray.direction);
    }

    function drawSphere(position)
    {
        var sphere = new THREE.Mesh( geometry, ballMaterial );
        var shootDirection = new THREE.Vector3();
        sphere.position.set(position.x, position.y, position.z);
        balls1.push(sphere);
        getShootDir(shootDirection);
        fVectors.push(shootDirection);
        scene.add( sphere );
    }

    function moveProjectiles()
    {
        for(var i=0; i<balls1.length; i++) {
            balls1[i].position.set(balls1[i].position.x + fVectors[i].x * shootVelo,
                balls1[i].position.y + fVectors[i].y * shootVelo,
                balls1[i].position.z + fVectors[i].z * shootVelo);
        }
    }
	window.addEventListener("click", function (e) {

        {
            drawSphere(player.position);
            var x = controls.getObject().position.x;
            var y = controls.getObject().position.y;
            var z = controls.getObject().position.z;
            getShootDir(shootDirection);
			var bulletVelocity= new THREE.Vector3(shootDirection.x * shootVelo, shootDirection.y * shootVelo,shootDirection.z * shootVelo)
            // Move the ball outside the player sphere
            x += shootDirection.x * (sphereShape.radius * 1.02 + ballShape.radius);
            y += shootDirection.y * (sphereShape.radius * 1.02 + ballShape.radius);
            z += shootDirection.z * (sphereShape.radius * 1.02 + ballShape.radius);
			var bulletPosition= new THREE.Vector3(x,y,z);
			networkManager.spawnBullet(bulletPosition,bulletVelocity);
			networkManager.sendBullet(bulletPosition,bulletVelocity);
        }
    });
	function spawnBullet(positionVector, velocityVector){
		var ballBody = new CANNON.Body({ mass: 1 });
		ballBody.addShape(ballShape);
		var ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
		world.add(ballBody);
		scene.add(ballMesh);
		ballMesh.castShadow = true;
		ballMesh.receiveShadow = true;
		balls.push(ballBody);
		ballMeshes.push(ballMesh);
		ballBody.velocity.set(velocityVector.x,velocityVector.y,velocityVector.z);
		ballBody.position.set(positionVector.x, positionVector.y,positionVector.z);
		ballMesh.position.set(positionVector.x, positionVector.y,positionVector.z);
	}
	
	
	
}

