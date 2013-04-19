


//******************************************************
//  Init
//
//******************************************************
function __horizontalSlider__(args){

	this.setArgs(args); 
	that = this;
	

	// WIDGET	
	var widget = __makeElement__("div", this.currArgs().parent, this.currArgs().id, this.currArgs().widgetCSS);
	

	// TRACK
	var track =  __makeElement__("div", widget, this.currArgs().id + "_track", this.currArgs().trackCSS);
			

	// HANDLE	
	var handle =  __makeElement__("div", widget, this.currArgs().id + "_handle", this.currArgs().handleCSS);
	


	// BODY LISTENER
	var bodyMouseListener =  __makeElement__("div", widget, this.currArgs().id + "_bodyMouseListener", __mergeArgs__(this.currArgs().handleCSS,{
		position: "fixed",
		top: 0,
		left: 0,
		width: "0%",
		height: "0%",
		zIndex: 1999999999,
		backgroundColor: "rgba(0,0,0,0)"
	}));
	
	// GLOBALS - Positioning
	var hStart_left = 	__absolutePosition__(handle).left;
	var hStart_top = 	__absolutePosition__(handle).top;
	this.handleStart = function(){ return { left: hStart_left, top: hStart_top }; }



	// GLOBALS - Positional Domain
	var handleDomain = {
		start: 0,
		end:   __toInt__(widget.style.width) - 
			   __toInt__(handle.style.width) - 
			   __toInt__(handle.style.borderWidth),
	}	
	this.handleDomain = function(){return handleDomain}




	// GLOBALS - Slider values
	this.start = this.currArgs().start;
	this.min = this.currArgs().min;
	this.max = this.currArgs().max;
	
	

	
	//----------------------------------
	// Set Mouse Methods
	//----------------------------------		
	widget.onmousedown = function(event){
		event.stopPropagation();
		that.moveHandle(event, handle);
		that.startBodyListen(bodyMouseListener, handle);
	}
	widget.onmouseup = function(event) { that.stopBodyListen(bodyMouseListener); }
	
	

	//----------------------------------
	// Mousewheel Methods - Listener
	//----------------------------------
	this.lastMouseWheelEvent = 0;
	if (widget.addEventListener) {
		
		widget.addEventListener("mousewheel", MouseWheelHandler, false); // IE9, Chrome, Safari, Opera
		
		widget.addEventListener("DOMMouseScroll", MouseWheelHandler, false); // Firefox
	
	}
	else {widget.attachEvent("onmousewheel", MouseWheelHandler);}  	// IE 6/7/8
	


	//----------------------------------
	// Mousewheel Methods - Handler
	//----------------------------------	
	function MouseWheelHandler(e) { // cross-browser wheel delta
		var e = window.event || e; // old IE support
		var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
		that.moveHandle(e, handle, delta);
		return false;
	}	
	
	
	
	

	//----------------------------------
	// Slide Callbacks - Handler
	//----------------------------------
	var slideCallbacks = [];
	this.addSlideCallback = function(callback){
		slideCallbacks.push(callback);
	}
	this.runSlideCallbacks = function(){
		for (var i=0; i<slideCallbacks.length; i++){
			slideCallbacks[i](this);
		};
	}
} 




__horizontalSlider__.prototype.defaultArgs = function() {
	
	return {
		
	  	id: "__Slider__",			//def "sliderScroller"
	  	parent: document.body,
	  	start: 0,
	  	min:   0,
	  	max: 100,
	  	step: 1,
	  	value: 0,
	  	round: false,
	  	
	  	widgetCSS: {
	  		position: "absolute",
	  		top: 50,
	  		left: 50,
	  		width: 300,
	  		backgroundColor: "rgba(255,0,0,1)",
	  	},
	  	
	  	trackCSS: {
	  		height: 10,
	  		width: 300,
	  		position: "absolute",
	  		border: "solid",
	  		borderWidth: 1,
	  		borderColor: "rgba(0,0,0,1)",
	  		backgroundColor: "rgba(125,125,125,1)",
	  	},
	  	
	  	handleCSS: {
	  		height: 30,
	  		width: 10,
	  		position: "absolute",
	  		border: "solid",
	  		borderWidth: 1,
	  		borderColor: "rgba(85,85,85,1)",
	  		backgroundColor: "rgba(125,225,125,1)",
	  	}
  	
  }
}





