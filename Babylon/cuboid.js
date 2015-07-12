function  CreateCuboid(name, length, width, height, scene, updatable) { //length x, width z, height y
        var cuboid = new BABYLON.Mesh(name, scene);

        var normalsSource = [
            new BABYLON.Vector3(0, 0, 1), //z
            new BABYLON.Vector3(0, 0, -1), //z
            new BABYLON.Vector3(1, 0, 0), //x
            new BABYLON.Vector3(-1, 0, 0), //x
            new BABYLON.Vector3(0, 1, 0), //y
            new BABYLON.Vector3(0, -1, 0) //y
        ];

        var indices = [];
        var positions = [];
        var normals = [];
        var uvs = [];

        // Create each face in turn.

        for (var index = 0; index < normalsSource.length; index++) {
            var normal = normalsSource[index];

            // Get two vectors perpendicular to the face normal and to each other.
            var side1 = new BABYLON.Vector3(normal.y, normal.z, normal.x);
            var side2 = BABYLON.Vector3.Cross(normal, side1);

            // Six indices (two triangles) per face.
            var verticesLength = positions.length / 3;
            indices.push(verticesLength);
            indices.push(verticesLength + 1);
            indices.push(verticesLength + 2);

            indices.push(verticesLength);
            indices.push(verticesLength + 2);
            indices.push(verticesLength + 3);

            // Four vertices per face.
            var vertex = normal.subtract(side1).subtract(side2);
            positions.push(vertex.x*length/2, vertex.y*height/2, vertex.z*width/2);
            normals.push(normal.x, normal.y, normal.z);
            uvs.push(1.0, 1.0);

            vertex = normal.subtract(side1).add(side2);
            positions.push(vertex.x*length/2, vertex.y*height/2, vertex.z*width/2);
            normals.push(normal.x, normal.y, normal.z);
            uvs.push(0.0, 1.0);

            vertex = normal.add(side1).add(side2);
            positions.push(vertex.x*length/2, vertex.y*height/2, vertex.z*width/2);
            normals.push(normal.x, normal.y, normal.z);
            uvs.push(0.0, 0.0);

            vertex = normal.add(side1).subtract(side2);
            positions.push(vertex.x*length/2, vertex.y*height/2, vertex.z*width/2);
            normals.push(normal.x, normal.y, normal.z);
            uvs.push(1.0, 0.0);        	
        }


        cuboid.setVerticesData(BABYLON.VertexBuffer.PositionKind, positions, updatable);
        cuboid.setVerticesData(BABYLON.VertexBuffer.NormalKind, normals, updatable);
        cuboid.setVerticesData(BABYLON.VertexBuffer.UVKind, uvs, updatable);
        cuboid.setIndices(indices);

        return cuboid;
       
    };