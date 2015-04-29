
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
        if(enemies[i].position.distanceTo(player.position) < 100)
        {
            enemies[i].translateOnAxis(enemies[i].worldToLocal(new THREE.Vector3(player.position.x,enemies[i].position.y,player.position.z)),.008);
        }
    }
}

EnemyManager.prototype.initEnemies=function(scene,enemies)
{

    var geometry = new THREE.BoxGeometry(10, 20, 10);
    for (var i = 0, l = geometry.faces.length; i < l; i++)
    {

        var face = geometry.faces[i];
        face.vertexColors[0] = new THREE.Color(1, 0, 0);
        face.vertexColors[1] = new THREE.Color(1, 0, 0);
        face.vertexColors[2] = new THREE.Color(1, 0, 0);

    }

    //for (var i = 0; i < 200; i++)
    for (var i = 0; i < 1; i++)
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
