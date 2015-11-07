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
    //var sReturn = this.options(this.selectedIndex).value;
	var sReturn = this.options(this.selectedIndex).text;
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

function sendJson(json){
$.ajax
    ({
        type: "POST",
        //the url where you want to sent the userName and password to
        url: 'http://localhost:4567/submitIssue',
        dataType: 'json',
        async: false,
        //json object to sent to the authentication url
        data: json,
        success: function () {

        alert("Thanks!"); 
        }
    })
}

function sendSearch(searchTxt){
$.ajax({
    type:"POST",
    url: "http://localhost:4567/search",
    data:searchTxt,
    dataType: 'json',
    success: function(data){
        console.log("data:" + data.status);
    },
    error: function(data){
        console.log("error");
    }
});

}

$('#btnSearchIssue').click(function () {
	var navRigth = $("#navRigth");
	var personID = navRigth[0].text;
	var btnName = "btnChangeAssignee";	
    getReturn = (checkpermission(personID,btnName));
    //getReturn = false;
       
    var inputSearch = $("#inputSearch");
	var searchTxt = inputSearch[0].value;
	sendSearch(searchTxt);  
});

function addPersons(){
	//add persons    
    $.get( "http://localhost:4567/getPersonsFromDb", function( data ) {
    var persons = data;
    for (var i = 0; i < persons.length; i++) {
    	var personid = persons[i]._id.$oid;
		var surname = persons[i].surname;
		var forename = persons[i].forename;
		var personFullName = forename + " " + surname;
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
    //selectedObject = returnObjekt.value;
    selectedObject = returnObjekt.text;

    $("#navRigth").text(selectedObject);
    });
}

$("body").on("submit", function(event){
	//var targetInformations = event.target;
	//var formData = $(this).serializeObject();
    //console.log($('#formSubmit').serializeArray());
	
    var json = $('#formSubmit').serializeJSON();
    var jsonString2 = JSON.stringify(json);
    //console.log(json);
    
	var navRigth = $("#navRigth");
	var personID = navRigth[0].text;
	var btnName = "btnChangeAssignee";	
    getReturn = (checkpermission(personID,btnName));
    //getReturn = false;
    if (getReturn == true) {        
	
	alert( "Handler for .submit() called." );
		
	sendJson(jsonString2);
        //noch zu bauen
    }
    else {
    	event.preventDefault();
        alertNoPermission();
    }   	
});

//start js
$(function () {
    einAusblendenDIV(1, 10); 
    
    //add issuetypes
    $.get( "http://localhost:4567/getIssueTypesFromDb", function( data ) {
    var issueTypes = data;
    for (var i = 0; i < issueTypes.length; i++) {
    	var issueType = issueTypes[i].issueType;
    	var myOpt = '<option value=' + issueType + ' >' + issueType + '</option>';    	
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
