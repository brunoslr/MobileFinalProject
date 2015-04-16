ObjectEnum = {
    Cube : 0,
    Sphere : 1,
    Cylinder : 2
}



Transform = function () {
    var position, rotation, scale;    
}

function TransformInit(position, rotation, scale)
{
    var t = new namespace.Transform();
    t.position = position;
    t.rotation = rotation;
    t.scale = scale;
    return t;
}

GameObject = function () {
    var mesh, geometry, material, transform;
    var GameObject = this;
    init = function (ObjectEnumType, materialShader, transformVector3) {
        if (ObjectEnumType == 0)
        {
            geometry = new THREE.BoxGeometry(transformVector3.scale);
        }
        transform = transformVector3;
        material = materialShader;
        mesh = new THREE.Mesh(geometry, material);
        return GameObject;
    }
}