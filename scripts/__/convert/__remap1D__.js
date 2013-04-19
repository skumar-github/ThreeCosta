function __remap1D__(n, dold, dnew){


	//console.log("N: " + n)
	//console.log("dold: " + dold)
	//console.log("dnew: " + dnew)
	
	if ((dold[0] == dold[1]) || (dnew[0] == dnew[1])){
		throw ("Remap: initial domain is equal!");
	}
	
	if (dold[0] > dold[1]){
		dold = __SwapArrayElements__(dold);
	}

	if (dnew[0] > dnew[1]){
		dnew = __SwapArrayElements__(dnew);
	}

	if (n <= dold[0]){
		n = dold[0];
		var returner = {
			newVal: dnew[0],
			adjOld: n
		};
		return returner;
	}
	else if (n >= dold[1]){
		n = dold[1];
		var returner = {
			newVal: dnew[1],
			adjOld: n
		};
		return returner;
	}
	
    var newVal = Math.round((n/(dold[1]-dold[0])) * ((dnew[1]-dnew[0])));

    if (newVal < dnew[0]){
		newVal = dnew[0];
	}
	else if (newVal > dnew[1]){
		newVal = dnew[1];
	}
    
    //console.log("newVAl: " + newVal);    
    //console.log("*****************")
	return {
		newVal: newVal,
		adjOld: n
	};
}