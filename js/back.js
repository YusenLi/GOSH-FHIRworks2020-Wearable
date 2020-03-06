function backButtonPressEvent()
{
	window.addEventListener('tizenhwkey', function(ev) {
	    if (ev.keyName == 'back') {
	    	if(document.getElementById("patientListPage").classList.contains("ui-page-active")) {
	    		tau.changePage("#homepage");
	    	}else if(document.getElementById("patientDetailPage").classList.contains("ui-page-active")) {
	    		tau.changePage("#patientListPage");
	    	}
	    }
	});
}

backButtonPressEvent();