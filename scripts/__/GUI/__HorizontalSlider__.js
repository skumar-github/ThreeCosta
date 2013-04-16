var defaultArgs__HorizontalSlider__ = {
  	id: "__Slider__",			//def "sliderScroller"
  	parent: document.body,
  	handleOffset_track: 0,
  	handleOffset_top: 0,
  	start: 0,
  	min:   0,
  	max: 100,
  	step: -1,
  	value: 0,
  	round: false,
  	CSS: {
  		position: "absolute",
  		top: 50,
  		left: 50,
  		height: 20,
  		width: 300,
  		backgroundColor: "rgba(255,0,0,1)",
  	},
  	trackCSS: {
  		position: "absolute",
  		left: 0,
  		height: 10,
  		width: 300,
  		borderWidth: 1,
  		borderColor: "rgba(85,85,85,1)",
  		backgroundColor: "rgba(125,125,225,1)",
  	},
  	handleCSS: {
  		position: "absolute",
  		top: 0,
  		left: 0,
  		width: 10,
  		borderWidth: 1,
  		borderColor: "rgba(85,85,85,1)",
  		backgroundColor: "rgba(125,225,125,1)",
  	}
}



//******************************************************
//  Init
//
//******************************************************
function __HorizontalSlider__(args){
	that = this;
	this.args = (args) ? __MergeArgs__(defaultArgs__HorizontalSlider__, args) : defaultArgs__HorizontalSlider__;



	
	//----------------------------------
	// WIDGET
	//----------------------------------
	this.widget = __MakeElement__("div", this.args.parent, this.args.id, this.args.CSS);
	

	
	//----------------------------------
	// TRACK
	//----------------------------------
	this.track =  __MakeElement__("div", this.widget, this.args.id + "_track", __MergeArgs__(this.args.trackCSS,{
		top: __toInt__(this.widget.style.height)/2 - this.args.trackCSS.height/2
	}));
	
		
	
	//----------------------------------
	// HANDLE
	//----------------------------------
	var handleHeight = (this.args.handleCSS && this.args.handleCSS.height) ? this.args.handleCSS.height : this.args.CSS.height;
	this.handle =  __MakeElement__("div", this.widget, this.args.id + "_handle", __MergeArgs__(this.args.handleCSS,{
		top: __toInt__(this.widget.style.height)/2 - this.args.handleCSS.height/2,
		left: parseInt(this.args.handleOffset_track),
		height: handleHeight
	}));
	


	//----------------------------------
	// BODY LISTENER
	//----------------------------------
	this.bodyMouseListener =  __MakeElement__("div", this.widget, this.args.id + "_bodyMouseListener", __MergeArgs__(this.args.handleCSS,{
		position: "fixed",
		top: 0,
		left: 0,
		width: "0%",
		height: "0%",
		zIndex: 1999999999,
		backgroundColor: "rgba(0,0,0,0)"
	}));
	
	
	
	
	//----------------------------------
	// GLOBALS - Positioning
	//----------------------------------
	this.widget_absolutePos = getAbsPos(that.widget);
	this.track_absolutePos = getAbsPos(that.track);
	this.handle_absolutePos = getAbsPos(that.handle);


	//----------------------------------
	// GLOBALS - Positional Domain
	//----------------------------------	
	this.handleDomain = {
		start: parseInt(this.args.handleOffset_track),
		end:   parseInt(this.widget.style.width) - parseInt(this.handle.style.width) - this.args.handleOffset_track,
	}


	//----------------------------------
	// GLOBALS - Slider values
	//----------------------------------	
	this.start = this.args.start;
	this.min = this.args.min;
	this.max = this.args.max;
	
	
	
	//----------------------------------
	// GLOBALS - Callbacks
	//----------------------------------	
	this.slideCallbacks = [];
	
	//----------------------------------
	// Set Mouse Methods
	//----------------------------------		
	this.setHandleMouseMethods();
} 




