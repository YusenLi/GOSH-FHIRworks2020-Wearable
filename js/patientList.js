/*var patientNames=["Acer",
	                       "Adam",
	                       "Barbara",
	                       "Bryson",
	                       "Bella",
	                       "Bryan",
	                       "Beck",
	                       "Belen",
	                       "Cody"];*/

var detailAtt = ["Family Name", "Given Name", "Medical Record Number", "Social Security Number", "Driver's License", "Passport Number"];

var patientNames;

var patientRecord = {};

var detailVal;

function init(){
	updateLetterSelector();
	updatePatientList('A');
	addScrollEvent();
}

function getPatientDetail(i, j){
	detailVal = new Array();
	detailVal[0] = patientRecord[i].entry[j].resource.name[0].family;
	detailVal[1] = patientRecord[i].entry[j].resource.name[0].given[0];
	detailVal[2] = patientRecord[i].entry[j].resource.identifier[1].value;
	detailVal[3] = patientRecord[i].entry[j].resource.identifier[2].value;
	detailVal[4] = patientRecord[i].entry[j].resource.identifier[3].value;
	detailVal[5] = patientRecord[i].entry[j].resource.identifier[4].value;
}

function updatePatientDetail(){
	var container = document.getElementById("detail");
	var top = "27.5vw";
	container.innerHTML = "";
	var length=detailAtt.length;
	for(var i=0; i<length;i++){
		var detailBackground = document.createElement("div");
		var detailEach = document.createElement("p");
		detailBackground.classList.add("detail_Background");
		detailBackground.style.top = top;
		detailEach.classList.add("detail_Each");
		detailEach.innerHTML = detailAtt[i] + ": " + detailVal[i];
		if(top == "27vw"){detailEach.style.top = (parseInt(top)-5)+"vw";}
		else{detailEach.style.top = (parseInt(top)-4.5)+"vw";}
		container.appendChild(detailBackground);
		container.appendChild(detailEach);
		top=(parseInt(top)+17.5)+"vw";
	}
	var toHide = document.createElement("div");
	toHide.classList.add("hideObj");
	toHide.style.top = top;
	container.appendChild(toHide);
}

function jumptoDetailPage(i, j){
	getPatientDetail(i, j);
	updatePatientDetail();
	tau.changePage("#patientDetailPage");
}

function getPatientName(){
	var given;
	var family;
	var name;
	var entry;
	var entryLength;
	var jsonLength = patientRecord.length;
	patientNames = new Array();
	for (var i = 0; i < jsonLength; i++) {
		var entryNames = new Array();
		entry = patientRecord[i].entry;
		entryLength = entry.length;
		for (var j = 0; j < entryLength; j++) {
			given = entry[j].resource.name[0].given[0];
			family = entry[j].resource.name[0].family;
			name = given + ', ' + family;
			entryNames[j] = name;
		}
		patientNames[i]=entryNames;
	}
}

function updatePatientList(startLetter){
	getPatientName();
	var container = document.getElementById("patientList");
	var top = "27.5vw";
	container.innerHTML = "";
	var length=patientNames.length;
	for(var i=0; i<length;i++){
		var jLength = patientNames[i].length;
		let index1 = i;
		for (var j = 0; j < jLength; j++) {
			let index2= j;
			if(patientNames[i][j].charAt(0)!=startLetter){
				continue;
			}
			var patientBackground = document.createElement("div");
			var patientName = document.createElement("p");
			patientBackground.classList.add("patientList_Background");
			patientBackground.style.top = top;
			patientBackground.addEventListener("click",function(){
				jumptoDetailPage(index1, index2);
			});
			patientName.classList.add("patientList_PersonName");
			patientName.innerHTML = patientNames[i][j];
			patientName.addEventListener("click",function(){
				jumptoDetailPage(index1, index2);
			});
			if(top == "27vw"){patientName.style.top = (parseInt(top)-5)+"vw";}
			else{patientName.style.top = (parseInt(top)-4.5)+"vw";}
			container.appendChild(patientName);
			container.appendChild(patientBackground);
			top=(parseInt(top)+17.5)+"vw";
		}
	}
	var toHide = document.createElement("div");
	toHide.classList.add("hideObj");
	toHide.style.top = top;
	container.appendChild(toHide);
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

function showLoading(show) {
	if(show){
		document.getElementById("loading").style.display = "block";
	}
	else{
		document.getElementById("loading").style.display = "none";
	}
}

function update(){
	showLoading(1);
	tau.changePage("#loadingPage");
	
	var requestURL = 'https://husky1.azurewebsites.net/api/Patient';
	var request = new XMLHttpRequest();
	request.open('GET', requestURL);
	request.responseType = 'json';
	request.send();
	
	request.onload = function(){
		patientRecord = request.response;
		tau.changePage("#homepage");
		showLoading(0);
	};
}

function addScrollEvent() {
	
	var scrollEvent = function(){
		var scrollTop = document.getElementById("patientList").scrollTop;
	}
	document.getElementById("patientList").addEventListener("scroll", scrollEvent);
}

window.onload=init();