var debugBuild = true;
var score = 0;

var shootVelo = 55;
var camera, scene, renderer;
var geometry;
var controls;
var player, player2;
var shootVelo = 8.5;
var objects = [];
var enemies= [];
var dt = 1/60;
var bulletsShot = 0;
var playerBox1;
var direction;

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

	
	
var ballMaterial = new THREE.MeshPhongMaterial({
	wireframe: true,
	color: 0xff0000
});
var ballGeometry = new THREE.SphereGeometry(1, 8, 6);
var shootDirection = new THREE.Vector3();
var projector = new THREE.Projector();
var balls = [];
var ballMeshes = [];
this.onload = function () {
var healthbar = document.getElementById('progress-bar');

    // http://www.html5rocks.com/en/tutorials/pointerlock/intro/

    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

    if (havePointerLock) {
		console.log("HERE");
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
            //element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

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
                //element.requestPointerLock();
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

        //controls = new THREE.PointerLockControls(camera);
		controls = new THREE.FirstPersonControls(camera);
		controls.movementSpeed = 25.0;
		controls.lookSpeed = 10.0;
		controls.autoForward = false;

        player = controls.getObject();;
        player.position.y = 10;
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

		// set up the cube that the collision box will rest on
		var cubeGeometry = new THREE.CubeGeometry( 1.0, 1.0, 1.0, 10, 10, 10 );
		var cubeMaterial = new THREE.MeshBasicMaterial( {color: 0x8888ff} );
		playerBox1 = new THREE.Mesh(cubeGeometry,cubeMaterial);
		playerBox1.receiveShadow = false;
		playerBox1.castShadow = false;
		playerBox1.position = camera.position;
		direction = new THREE.Vector3(0, 0, 0);
    }



    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function update()
    {
        //if (inputManager.controlsEnabled)
		if (true)
        {
			
			// update the player on the network
			networkManager.update(controls);
			
			// update the player's and collision box's rotation to the camera's rotation
			player.rotation = controls.object.rotation;
			playerBox1.rotation = controls.object.rotation;
			
			// update the collision box's rotation and position to the player's rotation and position
			playerBox1.rotation.x = player.rotation.x;
			playerBox1.rotation.y = player.rotation.y;
			playerBox1.rotation.z = player.rotation.z;
			
			playerBox1.position.x = player.position.x;
			playerBox1.position.y = player.position.y;
			playerBox1.position.z = player.position.z;
			
			// detect collsions, move bullets, bullet collision and move enemies functions
			collisionDetect();
            moveProjectiles();
            bulletsHandle();
            enemyManager.moveEnemies(enemies, player);
			
        }
    }
	
	
	function collisionDetect()
	{
		///////////////////////////////////////////////////////////////////////////////////////////////////
		// collision detection and prevention
		// coded by Zach Whitman 
		var oldrotation = playerBox1.rotation;
		var tempPersonG = new THREE.CubeGeometry( 1.0, 1.0, 1.0, 10, 10, 10 );
		var tempPerson = new THREE.Mesh(tempPersonG);
		tempPerson.position.set(playerBox1.position.x, playerBox1.position.y, playerBox1.position.z);
		tempPerson.rotation.set(oldrotation.x, oldrotation.y, oldrotation.z);
		
		var collided = false;
		var typeHit = 0;
		// move the cube up,left,down,right
		if ( controls.moveRight )
		{
			tempPerson.translateX( controls.movementSpeed);
			typeHit = 1;
		}
		else if ( controls.moveLeft )
		{
			tempPerson.translateX( -controls.movementSpeed);
			typeHit = 2;
		}
		else if ( controls.moveBackward )
		{
			tempPerson.translateZ( controls.movementSpeed);
			typeHit = 3;
		}
		else if ( controls.moveForward )
		{
			tempPerson.translateZ( -controls.movementSpeed);
			typeHit = 4;
		}
		
		
		var originPoint = tempPerson.position.clone();
		// check for collisions
		for (var vertexIndex = 0; vertexIndex < tempPerson.geometry.vertices.length; vertexIndex++)
		{		
			var localVertex = tempPerson.geometry.vertices[vertexIndex].clone();
			var globalVertex = localVertex.applyMatrix4( tempPerson.matrix );
			var directionVector = globalVertex.sub( tempPerson.position );
			
			
			var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
			var collisionResults = ray.intersectObjects( objects );
			if ( collisionResults.length > 0 && collisionResults[0].distance < 2 ) 
			{
			// There was a collision so you must undo the movement
				if(typeHit == 1)
				{
					tempPerson.translateX( -controls.movementSpeed - 1.0);
					collided = true;
				}
				else if(this.typeHit == 2)
				{
					tempPerson.translateX( controls.movementSpeed + 1.0);
					collided = true;
				}
				else if(typeHit == 3)
				{
					tempPerson.translateZ( -controls.movementSpeed - 1.0);
					collided = true;
				}
				else if(typeHit == 4)
				{
					tempPerson.translateZ( controls.movementSpeed + 1.0);
					collided = true;
				}
				this.typeHit = 0;
			} // end collision hit
			
		} // end check for collision loop
		
		if(collided == false)
		{
            player.position.y = 10;
			controls.update(dt, player);
            player.position.y = 10;
		} else 
		{
            player.position.y = 10;
			console.log("collision");
		}
		///////// end collision detection //////////////////////////////////////////////////////////////////////////////////////////
		
	}
	
	
	// collision
	function checkCollisions() {
		var caster = new THREE.Raycaster();
		
		var rays = [
			new THREE.Vector3(0,0,-1),
			new THREE.Vector3(0,0,1),
			new THREE.Vector3(1,0,0),
			new THREE.Vector3(-1,0,0)
		
		];
		
		var collisions;
		var distance = 0;
		
		// array of collidables
		var objectArray = [];		
		for(var i=0; i < objects.length; i++) {
			objectArray.push(objects[i].cube);
		}
		
		
		
		// for each ray
		for (var i = 0; i < rays.length; i++) {
		  // We reset the raycaster to this direction
		  caster.set(playerBox1.position, rays[i]);
		  // Test if we intersect with any obstacle mesh
		  collisions = caster.intersectObjects(objectArray);
		  // And disable that direction if we do
		  if (collisions.length > 0 && collisions[0].distance < distance) {
			  if ((i == 0 || i == 1) && direction.z == 1) {
				direction.setZ(0);
			  } // end inner if
		  } // end outer if
		  
		} //end for loop
		
	} // end function
	
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
		direction = direction.applyMatrix4(matrix);
		
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
		direction2 = direction2.applyMatrix4( matrix2 );
		
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
		direction3 = direction3.applyMatrix4( matrix3 );
		
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
		direction4 = direction4.applyMatrix4( matrix4 );
		
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
			
			
			
            if (balls1[i].position.distanceTo(player.position) > 500 || balls1[i].position.y <= 1.5) //balls[i].radius)
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
		vector.unproject(camera);
        var ray = new THREE.Ray(player.position, vector.sub(player.position).normalize());
        targetVec.copy(ray.direction);
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
			var shootDirection = new THREE.Vector3();
			getShootDir(shootDirection);
            networkManager.spawnBullet(player.position, shootDirection);
			networkManager.sendBullet(player.position,shootDirection);
        }
    });
}

/*

		<script src="libraries/three.min.js"></script>
		<script src="libraries/PreBuilt/controls/FirstPersonControls.js"></script>
		<script src="inputmanager.js"></script>
		<script src="worldmanager.js"></script>
		<script src="enemymanager.js"></script>
		<script src="networkmanager.js"></script>
		<div id="blocker">
			<div id="instructions">
				<span style="font-size:40px">Click to play</span>
				<br />
				(W, A, S, D = Move, SPACE = Jump, MOUSE = Look around)
			</div>
		</div>
		<div id="health">
			<div id="percent">Health: <span id="p"></span></div>
			<progress id="progress-bar" value="100" max="100"></progress>
		</div>
		<script src="fpsexample.js"></script>


*/