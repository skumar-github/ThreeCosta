


//******************************************************
//  Init
//
//******************************************************
function __horizontalSlider__(args){

	this.setArgs(args); 
	var that = this;
	

	// WIDGET	
	var widget = __makeElement__("div", this.currArgs().parent, this.currArgs().id, this.currArgs().widgetCSS);
	// TRACK
	var track =  __makeElement__("div", widget, this.currArgs().id + "_track", this.currArgs().trackCSS);
	// HANDLE	
	var handle =  __makeElement__("div", widget, this.currArgs().id + "_handle", this.currArgs().handleCSS);
	
	// Defining the update css version
	this.updateCSS = function(args){
		// If there are inputted args, we need to set + validate them
		if (args) { this.setArgs(args) };
		
		__setCSS__(widget, this.currArgs().widgetCSS);
		__setCSS__(track, this.currArgs().trackCSS);
		__setCSS__(handle, this.currArgs().handleCSS);	
		
		this.value = this.currArgs().value;
		
		if (this.currArgs().value != 0){
			this.moveHandle("byValue", {
				handle: handle,
				track: track,
				value: this.currArgs().value
			});
		}
	}
	
	
	this.updateProperties = function(args){
		this.updateCSS(args);
	}

	

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
	this.handleStart = function(){ 
		return { 
			left: __absolutePosition__(handle).left, 
			top: __absolutePosition__(handle).top 		  
		} 
	}



	// GLOBALS - Positional Domain
	this.handleDomain = function(){
		return 	{
			start: this.currArgs().handleOffsetLeft,
			end:   __totalWidth__(widget) - __totalWidth__(handle) - this.currArgs().handleOffsetLeft,
		}	
	}

	

	
	//----------------------------------
	// Set Mouse Methods
	//----------------------------------		
	widget.onmousedown = function(event){
		event.stopPropagation();
		that.moveHandle("byMouse", {
			track: track,
			"event": event, 
			handle: handle
		});
		
		that.startBodyListen(bodyMouseListener, handle, track);
	}
	widget.onmouseup = function(event) { that.stopBodyListen(bodyMouseListener); }
	

	

	//----------------------------------
	// Mousewheel Methods - Listener
	//----------------------------------
	var lastMouseWheelEvent = 0;
	this.setMouseWheelEventTime = function(){
		var d = new Date();
		lastMouseWheelEvent = d.getTime();	
	}
	this.getLastMouseWheelEventTime = function(){
		return lastMouseWheelEvent;	
	}
	
	this.bindToMouseWheel = function(element){
		
		//----------------------------------
		// Mousewheel Methods - Handler
		//----------------------------------	
		function MouseWheelHandler(e) { // cross-browser wheel delta
			var e = window.event || e; // old IE support
			var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
			that.moveHandle("byMouseWheel", {
				"event": e, 
				handle: handle,
				wheelDelta: delta,
			});
			return false;
		}	
		
		if (element.addEventListener) {
			element.addEventListener("mousewheel", MouseWheelHandler, false); // IE9, Chrome, Safari, Opera	
			element.addEventListener("DOMMouseScroll", MouseWheelHandler, false); // Firefox	
		}
		else {element.attachEvent("onmousewheel", MouseWheelHandler);}  	// IE 6/7/8
	}
	// And mousewheel scrolling over the widget will trigger a mousewheel event.
	this.bindToMouseWheel(widget);

	
	
	
	

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
		
		
		// linked Callbacks
		if (that.linkedSliders && that.linkedSliders.length > 0 
			&& that.linkedCallbacks && that.linkedCallbacks.length > 0){
			for (var i=0;i<that.linkedCallbacks.length; i++){
				that.linkedCallbacks[i](that);
			}
		}
	}
	

	//----------------------------------
	// linkedCallbacks - Handler
	//----------------------------------	
	this.addLinkedCallback = function(func){
  		if (!that.linkedCallbacks)
			that.linkedCallbacks = [];
  		//addLinkedCallback(that, func);
  		that.linkedCallbacks.push(func);
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
	  	round: true,
	  	handleOffsetLeft: 0,
	  	handleOffsetTop: 0,
	  	widgetCSS: {
	  		position: "absolute",
	  		top: 50,
	  		left: 50,
	  		width: 300,
	  		//backgroundColor: "rgba(255,0,0,1)",
	  	},
	  	
	  	trackCSS: {
	  		height: 10,
	  		width: 300,
	  		position: "absolute",
	  		border: "solid",
	  		borderWidth: 1,
	  		borderColor: "rgba(0,0,0,1)",
	  		backgroundColor: "rgba(125,125,125,1)",
	  		borderRadius: 0,
	  	},
	  	
	  	handleCSS: {
	  		height: 30,
	  		width: 10,
	  		position: "absolute",
	  		border: "solid",
	  		borderWidth: 1,
	  		borderColor: "rgba(85,85,85,1)",
	  		backgroundColor: "rgba(125,225,125,1)",
	  		borderRadius: 0
	  	}
  	
  }
}





