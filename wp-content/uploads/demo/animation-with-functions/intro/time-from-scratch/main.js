// Animations
(function () {
	var TARGET = document.querySelector('.target');

	function animate(duration, target) {
		var start = window.performance.now();
	    requestAnimationFrame(function tick() {
	        var ellapsed = window.performance.now() - start;
	        var progress = ellapsed/duration;
	        target.style.opacity = progress;
	        if (ellapsed < duration) {
	           requestAnimationFrame(tick);
	        }
	    });
	}

	TARGET.addEventListener('click', function () {
		animate(1000, TARGET);
	});
})(window)