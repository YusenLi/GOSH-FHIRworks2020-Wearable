/*var patientNames=["Acer",
	                       "Adam",
	                       "Barbara",
	                       "Bryson",
	                       "Bella",
	                       "Bryan",
	                       "Beck",
	                       "Belen",
	                       "Cody"];*/

var patientNames;

var patientRecord;

function init(){
	//document.getElementById("processing").innerHTML="updating the record";
	updateLetterSelector();
	updatePatientList('A');
}

function jumptoDetailPage(){
	tau.changePage("#patientDetailPage");
}

function getPatientName(){
	var jsonLength = patientRecord.length;
	patientNames = new Array();
	var count = 0;
	for (var i = 0; i < jsonLength; i++) {
		entry = patientRecord[i].entry;
		entryLength = entry.length;
		for (var j = 0; j < entryLength; j++) {
			given = entry[j].resource.name[0].given[0];
			family = entry[j].resource.name[0].family;
			name = given + ', ' + family;
			patientNames[count] = name;
			count++;
		}
	}
	return patientNames;
}

function updatePatientList(startLetter){
	patientNames = getPatientName();
	var container = document.getElementById("patientList");
	var top = "27.5vw";
	container.innerHTML = "";
	var length=patientNames.length;
	for(var i=0; i<length;i++){
		if(patientNames[i].charAt(0)!=startLetter){
			continue;
		}
		var patientBackground = document.createElement("div");
		var patientName = document.createElement("p");
		patientBackground.classList.add("patientList_Background");
		patientBackground.style.top = top;
		patientBackground.addEventListener("click",function(){
			jumptoDetailPage();
		});
		patientName.classList.add("patientList_PersonName");
		patientName.innerHTML = patientNames[i];
		patientName.addEventListener("click",function(){
			jumptoDetailPage();
		});
		if(top == "27vw"){patientName.style.top = (parseInt(top)-5)+"vw";}
		else{patientName.style.top = (parseInt(top)-4.5)+"vw";}
		container.appendChild(patientName);
		container.appendChild(patientBackground);
		top=(parseInt(top)+17.5)+"vw";
	}
}

var currentLetter = 'A'.charCodeAt(0);

var previousLetterE = document.getElementById("patientListPage").querySelector("#PreviousLetter");
var currentLetterE = document.getElementById("patientListPage").querySelector("#CurrentLetter");
var nextLetterE = document.getElementById("patientListPage").querySelector("#NextLetter");

function updateLetterSelector() {
	if(currentLetter < 'A'.charCodeAt(0)) {
		currentLetter = 'A'.charCodeAt(0);
		return;
	}
	if(currentLetter > 'Z'.charCodeAt(0)) {
		currentLetter = 'Z'.charCodeAt(0);
		return;
	}
	var previousLetter = currentLetter-1 < ( 'A'.charCodeAt(0) ) ? 32/*White space*/ : currentLetter-1;
	var nextLetter = currentLetter+1 > ( 'Z'.charCodeAt(0) ) ? 32/*White space*/ : currentLetter+1;
	previousLetterE.innerHTML=String.fromCharCode(previousLetter);
	currentLetterE.innerHTML=String.fromCharCode(currentLetter);
	nextLetterE.innerHTML=String.fromCharCode(nextLetter);
	updatePatientList(String.fromCharCode(currentLetter));
}

function update(){
	document.getElementById("processing").style.color = '#00FFFF';
	document.getElementById("processing").innerHTML="updating ...";
	
	var requestURL = 'https://husky1.azurewebsites.net/api/Patient';
	var request = new XMLHttpRequest();
	request.open('GET', requestURL);
	request.responseType = 'json';
	request.send();
	
	request.onload = function(){
		patientRecord = request.response;
		document.getElementById("processing").style.color = 'blue';
		document.getElementById("processing").innerHTML="updating completed";
		interval = setInterval(function(){
			document.getElementById("processing").innerHTML = '';
			clearInterval(interval);
		}, 2000);
	};
}

window.onload=init();