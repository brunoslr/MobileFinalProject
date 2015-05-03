function WorldManager(){
}

WorldManager.prototype.getFloor= function(){
		var geometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
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
		return mesh;
};

function checkEnemyCollision(v,i)
{
		if(enemies[i].position.distanceTo(v.position) < 10)
		{
			scene.remove(enemies[i]);
			enemies.splice(i,1);
			console.log(enemies.length);
		}
}

//function to move enemies towards the player
WorldManager.prototype.moveEnemies=function()
{
	for(var i=0;i<enemies.length;i++)
	{
		if(enemies[i].position.distanceTo(controls.getObject().position) < 100)
		{
			enemies[i].translateOnAxis(enemies[i].worldToLocal(new THREE.Vector3(controls.getObject().position.x,controls.getObject().position.y,controls.getObject().position.z)),.008);
		}
		checkEnemyCollision(controls.getObject(),i);

	}
}

//function to instantiate enemies
WorldManager.prototype.addEnemies=function()
{
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
}
	

WorldManager.prototype.addBoxes= function(){
	var geometry = new THREE.BoxGeometry( 20, 20, 20 );
	for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {

		var face = geometry.faces[ i ];
		face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

	}

	for ( var i = 0; i < 500; i ++ ) {

		var material = new THREE.MeshPhongMaterial( { specular: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );

		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
		mesh.position.y = Math.floor( Math.random() * 20 ) * 20 + 10;
		mesh.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;
		scene.add( mesh );

		material.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

		objects.push( mesh );
	}
}