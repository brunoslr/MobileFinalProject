var debugBuild = true;
var shootVelo = 55;

this.onload = function () {
    var camera, scene, renderer;
    var geometry, material, mesh;
    var controls;
    var playerRigidbody;

    //Cannnon needs the following
    var world, physicsMaterial, physicsObjects = [], sphereBody, sphereShape;

    var objects = [];

    var inputManager = new InputManager();
    var raycaster;

    var blocker = document.getElementById('blocker');
    var instructions = document.getElementById('instructions');

    // http://www.html5rocks.com/en/tutorials/pointerlock/intro/

    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

    if (havePointerLock) {
        var element = document.body;
        var pointerlockchange = function (event) {
            if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
                inputManager.controlsEnabled = true;
                console.log(inputManager.controlsEnabled);
                controls.enabled = true;
                blocker.style.display = 'none';

            } else {
                //controls.enabled = false;
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
    initCannon();
    init();
    update();
    draw();

    var prevTime = performance.now();
    var velocity = new THREE.Vector3();

    function init() {
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

        scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0xffffff, 0, 750);

        var light = new THREE.AmbientLight(0xeeeeff);
        light.position.set(0.5, 1, 0.75);
        light.castShadow = true;
        light.shadowCameraNear = 20;
        light.shadowCameraFar = 50;//camera.far;
        light.shadowCameraFov = 40;
        light.shadowMapBias = 0.1;
        light.shadowMapDarkness = 0.7;
        light.shadowMapWidth = 2 * 512;
        light.shadowMapHeight = 2 * 512;

        scene.add(light);

        controls = new THREE.PointerLockControls(camera);
        scene.add(controls.getObject());

        raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);

        geometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
        geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

        for (var i = 0, l = geometry.vertices.length; i < l; i++) {
            var vertex = geometry.vertices[i];
            vertex.x += Math.random() * 20 - 10;
            vertex.y += Math.random() * 2;
            vertex.z += Math.random() * 20 - 10;
        }

        for (var i = 0, l = geometry.faces.length; i < l; i++) {
            var face = geometry.faces[i];
            face.vertexColors[0] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
            face.vertexColors[1] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
            face.vertexColors[2] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
        }

        material = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors });

        mesh = new THREE.Mesh(geometry, material);
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        scene.add(mesh);

        // objects

        geometry = new THREE.BoxGeometry(20, 20, 20);

        for (var i = 0, l = geometry.faces.length; i < l; i++) {

            var face = geometry.faces[i];
            face.vertexColors[0] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
            face.vertexColors[1] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
            face.vertexColors[2] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);

        }


        var halfExtents = new CANNON.Vec3(1, 1, 1);
        var boxShape = new CANNON.Box(halfExtents);
        for (var i = 0; i < 50; i++) {
            // TODO: Change material, for performance
            material = new THREE.MeshPhongMaterial({ specular: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors });
            var mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = Math.floor(Math.random() * 20 - 10) * 20;
            mesh.position.y = Math.floor(Math.random() * 20) * 20 + 10;
            mesh.position.z = Math.floor(Math.random() * 20 - 10) * 20;
            scene.add(mesh);
            material.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
            objects.push(mesh);
            var boxBody = new CANNON.Body({ mass: 5 });
            boxBody.addShape(boxShape);
            world.add(boxBody);
            physicsObjects.push(boxBody);
        }

        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0xffffff);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        window.addEventListener('resize', onWindowResize, false);

    }


    function initCannon() {
        world = new CANNON.World();
        world.quatNormalizeSkip = 0;
        world.quatNormalizeFast = false;

        var solver = new CANNON.GSSolver();
        world.defaultContactMaterial.contactEquationStiffness = 1e9;
        world.defaultContactMaterial.contactEquationRelaxation = 4;

        solver.iteration = 5;
        solver.tolerance = 0.1;
        var split = true;

        if (split) {
            world.solver = new CANNON.SplitSolver(solver);
        }
        else {
            world.solver = solver;
        }

        world.gravity.set(0, -20, 0);
        world.broadphase = new CANNON.NaiveBroadphase();

        physicsMaterial = new CANNON.Material("slipperyMaterial");
        var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
                                                                physicsMaterial,
                                                                0.0,
                                                                0.3);
        world.addContactMaterial(physicsContactMaterial);

        var mass = 5, radius = 1.3;
        sphereShape = new CANNON.Sphere(radius);
        sphereBody = new CANNON.Body({ mass: mass });
        sphereBody.addShape(sphereShape);
        sphereBody.position.set(0, 5, 0);
        sphereBody.linearDamping = 0.9;
        world.add(sphereBody);
        // Create a plane
        var groundShape = new CANNON.Plane();
        var groundBody = new CANNON.Body({ mass: 0 });
        groundBody.addShape(groundShape);
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        world.add(groundBody);
    }


    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function update() {
        if (inputManager.controlsEnabled) {
            raycaster.ray.origin.copy(controls.getObject().position);
            raycaster.ray.origin.y -= 10;

            var intersections = raycaster.intersectObjects(objects);

            var isOnObject = intersections.length > 0;

            var time = performance.now();
            var delta = (time - prevTime) / 1000;

            world.step(1 / 6);
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

            if (isOnObject === true) {
                velocity.y = Math.max(0, velocity.y);
                inputManager.canJump = true;
            }

            controls.getObject().translateX(velocity.x * delta);
            controls.getObject().translateY(velocity.y * delta);
            controls.getObject().translateZ(velocity.z * delta);

            if (controls.getObject().position.y < 10) {
                velocity.y = 0;
                controls.getObject().position.y = 10;
                inputManager.canJump = true;
            }

            for (var i = 0; i < balls.length; i++) {
                ballMeshes[i].position.copy(balls[i].position);
                ballMeshes[i].quaternion.copy(balls[i].quaternion);
            }

            for (var i = 0; i < objects.length; i++) {
                objects[i].position = physicsObjects[i].position;
                objects[i].quaternion = physicsObjects[i].quaternion;
                console.log(objects[i].position);
            }

            prevTime = time;
        }
    }

    function draw() {
        update();
        requestAnimationFrame(draw);
        renderer.render(scene, camera);
    }


    var ballShape = new CANNON.Sphere(2);
    var ballMaterial = new THREE.MeshPhongMaterial({
        wireframe: true,
        color: 0xff0000
    });
    var ballGeometry = new THREE.SphereGeometry(ballShape.radius, 32, 32);
    var shootDirection = new THREE.Vector3();
    var projector = new THREE.Projector();
    var balls = [];
    var ballMeshes = [];
    function getShootDir(targetVec) {
        var vector = targetVec;
        targetVec.set(0, 0, 1);
        projector.unprojectVector(vector, camera);
        var ray = new THREE.Ray(sphereBody.position, vector.sub(sphereBody.position).normalize());
        targetVec.copy(ray.direction);
    }
    window.addEventListener("click", function (e) {
        //if (controls.enabled == true) 
        {
            var x = controls.getObject().position.x;
            var y = controls.getObject().position.y;
            var z = controls.getObject().position.z;
            var ballBody = new CANNON.Body({ mass: 1 });
            ballBody.addShape(ballShape);
            var ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
            world.add(ballBody);
            scene.add(ballMesh);
            ballMesh.castShadow = true;
            ballMesh.receiveShadow = true;
            balls.push(ballBody);
            ballMeshes.push(ballMesh);
            getShootDir(shootDirection);
            ballBody.velocity.set(shootDirection.x * shootVelo,
                                    shootDirection.y * shootVelo,
                                    shootDirection.z * shootVelo);
            // Move the ball outside the player sphere
            x += shootDirection.x * (sphereShape.radius * 1.02 + ballShape.radius);
            y += shootDirection.y * (sphereShape.radius * 1.02 + ballShape.radius);
            z += shootDirection.z * (sphereShape.radius * 1.02 + ballShape.radius);
            ballBody.position.set(x, y, z);
            ballMesh.position.set(x, y, z);
        }
    });
}