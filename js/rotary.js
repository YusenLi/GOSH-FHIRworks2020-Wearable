function rotateCW() {
		if(document.getElementById("patientListPage").classList.contains("ui-page-active")) {
			currentLetterCode++;
			updateLetterSelector();
		}
	}
	
function rotateCCW() {
		if(document.getElementById("patientListPage").classList.contains("ui-page-active")) {
			currentLetterCode--;
			updateLetterSelector();
		}
	}
	
(function() {
	function bindEvents() {
		document.addEventListener('rotarydetent', function(ev) {
			var direction = ev.detail.direction;
	        if(direction==='CCW') {
	        	rotateCCW();
	        }else {rotateCW();}
	    });
	}

	function init() {
		bindEvents();
	}

	window.onload = init();

}());
