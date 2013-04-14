  function makeVertLines(scene, vertsA, vertsB, indA, indB){
    
    if (indA.length != indB.length){
    	throw ("makeVertLines error: inequal indices lengths")
    }
    
    if (vertsA.length != vertsB.length){
    	//throw ("makeVertLines error: inequal vertices lengths")
    }
    
    var material = new THREE.LineBasicMaterial({
        color: 0x0000ff,
    });   	

	
	for (var i=0;i<indA.length;i++){
		var geometry = new THREE.Geometry();
	    geometry.vertices.push(vertsA[indA[i]]);
	    geometry.vertices.push(vertsB[indB[i]]);
	    
	    var line = new THREE.Line(geometry, material);
	    scene.add(line);
	}

   }