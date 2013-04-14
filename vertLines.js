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
   

function vertMaster(scene, vertsA, vertsB){
	makeVertLines(scene, vertsA, 
	  vertsB, 
	  [26,24,22,20,18,16,14,12,10,8,6,4,1,0],
	  [402,414,413,412,411,410,409,408,407,406,405,404,1,3]);
	  
	  
	makeVertLines(scene, vertsA, 
	  vertsB, 
	  	  
	  [27,  25,	23,	21,	19,	17,	15,	13,	11,	9,	7,	5,	2,	3],
[29,  27,	25,	23,	21,	19,	17,	15,	13,	11,	9,	7,	2,	4]);

}


vertMapA = [ 
	  [26,24,22,20,18,16,14,12,10,8,6,4,1,0],
	  [27,  25,	23,	21,	19,	17,	15,	13,	11,	9,	7,	5,	2,	3],
];


vertMapB = [ 
	  [402,414,413,412,411,410,409,408,407,406,405,404,1,3],
	  [29,  27,	25,	23,	21,	19,	17,	15,	13,	11,	9,	7,	2,	4],
];
