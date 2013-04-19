//******************************************************
//  REturns total width of object including borders
//
//******************************************************
function __totalWidth__(elt){
	var _h = __toInt__(elt.style.width);
	if (elt.style.borderWidth) _h += __toInt__(elt.style.width);
	return _h;
}