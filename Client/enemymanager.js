
//enemies
//adding red cubes as enemies
//worldManager.addEnemies();

function EnemyManager(){
}


EnemyManager.prototype.checkEnemyCollision=function(enemies, projectile, scene)
{
    for(var i=0;i<enemies.length;i++) {

        if (enemies[i].position.distanceTo(projectile.position) < 10) {
            scene.remove(enemies[i]);
            enemies.splice(i, 1);
        }
    }
}

//function to move enemies towards the player
EnemyManager.prototype.moveEnemies=function(enemies, player)
{
    for(var i=0;i<enemies.length;i++)
    {
        if(enemies[i].position.distanceTo(player.position) < 100 )
        {
            enemies[i].lookAt(player.position);
            if(enemies[i].position.distanceTo(player.position) > 10)
                enemies[i].translateOnAxis(enemies[i].worldToLocal(new THREE.Vector3(player.position.x,enemies[i].position.y,player.position.z)),.001);
        }
    }
}

EnemyManager.prototype.initEnemies=function(scene, enemies, loader)
{

    var geometry = new THREE.BoxGeometry(10, 20, 10);
    for (var i = 0, l = geometry.faces.length; i < l; i++)
    {

        var face = geometry.faces[i];
        // face.vertexcolors[0] = new THREE.Color(1, 0, 0);
        // face.vertexcolors[1] = new THREE.Color(1, 0, 0);
        // face.vertexcolors[2] = new THREE.Color(1, 0, 0);
    }

    

    //for (var i = 0; i < 200; i++)
    // for (var i = 0; i < 1; i++)
    // {
        // var mesh;
        // loader.load('Models/IronMan.js', function (geometry, materials) {
        // var material = new THREE.MeshNormalMaterial({
           
            // colorAmbient: [0.480000026226044, 0.480000026226044, 0.480000026226044],
            // colorDiffuse: [0.480000026226044, 0.480000026226044, 0.480000026226044],
            // colorSpecular: [0.8999999761581421, 0.8999999761581421, 0.8999999761581421]
        // });

        // mesh = new THREE.Mesh(
                // geometry,
                // material
        // );

        // mesh.receiveShadow = true;
        // mesh.castShadow = true;
        // mesh.position.x = Math.floor(Math.random() * 20 - 10) * 20;
        // mesh.position.y = 10;
        // mesh.position.z = Math.floor(Math.random() * 20 - 10) * 20;
        // mesh.scale.set(0.05,0.05,0.05);
        // scene.add(mesh);
        // enemies.push(mesh);
        // });
    // }

    for (var i = 0; i < 0; i++)
    {

        var material = new THREE.MeshPhongMaterial({
            specular: 0xffffff,
            shading: THREE.FlatShading,
            vertexColors: THREE.VertexColors
        });

        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = Math.floor(Math.random() * 20 - 10) * 20;
        // mesh.position.y = Math.floor( Math.random() * 20 ) * 20 + 10;
        mesh.position.y = 10;
        mesh.position.z = Math.floor(Math.random() * 20 - 10) * 20;
        scene.add(mesh);

        material.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);

       enemies.push(mesh);
    }


}
