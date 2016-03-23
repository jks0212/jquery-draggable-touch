/**
 * jQuery Draggable Touch v0.5
 * Jonatan Heyman | http://heyman.info 
 *
 * Make HTML elements draggable by using uses touch events.
 * The plugin also has a fallback that uses mouse events, 
 * in case the device doesn't support touch events.
 * 
 * Licenced under THE BEER-WARE LICENSE (Revision 42):
 * Jonatan Heyman (http://heyman.info) wrote this file. As long as you retain this 
 * notice you can do whatever you want with this stuff. If we meet some day, and 
 * you think this stuff is worth it, you can buy me a beer in return.
 */
;(function($){
    $.fn.draggableTouch = function(action) {
        // check if the device has touch support, and if not, fallback to use mouse
        // draggableMouse which uses mouse events
        if (!("ontouchstart" in document.documentElement)) {
            return this.draggableMouse(action);
        }
        
        // check if we shall make it not draggable
        if (action == "disable") {
            this.unbind("touchstart");
            this.unbind("touchmove");
            this.unbind("touchend");
            this.unbind("touchcancel");
            return this;
        }
        
        this.each(function() {
            var element = $(this);
            var offset = null;
            var bounder = $(action);
            var limit_top = null;
            var limit_left = null;
            var limit_bottom = null;
            var limit_right = null;
            if(bounder != null && bounder != "disable"){
            	limit_top = bounder.offset().top;
            	limit_left = bounder.offset().left;
            	limit_bottom = bounder.offset().top + bounder.height();
            	limit_right = bounder.offset().left + bounder.width();
            }
            
            var end = function(e) {
                e.preventDefault();
                var orig = e.originalEvent;
                
                element.trigger("dragend", {
                    top: orig.changedTouches[0].pageY - offset.y,
                    left: orig.changedTouches[0].pageX - offset.x
                });
            };
            
            element.bind("touchstart", function(e) {
                var orig = e.originalEvent;
                var pos = $(this).position();
                offset = {
                    x: orig.changedTouches[0].pageX - pos.left,
                    y: orig.changedTouches[0].pageY - pos.top
                };
                element.trigger("dragstart", pos);
            });
            element.bind("touchmove", function(e) {
                e.preventDefault();
                var orig = e.originalEvent;
                
                // do now allow two touch points to drag the same element
                if (orig.targetTouches.length > 1)
                    return;
                
                $(this).css({
                    top: orig.changedTouches[0].pageY - offset.y,
                    left: orig.changedTouches[0].pageX - offset.x
                });
                
                if(bounder != null){
	                $("#ctrl_center").text("top : " + element.offset().top);
	                var eTop = $(this).offset().top;
	                var eLeft = $(this).offset().left;
	                var eBottom = $(this).offset().top + element.height();
	                var eRight = $(this).offset().left + element.width();
	                if(eTop <= limit_top){
	                	if($(this).css('position') == 'absolute') $(this).css('top', '0px');
	                	else $(this).css('top', bounder.offset().top + 'px');
	                }
	                if(eLeft <= limit_left){
	                	if($(this).css('position') == 'absolute') $(this).css('left', '0px');
	                	else $(this).css('left', bounder.offset().left + 'px');
	                }
	                if(eBottom >= limit_bottom){
	                	if($(this).css('position') == 'absolute') $(this).css('top', (bounder.height() - $(this).height()) + 'px');
	                	else $(this).css('top', (bounder.offset().top + bounder.height() - $(this).height()) + 'px');
	                }
	                if(eRight >= limit_right){
	                	if($(this).css('position') == 'absolute') $(this).css('left', (bounder.width() - $(this).width()) + 'px');
	                	else $(this).css('top', (bounder.offset().left + bounder.width() - $(this).width()) + 'px');
	                }
	            }
            });
            element.bind("touchend", end);
            element.bind("touchcancel", end);
        });
        return this;
    };
    
    /**
     * Draggable fallback for when touch is not available
     */
    $.fn.draggableMouse = function (action) {
        // check if we shall make it not draggable
        if (action == "disable") {
            this.unbind("mousedown");
            this.unbind("mouseup");
            return this;
        }
        
        this.each(function() {
            var element = $(this);
            var offset = null;
            
            var move = function(e) {
                element.css({
                    top: e.pageY - offset.y,
                    left: e.pageX - offset.x,
                });
            };
            var up = function(e) {
                element.unbind("mouseup", up);
                $(document).unbind("mousemove", move);
                element.trigger("dragend", {
                    top: e.pageY - offset.y,
                    left: e.pageX - offset.x
                });
            };
            element.bind("mousedown", function(e) {
                var pos = element.position();
                offset = {
                    x: e.pageX - pos.left,
                    y: e.pageY - pos.top
                };
                $(document).bind("mousemove", move);
                element.bind("mouseup", up);
                element.trigger("dragstart", pos);
            });
        });
        return this;
    };
})(jQuery);
