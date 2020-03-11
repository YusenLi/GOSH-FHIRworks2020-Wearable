var detailAtt = ["Family Name", //0
                 "Given Name", //1
                 "Medical Record Number", //2
                 "Social Security Number", //3
                 "Driver's License", //4
                 "Passport Number", //5
                 "Home Phone Number", //6
                 "Gender", //7
                 "Birthdate", //8
                 "Deceased Datetime", //9
                 "Address", //10
                 "Marital Status", //11
                 "Language" //12
                 ]; 

var patientNames;

var patientRecord = {};

var detailVal;

function init(){
	updateTime();
	updateLetterSelector();
	updatePatientList('A');
	addScrollEvent();
}

function getPatientDetail(i, j){
	detailVal = new Array();
	var res = patientRecord[i].entry[j].resource;
	detailVal[0] = res.name[0].family;
	detailVal[1] = res.name[0].given[0];
	for(var k = 1; k < 5; k++){
		if(res.identifier[k] == undefined){
			detailVal[k+1] = null;
		}
		else{detailVal[k+1] = res.identifier[k].value;}
	}
	detailVal[6] = res.telecom[0].value;
	detailVal[7] = res.gender;
	detailVal[8] = res.birthDate;
	detailVal[9] = res.deceasedDateTime;
	detailVal[10] = res.address[0].line[0] + ", " + res.address[0].city + ", " + res.address[0].state + ", " + res.address[0].country;
	var maritalCode = res.maritalStatus.coding[0].code;
	detailVal[11] = getMartialStatus(maritalCode);
	detailVal[12] = res.communication[0].language.text;
}

function getMartialStatus(code){
	switch(code){
	case 'S':
		return "Never Married"
	case 'M':
		return "Married"
	}
}

function updatePatientDetail(){
	var container = document.getElementById("detail");
	var top = "27.5vw";
	container.innerHTML = "";
	var length=detailAtt.length;
	for(var i=0; i<length;i++){
		if(detailVal[i] == null){
			continue;
		}
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
		var listTop = document.getElementById("patientList").scrollTop;
		var detailTop = document.getElementById("detail").scrollTop;
		if(listTop>10) {
			document.getElementById("listTime").style.visibility="hidden";
		}else{
			document.getElementById("listTime").style.visibility="visible";
		}
		if(detailTop>10) {
			document.getElementById("detailTime").style.visibility="hidden";
		}else{
			document.getElementById("detailTime").style.visibility="visible";
		}
	}
	document.getElementById("patientList").addEventListener("scroll", scrollEvent);
	document.getElementById("detail").addEventListener("scroll", scrollEvent);
}

setInterval(updateTime,1000);

function updateTime(){
	 var datetime = tizen.time.getCurrentDateTime(),
     hour = datetime.getHours(),
     minute = datetime.getMinutes();
	 var clock = document.getElementsByClassName("time");
	 for(var i = 0;i < clock.length; i++){
		 clock[i].innerHTML = hour + ":" + minute;
	 }
}

window.onload=init();