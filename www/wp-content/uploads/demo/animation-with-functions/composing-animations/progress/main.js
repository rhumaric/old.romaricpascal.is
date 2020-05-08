// Animations
(function () {
	// 1. HELPER FUNCTIONS
	
	// Throttle for scroll and resize listeners
	// https://stackoverflow.com/questions/27078285/simple-throttle-in-js 
	function throttle(func, wait) {
		var context, args, result;
		var timeout = null;
		var previous = 0;
		var later = function() {
			previous = Date.now();
			timeout = null;
			result = func.apply(context, args);
			if (!timeout) context = args = null;
		};
		return function() {
			var now = Date.now();
			var remaining = wait - (now - previous);
			context = this;
			args = arguments;
			if (remaining <= 0 || remaining > wait) {
				if (timeout) {
					clearTimeout(timeout);
					timeout = null;
				}
				previous = now;
				result = func.apply(context, args);
				if (!timeout) context = args = null;
			} else if (!timeout) {
				timeout = setTimeout(later, remaining);
			}
			return result;
		};
	};

	// 2. DEMO PLUMBING
	
	function timer(duration) {
		return function (observer) {
			var start = window.performance.now();
	    	requestAnimationFrame(function tick() {
	        	var ellapsed = window.performance.now() - start;
	        	var progress = ellapsed / duration;
	        	observer(progress > 1 ? 1 : progress);
	        	if (ellapsed < duration) {
		           requestAnimationFrame(tick);
		        }
		    });
		}
	}

	// 3. DEMO MATERIAL

	/**
	 * The animation
	 */
	function translateX(selector) {
		var distance = 80;
		var element = document.querySelector(selector);
		return function (progress) {
			element.style.transform = 'translateX(' + distance * progress + 'vw)';
		}
	}

	// https://gist.github.com/gre/1650294
	function easeInOutQuad(t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t };

	function ease(easing, animation) {
		return function (progress) {
			animation(easing(progress));
		}
	}

	function revert(animation) {
		return function (progress) {
			animation(1 - progress);
		}
	}

	function parallel(animations) {
		return function (progress) {
			animations.forEach(function (animation) {
				animation(progress);
			});
		}
	}

	function shift(start, duration, animation) {
		return function (progress) {
			var actualProgress = (progress - start) / duration;
			animation(actualProgress > 1 ? 1  : actualProgress < 0 ? 0 : actualProgress);
		}
	}

	document.querySelector('.dots').addEventListener('click', function (event) {
		timer(1000)(translateX('.dot:nth-child(1)'));
		timer(1000)(ease(easeInOutQuad,translateX('.dot:nth-child(2)')));
		timer(1000)(revert(translateX('.dot:nth-child(3)')));
	});
})(window)