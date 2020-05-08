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
	
	/**
	 * No op. function
	 */
	function noop() {}

	/**
	 * Spies on the values of a source to pass them to an output function
	 */
	function spy(output, source) {
		return function (observer) {
			source(function (value) {
				output(value);
				observer(value);
			});
		}
	}

	/**
	 * Rounds to 2 decimals
	 */
	function round2(val) {
		return Math.round(val * 100) / 100;
	}

	/**
	 * Logs the value as textContent
	 */
	function log(selector) {
		var target = document.querySelector(selector);
		return function (value) {
			target.textContent = round2(value);
		}
	}

	/**
	 * Updates style.height
	 */
	function height(selector) {
		var target = document.querySelector(selector);
		return function (value) {
			target.style.height = value < 0 ? 0 : value + 'px';
		}
	}

	// 3. DEMO MATERIAL

	/**
	 * The animation
	 */
	function fadeOut(element) {
		return function (progress) {
			element.style.opacity = 1 - progress;
		}
	}

	function bottomOfViewport(observer) {
		observer(document.body.clientHeight);
		window.addEventListener('resize', throttle(function () {
			observer(document.body.clientHeight);
		}, 100));
	}

	function viewportHeight(observer) {
		observer(document.body.clientHeight);
		window.addEventListener('resize', throttle(function () {
			observer(document.body.clientHeight);
		}, 100));
	}

	function topOf(el) {
		return function (observer) {
			observer(el.getBoundingClientRect().top);
			window.addEventListener('scroll', throttle(function () {
				observer(el.getBoundingClientRect().top);
			}, 100));
			window.addEventListener('resize', throttle(function () {
				observer(el.getBoundingClientRect().top);
			}, 100));

		}
	}

	function combine(sources) {
		var values = [];
		return function (observer) {
			sources.forEach(function (source, index) {
				source(function (value) {
					values[index] = value;
					observer(values);	
				});
			})
		}
	}

	// NEW MATERIAL
	function distance(start,end) {
		var combined = combine(start, end);
		return function (observer) {
			combined(function (values) {
				if (values.length === 2) {
					observer(values[1] - values[0]);
				}
			});
		}
	}

	function percentOf(ref, value) {
		var combined = combine(ref, value);
		return function (observer) {
			combined(function (values) {
				if (values.length === 2) {
					observer(values[1] / values[0]);
				}
			});
		}
	}
	
	var viewportHeightSpy = spy(log('[data-quotevalue="viewportHeight"]'), viewportHeight);
	viewportHeightSpy = spy(height('[data-quote="viewportHeight"]'), viewportHeightSpy);
	viewportHeightSpy(noop);
	var topOfTarget = topOf(document.querySelector('.target'));
	topOfTarget = spy(log('[data-quoteValue="topOf"]'),topOfTarget);
	topOfTarget = spy(height('[data-quote="topOf"'), topOfTarget);
	var d = distance([topOfTarget, bottomOfViewport]);
	d = spy(log('[data-quoteValue="distance"]'), d);
	d = spy(height('[data-quote="distance"]'),d);
	var p = percentOf([viewportHeight,d]);
	p = spy(log('[data-quoteValue="percentOf"]'),p);

	p(fadeOut(document.querySelector('.target')));

})(window)