//******************************************************
//  
//******************************************************
__horizontalSlider__.prototype.setArgs = function(newArgs){


	// Argument check
	if (newArgs.widgetCSS["height"]) { throw ("__horizontalSlider__: Please set the slider height by adjusting either handleCSS['height'] or trackCSS['height']");}
	if (newArgs.widgetCSS["width"]) { throw ("__horizontalSlider__: Please set the slider width by adjusting either trackCSS['width']"); }


	// See if newArgs are valid for entry based on the default keys
	__validateArgs__("__horizontalSlider__", this.defaultArgs(), newArgs, function(){});

	
	// Define currArgs either as default or previously entered args;
	var currArgs = (this.currArgs)? this.currArgs() : this.defaultArgs();	

	
	// merge currArgs with newArgs
	var mergedArgs = (newArgs) ? __mergeArgs__(currArgs, newArgs) : currArgs;
	
		
	// calculate dims
	hHandle = mergedArgs.handleCSS.height +  mergedArgs.handleCSS.borderWidth * 2; 
	wHandle = mergedArgs.handleCSS.width +  mergedArgs.handleCSS.borderWidth * 2; 
	hTrack = mergedArgs.trackCSS.height +  mergedArgs.trackCSS.borderWidth * 2; 
	wTrack = mergedArgs.trackCSS.width +  mergedArgs.trackCSS.borderWidth * 2; 

		
	// Set the widget height to whichever is taller: height or track
	mergedArgs.widgetCSS.height  = (hHandle > hTrack) ? hHandle : hTrack; 
	mergedArgs.widgetCSS.width  = (wHandle > wTrack) ? wHandle : wTrack; 
	
	mergedArgs.trackCSS.top = mergedArgs.widgetCSS.height/2 - 
						      mergedArgs.trackCSS.height/2 - 
						      mergedArgs.trackCSS.borderWidth;


	// Define the currArgsfunction
	this.currArgs = function(){return mergedArgs};
}





//******************************************************
//  
//******************************************************
__horizontalSlider__.prototype.updateCSS = function(args){
	
	// If there are inputted args, we need to set + validate them
	if (args) { this.setArgs(args) };
	
}





//******************************************************
//  Uses a DIV element to listen for body-level mouse position.
//  This element is "activated" when the onmousedown is 
//  clicked on the widget.
//******************************************************
__horizontalSlider__.prototype.startBodyListen = function(bodyElt, handle){
	bodyElt.style.width= "100%";
	bodyElt.style.height = "100%";
	bodyElt.onmousemove = function(event){ that.moveHandle(event, handle); }
}





//******************************************************
//  Clears the bodyMouseListener DIV element.
//******************************************************
__horizontalSlider__.prototype.stopBodyListen = function(bodyElt){
	bodyElt.style.width= "0%";
	bodyElt.style.height = "0%";
	bodyElt.onmousemove = function(){};
}





//******************************************************
//  
//******************************************************
__horizontalSlider__.prototype.moveHandle = function(event, handle, wheelDelta){
		
		event.stopPropagation();
		
		if (wheelDelta){
			var d = new Date();
			var newTime = d.getTime();
			var step = this.currArgs().step;
			var dTime = (newTime - this.lastMouseWheelEvent);
			// respond to faster mousewheel
			if (dTime < 250){  
				// Need to develop a more appropriate mathematical relationship here
				step *= 3;
			}
			var tempLeft = __toInt__(handle.style.left) + (wheelDelta * step);
			this.lastMouseWheelEvent = d.getTime();			
		}
		else{
			var newPt = getMouseXY(event);	
			var tempLeft = newPt.x - // mouseclick x
						   this.handleStart().left - // current abs positoin of the handle
						   __toInt__(handle.style.width)/2; // centers the handle on the mouse pointer			
		}

		
		// Reposition if outside of domain
		var dom = this.handleDomain();
		if (tempLeft < dom.start){
			tempLeft = dom.start;
		}
		if (tempLeft > dom.end){
			tempLeft = dom.end;
		}
		
		var pct = tempLeft / (dom.end - dom.start);
		
		that.value = pct * (that.max - that.min);
		
		if (that.currArgs.round) {that.value = Math.round(that.value);}
		
		handle.style.left = __toPx__(tempLeft);
		
		that.runSlideCallbacks();	
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
function __absolutePosition__( obj) {
	
	var o = (typeof obj == 'String') ? document.getElementById( obj ) : obj;
	var pos = {top: 0, left: 0};
	
	while ( o.parentNode) {
		
		if (o.style.offsetTop){ pos.top += __toInt__(o.style.offsetTop)};
		if (o.style.offsetLeft){ pos.left += __toInt__(o.style.offsetLeft)};
		
		if (o.style.top){ pos.top += __toInt__(o.style.top)};
		if (o.style.left){ pos.left += __toInt__(o.style.left)};
		
		o = o.parentNode;
		if ((o.nodeName == "BODY") || (o.nodeName == "body")){break;}
		if (o.style.position && o.style.position == "fixed"){break;}
	}
	return pos;
}