//******************************************************
//  
//******************************************************
__horizontalSlider__.prototype.setArgs = function(newArgs){


	// Argument check
	//if (!newArgs.widgetCSS) { throw ("__horizontalSlider__: Invalid arguments - no 'widgetCSS' subObject in arguments.");}
	if (newArgs.widgetCSS && newArgs.widgetCSS["height"]) { throw ("__horizontalSlider__: Please set the slider height by adjusting either handleCSS['height'] or trackCSS['height']");}
	if (newArgs.widgetCSS && newArgs.widgetCSS["width"]) { throw ("__horizontalSlider__: Please set the slider width by adjusting either trackCSS['width']"); }


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

	mergedArgs.widgetCSS.height  = (hHandle > hTrack) ? hHandle : hTrack; 
	mergedArgs.widgetCSS.width  = (wHandle > wTrack) ? wHandle : wTrack; 
		
	// set the top of the track to the "middle of the widget"
	mergedArgs.trackCSS.top = mergedArgs.widgetCSS.height/2 - 
						      mergedArgs.trackCSS.height/2 - 
						      mergedArgs.trackCSS.borderWidth;
	
	mergedArgs.handleCSS.left = mergedArgs.handleOffsetLeft;
	mergedArgs.handleCSS.top = mergedArgs.handleOffsetTop;
	



	// Define the currArgsfunction
	this.currArgs = function(){return mergedArgs};
}





//******************************************************
//  Uses a DIV element to listen for body-level mouse position.
//  This element is "activated" when the onmousedown is 
//  clicked on the widget.
//******************************************************
__horizontalSlider__.prototype.startBodyListen = function(bodyElt, handle, track){
	var that = this;
	bodyElt.style.width= "100%";
	bodyElt.style.height = "100%";
	bodyElt.onmousemove = function(event){ 
		that.moveHandle("byMouse", {
			"event": event, 
			handle: handle,
			track: track
		});
	}
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
//  Clears linked callbacks and sliders
//******************************************************
__horizontalSlider__.prototype.clearLinked= function(){
	this.linkedCallbacks = [];
	this.linkedSliders = [];
}




//******************************************************
//  
//******************************************************
__horizontalSlider__.prototype.moveHandle = function(moveType, args){

		var that = this;
		
		// vars
		var dom = this.handleDomain();
				
				
		// Do not want to propagate to the DOM
		// For either mouse or mouseWheel events
		if (args.event) { args.event.stopPropagation(); } 


		// MOUSEWHEEL
		if (moveType == "byMouseWheel" && args.wheelDelta){

			
			// get the current date and the delta from the last mousewheel move
			var step = (this.currArgs().step == null) ? 1 : this.currArgs().step;
			var d = new Date();
			var dTime = (d.getTime() - this.getLastMouseWheelEventTime());


			// respond to faster mousewheel -- rather linear and crude
			if (dTime < 250){  
				step *= 3;
			}
			
			
			// generate a tempLeft
			var tempLeft = __toInt__(args.handle.style.left) + (args.wheelDelta * step);
			this.setMouseWheelEventTime();		
		}

		
		// MOUSE
		else if (moveType == "byMouse"){
			var newPt = getMouseXY(args.event);	
				   
			var tempLeft = newPt.x - // mouseclick x
						   args.track.getBoundingClientRect().left - // current abs position of the handle
						   __toInt__(args.handle.style.width)/2; // centers the handle on the mouse pointer		

		}
		
		
		// ENTERED
		else if (moveType == "byValue"){
			tempLeft = dom.start + (dom.end - dom.start) * (args.value / (that.currArgs().max - that.currArgs().min));
		}


		// Throw an error otherwise
		else{
			throw "__horizontalSlider__: invalid moveHandle arguments."
		}
		

		// Reposition handle if outside of its CSS domain
		if (tempLeft < dom.start){
			tempLeft = dom.start;
		}
		if (tempLeft > dom.end){
			tempLeft = dom.end;
		}
		
		// get the Slider value
		var pct = tempLeft / (dom.end - dom.start);
		that.value = pct * (that.currArgs().max - that.currArgs().min);


		// round the slider value if desired
		if (that.currArgs.round) {that.value = Math.round(that.value);}
		
		// move the handle
		args.handle.style.left = __toPx__(tempLeft);
		
		// run callbackls
		that.runSlideCallbacks();	
}





//******************************************************
//  Links the inputted slider (b)
//******************************************************
__horizontalSlider__.prototype.linkSlider = function(b){
	
	var that = this;
	
	if (this.linkedSliders){
		for (var i=0;i<this.linkedSliders.length; i++){
			if(b == this.linkedSliders[i]){
				return;
			}				
		}
		this.linkedSliders.push(b);		
	}
	else{
		this.linkedSliders = [];
		this.linkedSliders.push(b);	
	}

	this.addLinkedCallback(function(a){  
			
		var aDiff = a.currArgs().max - a.currArgs().min;
		
		var bDiff = b.currArgs().max - b.currArgs().min;
		// percentage-based linking
		var bVal = Math.round(bDiff * (a.value / aDiff));
		
		b.updateProperties({value: bVal});
		b.runSlideCallbacks();
		
  	});
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









