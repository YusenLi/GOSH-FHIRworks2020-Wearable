var patientList_Names=["Acer",
	                       "Adam",
	                       "Barbara",
	                       "Bryson",
	                       "Bella",
	                       "Bryan",
	                       "Beck",
	                       "Belen",
	                       "Cody"];

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
	patientNames = new Array();
	var count = 0;
	for (var i = 0; i < jsonLength; i++) {
		entry = patientRecord[i].entry;
		entryLength = entry.length;
		for (var j = 0; j < entryLength; j++) {
			given = entry[j].resource.name[0].given[0];
			family = entry[j].resource.name[0].family;
			name = given + family;
			patientNames[count] = name;
			count++;
		}
	}
	return patientNames;
}

function updatePatientList(startLetter){
	//var jsonLength = patientRecord.length;
	//var patientList_Names = getPatientName;
	var container = document.getElementById("patientList");
	var top = "27.5vw";
	container.innerHTML = "";
	var length=patientList_Names.length;
	for(var i=0; i<length;i++){
		if(patientList_Names[i].charAt(0)!=startLetter){
			continue;
		}
		var patientBackground = document.createElement("div");
		var patientName = document.createElement("p");
		patientBackground.classList.add("patientList_Background");
		patientBackground.style.top = top;
		patientBackground.addEventListener("click",function(){
			jumptoDetailPage();
			//showWorkSpaceDetails(workSpaceList_SelectedType,i);
		});
		patientName.classList.add("patientList_PersonName");
		patientName.innerHTML = patientList_Names[i];
		//patientName.innerHTML = patientRecord[0].entry[0].resource.name[0].family;
		patientName.addEventListener("click",function(){
			jumptoDetailPage();
			//showWorkSpaceDetails(workSpaceList_SelectedType,i);
		});
		container.appendChild(patientName);
		container.appendChild(patientBackground);
		if(top == "27vw") patientName.style.top = (parseInt(top)-5)+"vw";
		else patientName.style.top = (parseInt(top)-4.5)+"vw";
		top=(parseInt(top)+17.5)+"vw";
	}
}

var currentLetterCode = 'A'.charCodeAt(0);

var PreviousLetterElement = document.getElementById("patientListPage").querySelector("#PreviousLetter");
var CurrentLetterElement = document.getElementById("patientListPage").querySelector("#CurrentLetter");
var NextLetterElement = document.getElementById("patientListPage").querySelector("#NextLetter");

function updateLetterSelector() {
	if(currentLetterCode < 'A'.charCodeAt(0)) {
		currentLetterCode = 'A'.charCodeAt(0);
		return;
	}
	if(currentLetterCode > 'Z'.charCodeAt(0)) {
		currentLetterCode = 'Z'.charCodeAt(0);
		return;
	}
	var previousLetter = currentLetterCode-1 < ( 'A'.charCodeAt(0) ) ? 32/*White space*/ : currentLetterCode-1;
	var nextLetter = currentLetterCode+1 > ( 'Z'.charCodeAt(0) ) ? 32/*White space*/ : currentLetterCode+1;
	PreviousLetterElement.innerHTML=String.fromCharCode(previousLetter);
	CurrentLetterElement.innerHTML=String.fromCharCode(currentLetterCode);
	NextLetterElement.innerHTML=String.fromCharCode(nextLetter);
	updatePatientList(String.fromCharCode(currentLetterCode));
}

function update(){
	document.getElementById("processing").style.color = 'white';
	document.getElementById("processing").innerHTML="updating the record";
	
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