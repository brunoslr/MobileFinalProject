var debugBuild = true;
this.onload = function () {
    var camera, scene, renderer;
    var geometry;
    var controls;
    var player;
    var shootVelo =8.5;
    var objects = [];
    var enemies= [];

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

        controls = new THREE.PointerLockControls(camera);

        player = controls.getObject();;
        scene.add(player);
		networkManager = new NetworkManager();

        //raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);
		

        //init floor
        worldManager.initFloor(scene);

        // objects
        worldManager.addBoxes(scene, objects);

		//enemies
        enemyManager.initEnemies(scene, enemies );

        //renderer
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
            
			/*
			// check down hits
			raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);
			raycaster.ray.origin.copy(player.position);	
            raycaster.ray.origin.y -= 10;
            var intersections = raycaster.intersectObjects(objects);
            var isOnObject = intersections.length > 0;
			
			// check up up
			raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), 0, 10);
			raycaster.ray.origin.copy(player.position);	
            raycaster.ray.origin.y += 10;
            intersections = raycaster.intersectObjects(objects);
            var isUnderObject = intersections.length > 0;
			
			// check forward hits
			raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(1, 0, 0), 0, 10);
			raycaster.ray.origin.copy(player.position);	
            raycaster.ray.origin.x += 10;
            intersections = raycaster.intersectObjects(objects);
            var isFrontObject = intersections.length > 0;
			
			// check behind hits
			raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(-1, 0, 0), 0, 10);
			raycaster.ray.origin.copy(player.position);	
            raycaster.ray.origin.x -= 10;
            intersections = raycaster.intersectObjects(objects);
            var isBackObject = intersections.length > 0;
			
			// check left hits
			raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 0, 1), 0, 10);
			raycaster.ray.origin.copy(player.position);	
            raycaster.ray.origin.z -= 10;
            intersections = raycaster.intersectObjects(objects);
            var isLeftObject = intersections.length > 0;
			
			// check right hits
			raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 0, -1), 0, 10);
			raycaster.ray.origin.copy(player.position);	
            raycaster.ray.origin.z -= 10;
            intersections = raycaster.intersectObjects(objects);
            var isRightObject = intersections.length > 0;
			*/
			
			var vector = new THREE.Vector3();
			projector.unprojectVector(vector, camera);
			var raycaster = new THREE.Raycaster(player.position, vector.sub(player.position).normalize());
			raycaster.intersectObjects(objects);
            var intersections = raycaster.intersectObjects(objects);
			var isColliding = false;
			for(var i = 0; i < intersections.length; i++)
			{
				//console.log(intersections[i].distance);
					if(intersections[i].distance <= 10)
						isColliding = true;
			}
			//if(intersections.length > 0)
			//	isColliding = true;
			
			/*
			    var intersections = raycaster.intersectObjects(objects);
			var isColliding = false;
			for(var i = 0; i < intersections.length; i++)
			{
				console.log(i);
					if(intersections[i].distance <= 5)
						isColliding = true;
			}
			
			//if(intersections.length > 0)
			//	isColliding = true;
			*/

            var time = performance.now();
            var delta = (time - prevTime) / 1000;

            velocity.x -= velocity.x * 10.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;

            velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
            if (inputManager.moveJump) {
                velocity.y += 350;
                inputManager.moveJump = false;
            }

            if (inputManager.moveForward) velocity.z -= 400.0 * delta;
            if (inputManager.moveBackward) velocity.z += 400.0 * delta;

            if (inputManager.moveLeft) velocity.x -= 400.0 * delta;
            if (inputManager.moveRight) velocity.x += 400.0 * delta;

			/*
            if (isOnObject === true) {
                velocity.y = Math.max(0, velocity.y);
                inputManager.canJump = true;
            }
			if(isUnderObject === true)
			{
                velocity.y = 0;
				console.log("under");
			}
			if(isFrontObject === true)
			{
				console.log("FRONT");
			}
			if(isBackObject === true)
			{
				console.log("Back");
			}
			if(isRightObject === true)
			{
				console.log("Right");
			}
			if(isLeftObject === true)
			{
				console.log("left");
			}
			*/
			
			if(isColliding == true)
			{
				player.translateX(velocity.x * delta * -1);
				player.translateY(velocity.y * delta);
				player.translateZ(velocity.z * delta * -1);
				//player.translateX(velocity.x + .2 * delta * -1);
				//player.translateY(velocity.y* delta);
				//player.translateZ(velocity.z + .2 * delta * -1);
			}
			else
			{
				player.translateX(velocity.x * delta);
				player.translateY(velocity.y * delta);
				player.translateZ(velocity.z * delta);
			}
			

            //player.translateX(velocity.x * delta);
            //player.translateY(velocity.y * delta);
            //player.translateZ(velocity.z * delta);
			
			
            if (player.position.y < 10) {
                velocity.y = 0;
                player.position.y = 10;
                inputManager.canJump = true;
            }
			
			
			
			// Zach's collision detection
			/*
			var tempPerson = player.clone();
			var originPoint = tempPerson.position.clone();
			for (var vertexIndex = 0; vertexIndex < tempPerson.geometry.vertices.length; vertexIndex++)
			{		
				var localVertex = tempPerson.geometry.vertices[vertexIndex].clone();
				var globalVertex = localVertex.applyMatrix4( tempPerson.matrix );
				var directionVector = globalVertex.sub( tempPerson.position );
				
				var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
				var collisionResults = ray.intersectObjects( this.collidableMeshList );
				
				if ( collisionResults.length > 0 && collisionResults[0].distance < 2 ) 
				{
					
				}
			}
			*/
			///////////////////////////////////////////////////////////////////

            prevTime = time;
            moveProjectiles();
            bulletsHandle();

            enemyManager.moveEnemies(enemies, player);
        }
    }

    function bulletsHandle()
    {
        for (var i = 0; i < balls1.length; i++) {

            enemyManager.checkEnemyCollision(enemies, balls1[i], scene);

            if (balls1[i].position.distanceTo(player.position) > 1000 || balls1[i].position.y <= 1.5) //balls[i].radius)
            {
                scene.remove(balls1[i]);
                balls1.splice(i, 1);
                fVectors.splice(i,1);
            }
        }
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
            drawSphere(player.position);
    });
}