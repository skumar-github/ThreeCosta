var defaultArgs___Slider__ = {
  	id: "sliderScroller",			//def "sliderScroller"
  	corollary: "sliderScroller",			//def "sliderScroller"


}



//******************************************************
//  Manages the mousewheel scrollong in the slider
//
//******************************************************
var mouseWheelScroll = function(e, that){
	  	//get the current mouseWheelEvent
	  	_date = new Date();
	    var currMouseWheelEvent = _date.getTime();
	    
	    var delta = 0, element = $(that.slider), value, result, oe;
	    oe = e.originalEvent; // for jQuery >=1.7
	    value = element.slider('value'); 
	
		var multiplier = (that.args["orientation"] == "horizontal") ? -1: 1;
		
		var timeDiff = currMouseWheelEvent - that.args.lastMouseWheelEvent;
		if (timeDiff < 70){
			multiplier *= 1.5; 
		}
		
		
	    if (oe.wheelDelta) {
	        delta -= oe.wheelDelta;
	    }
	    if (oe.detail) {
	        delta = oe.detail * 40;
	    }
		// Delta varies depending on the browser
		// We just need the sign (.i.e. the direction of the mouse scroll)
		var d = (delta< 0)? -1: 1 
	    value -= multiplier * d * that.args["step"];


	    if (value > $(that.slider).slider("option", "max")) {
	        value = $(that.slider).slider("option", "max");
	    }
	    if (value < $(that.slider).slider("option", "min")) {

	        value = $(that.slider).slider("option", "min");
	    }
	
		// Need to round the value if the "step" of the slider
		// is an integer
		if (! (value % $(that.slider).slider("option", "step") === 0)){
			value = Math.round(value )
		}
		
	    result = element.slider('option', 'slide').call(element, e, { value: value });
	    that.currValue = value;
	    //console.log("value: " + that.currValue)
	    if (result !== false) {
	        element.slider('value', value);
	    }

	    that.args.lastMouseWheelEvent = currMouseWheelEvent;
}




//******************************************************
//  Binds the slider to the mousewheel
//
//******************************************************
__Slider__.prototype.bindToMouseWheel = function(elt){



	//----------------------------------
	//	WIDGET
	//----------------------------------	
 	var that = this;
    var eltFound = false;
    for (var i=0;i<this.mouseWheelBindElements.length;i++){
    	if (this.mouseWheelBindElements[i] == elt){
    		eltFound = true;
    		break;
    	}
    } 		
	if (!eltFound){
	
		
		//----------------------------------
		//	WIDGET
		//----------------------------------	
		this.mouseWheelBindElements.push(elt);
		$(elt).bind('mousewheel DOMMouseScroll', function(e){mouseWheelScroll(e, that)});
		$(this.slider).slider('option', 'value', this.currValue);
		$(elt).hover(function(){
			that.mouseOver = true;
		});
	}
}





//******************************************************
//  Init
//
//******************************************************
function __Slider__(args){
	that = this;
	this.args = (args) ? __MergeArgs__(defaultArgs___Slider__, args) : defaultArgs___Slider__;
  	
  	
  	
 	//----------------------------------
	// PRIVATE VARS
	//----------------------------------      
    this.mouseOver = false;
    this.slideCallbacks = [];
    this.mouseWheelBindElements = [];
    
    
    
     	
	//----------------------------------
	// WIDGET
	//----------------------------------	
  	this.widget = document.createElement("div");
  	this.widget.setAttribute("id", this.args["id"]);
  	this.args["parent"].appendChild(this.widget);




	//----------------------------------
	// JQUERY SLIDER
	//----------------------------------
  	this.slider = document.createElement("div");
  	this.slider.setAttribute("id", this.args["id"] + "_slider");
  	this.widget.appendChild(this.slider);




	//----------------------------------
	// SLIDER'S VALUES
	//----------------------------------    
    var that = this;
    this.currValue = this.args["value"];
	$(this.slider).slider({
		  orientation: this.args["orientation"],
		  min: this.args["min"],
          max: this.args["max"],
          value: this.args["value"],
          step: this.args["step"],
          slide: function(e,ui, _that){
          	  if (_that) {
          	  	_that.slide(e, ui);
          	  }
          	  that.slide(e, ui);
          },
	});




	//----------------------------------
	// DETATCHING THE CSS PROVIDED BY JQUERY UI
	// FOR VARIOUS SLIDER COMPONENTS
	//----------------------------------  
	this.sliderHandle = this.slider.getElementsByTagName('a')[0];
	this.sliderHandle.setAttribute("id", this.args["id"] + "_handle");
	$(this.sliderHandle).removeClass("ui-slider-horizontal");

	// the scroller
	this.scroller = document.createElement("div");
  	this.scroller.setAttribute("id", this.args["id"] + "_scroller");
  	this.widget.appendChild(this.scroller);
  	
	// the constrainer, which is actually the jquery slider's bounds
	this.sliderConstrainer= document.createElement("div");
  	this.sliderConstrainer.setAttribute("id", this.args["id"] + "_sliderConstrainer");
  	this.widget.removeChild(this.slider);  	
  	this.sliderConstrainer.appendChild(this.slider);
  	this.widget.appendChild(this.sliderConstrainer);

	// the value display, usually hidden 	
  	this.valueDisplay = document.createElement("div");
  	this.valueDisplay.setAttribute("id", this.args["id"] + "_valueDisplay");
  	this.valueDisplay.innerHTML = (this.currValue);
  	this.valueDisplay.style.textAlign = "center";
  	if (!this.args["showValue"]) this.valueDisplay.style.display = "none";

  	this.args["parent"].appendChild(this.valueDisplay);




	//----------------------------------
	// BIND WIDGET TO MOUSEWHEEL
	//---------------------------------- 	
	this.bindToMouseWheel(this.widget);
	
	 if (that.args["disableDocumentOverflow"]){
  		document.documentElement.style.overflowY = 'hidden';
  	}
  	
  	this.addSlideCallback = function(func, mapValueToSlider, clearAll, call){
  		addSlideCallback(that, func, mapValueToSlider, clearAll, call);
  	}
  	
  	
  	this.addLinkedCallback = function(func){
  		if (!that.linkedCallbacks)
			that.linkedCallbacks = [];
  		addLinkedCallback(that, func);
  	}
  	
  	

  	this.updateCSS();
} 


