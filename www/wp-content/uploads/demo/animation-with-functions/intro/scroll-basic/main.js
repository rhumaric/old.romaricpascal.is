// Animations
(function () {
	var TARGET = document.querySelector('.target');

	function fadeIn(element) {
		return function (progress) {
			element.style.opacity = progress;
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

	function animate(duration, target) {
		timer(duration)(fadeIn(target));
	}

	TARGET.addEventListener('click', function () {
		animate(1000, TARGET);
	});

	scroll(document.body, 0.5, 0.25)(fadeIn(TARGET));
})(window)