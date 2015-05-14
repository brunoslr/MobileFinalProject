function WorldManager(){
}

WorldManager.prototype.addLight=function(scene)
{
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
}

WorldManager.prototype.initFloor= function(scene)
{
		var geometry = new THREE.PlaneGeometry( 500, 500, 100, 100 );
		geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

		for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {

			var vertex = geometry.vertices[ i ];
			vertex.x += Math.random() * 20 - 10;
			vertex.y += Math.random() * 2;
			vertex.z += Math.random() * 20 - 10;

		}

		for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {

			var face = geometry.faces[ i ];
			face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
			face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
			face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

		}

		var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

		var mesh = new THREE.Mesh( geometry, material );
		scene.add(mesh);
}

WorldManager.prototype.addBoxes= function(scene, objects)
{
	var geometry = new THREE.BoxGeometry( 20, 20, 20 );
	for ( var i = 0, l = geometry.faces.length; i < l; i ++ )
	{

		var face = geometry.faces[ i ];
		//face.vertexColors[ 0 ] = new THREE.Color( 0,1,1 );
		//face.vertexColors[ 1 ] = new THREE.Color( 0,1,1 );
		//face.vertexColors[ 2 ] = new THREE.Color( 0,1,1 );
		
		face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );


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
		objects.push(mesh);
		//enemies.push( mesh );
	}
}
	

/*WorldManager.prototype.addBoxes= function(){
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

	for ( var i = 0; i < 1000; i ++ )
	{

		var material = new THREE.MeshPhongMaterial( { specular: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );

		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
		mesh.position.y = Math.floor( Math.random() * 20 ) * 20 + 10;
		mesh.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;
		scene.add( mesh );

		material.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

		objects.push( mesh );
	}
} */