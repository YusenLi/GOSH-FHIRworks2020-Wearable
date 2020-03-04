var patientRecord;

function init(){
	
}

function update(){
	document.getElementById("processing").innerHTML="updating the record";
	
	var requestURL = 'https://husky1.azurewebsites.net/api/Patient';
	var request = new XMLHttpRequest();
	request.open('GET', requestURL);
	request.responseType = 'json';
	request.send();
	
	request.onload = function(){
		patientRecord = request.response;
		document.getElementById("processing").innerHTML="updating completed";
		interval = setInterval(function(){
			document.getElementById("processing").innerHTML = '';
			clearInterval(interval);
		}, 2000);
	};
}

window.onload = init();