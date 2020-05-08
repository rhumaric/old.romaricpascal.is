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

	function animate(duration, target) {
		timer(duration)(fadeIn(target));
	}

	TARGET.addEventListener('click', function () {
		animate(1000, TARGET);
	});
})(window)