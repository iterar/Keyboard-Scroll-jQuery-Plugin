/*
 * jQuery Keyboard Scroll plugin
 * Original author: @plaintiago
 * Licensed under the MIT license
 */

/* Keyboard scrolling

To-do:
	- allow horizontal scrolling;
	
*/

;(function($) {
	
	$.fn.keyboardScroll = function(options) {
		
		/* Options
		   To-do:
		       - Scroll to top or not
		*/
		var defaults = {
			scrollSpeed: 500 /* ms */,
			offset: 0,
			keys: {
				up: '38',
				down: '40'
			},
			htmlTag: "section",
			top: true
		}
		var options = $.extend({}, defaults, options);
		
		/* Get sections for keyboard scroll */
		var sections = [];
		this.children(options.htmlTag).each(function(index){
			sections.push($(this));
		});
		
		/* Compute and store section limits */
		var limits = [];
		function computeLimits() {
			if (sections.length >= 1) {
				if (options.top) {
					bottomLimit = sections[0].position().top - options.offset;
					limits[0] = [0, bottomLimit];
				}
				
				$.each(sections, function(index, value) {
					topLimit = sections[index].position().top - options.offset;
					bottomLimit = sections[index].position().top + sections[index].height() - options.offset;
					limits.push([topLimit, bottomLimit]);
				});
				
				/* Limits for remaining document */
				topLimit = sections[sections.length-1].position().top - options.offset + sections[sections.length-1].height() - options.offset;
				limits.push([topLimit, $(document).height()]);
			}
		}
		computeLimits();
		
		function getLocation() {
		    var y = $(window).scrollTop();
		    var ySection;
		    
		    $.each(limits, function(index, value) {
			    if (y >= limits[index][0] && y < limits[index][1]) {
				    ySection = index;
				    return;
			    }
		    });
		    return ySection;
	    }
	    
	    function scrollToY(y) {
		    $('html,body').stop().animate({
				scrollTop: y
			}, options.scrollSpeed);
	    }
	    
	    // Arrows navigation
	    $(document).keydown(function(event) {
		    
		    var ySection = getLocation();
		    if (!(ySection >= 0 && ySection <= limits.length)) return;
		    
		    
		    // Up arrow key
		    if (event.keyCode == options.keys.up) {
			    event.preventDefault();
			    
			    // Do nothing if it is already at top
			    if ($(window).scrollTop() <= limits[0][0]) {
				    return;
			    } else {
			    	if (options.top) {
			    		if (sections[ySection-2]) {
					    	var sectionNumber = ySection - 2;
					    	var scrollPosition = sections[sectionNumber].position().top - options.offset;
					    } else {
					    	var scrollPosition = 0;
					    }
			    	} else {
			    		if (sections[ySection-1]) {
					    	var sectionNumber = ySection - 1;
					    	var scrollPosition = sections[sectionNumber].position().top - options.offset;
					    } else {
					    	var sectionNumber = 0;
				    		var scrollPosition = sections[sectionNumber].position().top - options.offset;
					    }
			    	}
			    	
				    scrollToY(scrollPosition);
			    }
				
			// Down arrow key
		    } else if (event.keyCode == options.keys.down) {
			    event.preventDefault();
			    
			    if (options.top) {
			    	if (ySection >= sections.length) {
				    	return;
					} else {
						var sectionNumber = ySection;
					}
			    } else {
			    	if (ySection >= sections.length - 1 || $(window).scrollTop() < limits[0][0]) {
				    	return;
					} else {
						var sectionNumber = ySection + 1;
					}
			    }
				
			    var scrollPosition = sections[sectionNumber].position().top - options.offset;
			    scrollToY(scrollPosition);
			    
		    }
		});
		
	};
	
})(jQuery);