//******************************************************
//  
//******************************************************
__HorizontalSlider__.prototype.setHandleMouseMethods = function(){
	this.isMouseDown = false;
	var that = this;

	
	this.widget.onmousedown = function(event){
		//console.log("Mousedown!", event);
		event.stopPropagation();
		that.isMouseDown = true;
		that.moveHandle(event);
		
		that.startBodyListen();
	}

	
	this.widget.onmouseup = function(event){
		//console.log("Mouseup!", event)
		that.isMouseDown = false;
		that.stopBodyListen();
	}
}



//******************************************************
//  Uses a DIV element to listen for body-level mouse position.
//  This element is "activated" when the onmousedown is 
//  clicked on the widget.
//******************************************************
__HorizontalSlider__.prototype.startBodyListen = function(event){

	// Increase the bodyMouseListener width to the page dimensions
	// so we have a page-level read of the mouse position
	this.bodyMouseListener.style.width= "100%";
	this.bodyMouseListener.style.height = "100%";
	
	// Apply a mousemove listener
	this.bodyMouseListener.onmousemove = function(event){ that.moveHandle(event); }
}




//******************************************************
//  Clears the bodyMouseListener DIV element.
//******************************************************
__HorizontalSlider__.prototype.stopBodyListen = function(event){
	// Increase the bodyMouseListener 
	// width to the page dimensions
	// so we have a page-level read of 
	//  the mouse position
	this.bodyMouseListener.style.width= "0%";
	this.bodyMouseListener.style.height = "0%";
	// Eliminate the mousemove 
	// function defined in startBodyListen()
	this.bodyMouseListener.onmousemove = function(){};
}




//******************************************************
//  
//******************************************************
__HorizontalSlider__.prototype.moveHandle = function(event){
	if (this.isMouseDown){
		var newPt = getMouseXY(event);	
		var tempLeft = newPt.x - that.handle_absolutePos.left - parseInt(that.handle.style.width)/2;
		
		// Reposition if outside of 
		// domain
		if (tempLeft < this.handleDomain.start){
			tempLeft = this.handleDomain.start;
		}
		if (tempLeft > this.handleDomain.end){
			tempLeft = this.handleDomain.end;
		}
		
		var pct = tempLeft / (that.handleDomain.end - that.handleDomain.start);
		
		that.value = pct * (that.max - that.min);
		
		if (that.args.round) {
			console.log("ROUNDING")
			that.value = Math.round(that.value);
		}
		
		that.handle.style.left = __toPx__(tempLeft);
		
		for (var i=0; i<that.slideCallbacks.length; i++){
			that.slideCallbacks[i](that)
		}		
	}
}





//******************************************************
//  
//******************************************************
__HorizontalSlider__.prototype.addSlideCallback = function(callback){
	this.slideCallbacks.push(callback);
}


//******************************************************
//  
//******************************************************
function getMouseXY(e) {
    if (navigator.appName == 'Microsoft Internet Explorer'){
      tempX = event.clientX + document.body.scrollLeft;
      tempY = event.clientY + document.body.scrollTop;
    }
    else {  // grab the x-y pos.s if browser is NS
      tempX = e.pageX;
      tempY = e.pageY;
    }  

    if (tempX < 0){tempX = 0;}
    if (tempY < 0){tempY = 0;}  

    return {x:tempX, y:tempY};
}




//******************************************************
//  
//******************************************************
function getAbsPos( obj) {
	var o = (typeof obj == 'String') ? document.getElementById( obj ) : obj;
	var pos = {top: 0, left: 0};
	
	while ( o.parentNode) {
		
		if (o.style.offsetTop){ pos.top += parseInt(o.style.offsetTop)};
		if (o.style.offsetLeft){ pos.left += parseInt(o.style.offsetLeft)};
		
		if (o.style.top){ pos.top += parseInt(o.style.top)};
		if (o.style.left){ pos.left += parseInt(o.style.left)};
		
		o = o.parentNode;
		if ((o.nodeName == "BODY") || (o.nodeName == "body")){break;}
		if (o.style.position && o.style.position == "fixed"){break;}
	}
	return pos;
}

