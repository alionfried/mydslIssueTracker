//Status für aDIV
// 1 := onLoad / Ready  (Seite fertig gealden / Button Issue...
// 2 := optionCreateNewIssue
// 3 := btnChangeAssignee
// 4 := btnShow

var aDiv = [
  ['mainDiv'             , true, true, true,true],
  ['issueOverview'       , true, false, false,true],
  ['optionCreateNewIssue', false, true, false, false],
  ['changeIssueDiv'      , false, true, false, false],
  ['optionChangeAssignee', false, false, true, false]
];

function einAusblendenDIV(nStatus, nTime) {
    for (var i = 0; i < aDiv.length; i++) {
        var tmpDiv = "#" + aDiv[i][0];
        if (aDiv[i][nStatus]) {
            $(tmpDiv).show(nTime);
        } else {
            $(tmpDiv).hide(nTime);
        }
    }
}

//Hier muss mit der Datenbank gearbeitet werden
function checkpermission(personID,btnName) {
    //String Name der Person erhalten und dann über Datenbank abfragen, ob die Aktion durchgeführt werden darf
    
    return true;
}

$('#btnSelectChangeAssignee').change(function(){
    var sReturn = this.options(this.selectedIndex).value;
    $("#navRigth").text(sReturn);
});

$('#btnListCreateIssues').change(function(){
    var sReturn = this.options(this.selectedIndex).value;
    alert(sReturn);
    (loadIssueType(sReturn));
});

$("#aShow").click(function () {
    einAusblendenDIV(1, 1000);
});

$("#btnCreateNewIssue").click(function () {
    var navRigth = $("#navRigth");
	var personID = navRigth[0].text;
	var btnName = "btnChangeAssignee";	
    getReturn = (checkpermission(personID,btnName));    
    if (getReturn == true) {
        alert(getReturn);
        einAusblendenDIV(2, 3000);
    }
    else {
        alertNoPermission();
    }    
        	
});

function alertNoPermission(){
	alert("You don't have the permissions for this action.");
}

$('#btnChangeAssignee').click(function () {
	var navRigth = $("#navRigth");
	var personID = navRigth[0].text;
	var btnName = "btnChangeAssignee";	
    getReturn = (checkpermission(personID,btnName));
    
    if (getReturn == true) {
        alert(getReturn);
        einAusblendenDIV(3, 10);
    }
    else {
        alertNoPermission();
    }            
});

$('#btnSearchIssue').click(function () {
	var navRigth = $("#navRigth");
	var personID = navRigth[0].text;
	var btnName = "btnChangeAssignee";	
    getReturn = (checkpermission(personID,btnName));
    getReturn = false;
    if (getReturn == true) {
        alert(getReturn);
        //noch zu bauen
    }
    else {
        alertNoPermission();
    }            
});

$('#btnSubmit').click(function () {
    alert("abc");
});

function addPersons(){
	//add persons    
    $.get( "http://localhost:4567/getPersons", function( data ) {
    var persons = data.persons;
    for (var i = 0; i < persons.length; i++) {
    	var personid = persons[i].id;
    	var myOpt = '<option value=' + personid + ' >' + personid + '</option>';    	
		$("#btnSelectChangeAssignee").append(myOpt);	
    }
    var sReturn = $("#optionChangeAssignee option");    
    var length = sReturn.length;
    var selectedObject;
    var isSelected = false;

    var returnObjekt;
    var i = 0;
    while (isSelected == false && i < length) {        
        if (sReturn[i].selected == true) {
            isSelected = true;
            returnObjekt = sReturn[i];
        }
        i++;
    }
    selectedObject = returnObjekt.value;

    $("#navRigth").text(selectedObject);
    });
}

//start js
$(function () {
    einAusblendenDIV(1, 10);
    
    //add issuetypes
    $.get( "http://localhost:4567/getIssuetypes", function( data ) {
    var issues = data.issueTypes;
    for (var i = 0; i < issues.length; i++) {
    	var issuename = issues[i].typename;
    	var myOpt = '<option value=' + issuename + ' >' + issuename + '</option>';    	
		$("#btnListCreateIssues").append(myOpt);	
    }
    
   		var lReturn = getSelectedItemIssueTypes();
        alert(lReturn);   
    });

	addPersons();	 
});

function getSelectedItemIssueTypes(){
	 var sReturn;
    
        sReturn = $("#optionCreateNewIssue option");    
        var length = sReturn.length;
        var selectedObject;
        var isSelected = false;        

        var returnObjekt;
        var i = 0;
        while (isSelected == false && i < length) {            
                if (sReturn[i].selected == true) {
                    isSelected = true;
                    returnObjekt = sReturn[i];
                }
                i++;
        }
        selectedObject = returnObjekt.value;
		(loadIssueType(selectedObject));
		return selectedObject;		
}

function loadIssueType(div){	
	var tmpDiv = "individualInput.html #" + div;
	$("#changeIssueDiv").load(tmpDiv);
}