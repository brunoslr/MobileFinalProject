this.onload = function () {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    var t = TransformInit(new THREE.Vector3(10, 0, 0), new THREE.Vector3(10, 0, 0), new THREE.Vector3(1, 1, 1));

    var go = new GameObject(ObjectEnum.Cube, new THREE.MeshPhongMaterial({
        specular: '#a9fcff',
        color: '#00abb1',
        emissive: '#006063',
        shininess: 100
    }), t);
    scene.add(go.Mesh);

    camera.position.z = 5;

    
    console.log(t);
    var render = function () {
        requestAnimationFrame(render);
        cube.rotation.x += 0.1;
        cube.rotation.y += 0.1;
        renderer.render(scene, camera);
    };
    render();
}

