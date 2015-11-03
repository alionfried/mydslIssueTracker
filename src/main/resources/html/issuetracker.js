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
    
    //PersonID is null, when there is no person in db, so permission check doesn't work
    if(personID == "null"){
    	return true;
    }
    
    return true;
}

$('#btnSelectChangeAssignee').change(function(){
    var sReturn = this.options(this.selectedIndex).value;
    $("#navRigth").text(sReturn);
});

$('#btnListCreateIssues').change(function(){
    var sReturn = this.options(this.selectedIndex).value;    
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
        einAusblendenDIV(2, 1000);
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
        einAusblendenDIV(3, 1000);
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
    $.get( "http://localhost:4567/getPersonsFromDb", function( data ) {
    var persons = data;
    for (var i = 0; i < persons.length; i++) {
    	var personid = persons[i]._id.$oid;
		var surname = persons[i].surname;
		var forename = persons[i].forename;
		var personFullName = forename + " " + surname
    	var myOpt = '<option value=' + personid + ' >' + personFullName + '</option>';    	
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
}

function loadIssueType(div){	
	var tmpDiv = "individualInput.html #" + div;
	$("#changeIssueDiv").load(tmpDiv);
}