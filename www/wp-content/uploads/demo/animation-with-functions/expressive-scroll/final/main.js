// Animations
(function () {

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

	var TARGET = document.querySelector('.target');

	function fadeOut(element) {
		return function (progress) {
			element.style.opacity = 1 - progress;
		}
	}

	function timer(duration) {
		return function (observer) {
			var start = window.performance.now();
	    	requestAnimationFrame(function tick() {
	        	var ellapsed = window.performance.now() - start;
	        	observer(ellapsed/duration);
	        	if (ellapsed < duration) {
		           requestAnimationFrame(tick);
		        }
		    });
		}
	}

	function scroll(el, duration, offset) {
		// Some default
		offset = offset || 0;
		duration = duration || 1 - offset;

		// A bit of caching, though this would need updating
		// on 'resize'
		var viewportHeight = el.clientHeight;
		var contentHeight = el.scrollHeight;

		// Computes the progress according to current scroll position
		function getProgress() {
			var scrollPercent = el.scrollTop / (contentHeight - viewportHeight);
			return (scrollPercent - offset) / duration;
		}

		return function (observer) {
			observer(getProgress());
			window.addEventListener('scroll', function (event) {
				observer(getProgress());
			});
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

	function spy(output, source) {
		return function (observer) {
			source(function (value) {
				output(value);
				observer(value);
			});
		}
	}

	function log(selector) {
		var target = document.querySelector(selector);
		return function (value) {
			target.textContent = round2(value);
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

	function between(range, source) {
		return function (observer) {
			source(function (value) {
				var v = (value - range[0]) / (range[1] - range[0]);
				observer(v < 0 ? 0 : v > 1 ? 1 : v);
			});
		}
	}

	function noop() {}

	function round2(val) {
		return Math.round(val * 100) / 100;
	}

	function height(selector) {
		var target = document.querySelector(selector);
		return function (value) {
			target.style.height = value < 0 ? 0 : value + 'px';
		}
	}

	var topOfTarget = topOf(document.querySelector('.target'));
	topOfTarget = spy(log('[data-quoteValue="topOf"]'),topOfTarget);
	topOfTarget = spy(height('[data-quote="topOf"'), topOfTarget);
	var d = distance([topOfTarget, bottomOfViewport]);
	d = spy(log('[data-quoteValue="distance"]'), d);
	d = spy(height('[data-quote="distance"]'),d);
	var p = percentOf([viewportHeight,d]);
	p = spy(log('[data-quoteValue="percentOf"]'),p);
	var b = between([0.33,0.66],p);
	b = spy(log('[data-quoteValue="between"]'), b);

	b(fadeOut(document.querySelector('.target')));
	p(fadeOut(document.querySelector('.otherTarget')));

})(window)