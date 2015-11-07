//Status für aDIV
// 1 := onLoad / Ready  (Seite fertig gealden / Button Issue...
// 2 := optionCreateNewIssue
// 3 := btnChangeAssignee
// 4 := btnSearch

var aDiv = [
  ['mainDiv'             , true, true, true,false],
  ['issueOverview'       , true, false, false,false],
  ['optionCreateNewIssue', false, true, false, false],
  ['changeIssueDiv'      , false, true, false, true],
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
	var sReturn = this.options[this.selectedIndex].text;
    $("#navRigth").text(sReturn);
});

$('#btnListCreateIssues').change(function(){
    var sReturn = this.options[this.selectedIndex].value;    
    (loadIssueTypeStandard(sReturn));
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

function sendJson(json, target){
$.ajax
    ({
        type: "POST",
        //the url where you want to sent the userName and password to
        url: 'http://localhost:4567/'+ target,
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
        console.log("data:" + data.issueType);        
    },
    complete: function(data){
        console.log("JSON Load OK");
        loadIssueType(data.responseJSON.issueType, data);        
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
    
    einAusblendenDIV(4, 10);
    var inputSearch = $("#inputSearch");
	var searchTxt = inputSearch[0].value;	
	sendSearch(searchTxt);  
	$("#statusField").text("defghi");
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
		
	if(json._id == "null"){
		alert('neuanlage');
		sendJson(jsonString2,"submitIssue");
		//sendJson(jsonString2,"updateIssue");
	}
	else{
//		event.preventDefault();
		alert('update')
		sendJson(jsonString2,"updateIssue");
		//alert("update funktion muss hier implementiert werden, der json string steht schon zur verfügung");
	}
	
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
		(loadIssueTypeStandard(selectedObject));		
}

function loadIssueType(div, data){	
	var tmpDiv = "individualInput.html #" + div;
	var aFields = $.map(data.responseJSON, function(value, key) { return key } );
	var aValues = $.map(data.responseJSON, function(value, key) { return value } );
	
	$("#changeIssueDiv").load(tmpDiv, function(){
		for(var i in aFields) {
			if(aFields[i] == '_id'){
				document.getElementById('_id').value = aValues[i].$oid;
			} else {
				if(aFields[i] != '_id'){
					document.getElementById(aFields[i]).value = aValues[i];	
				}
			}			
		}
	});
}

function loadIssueTypeStandard(div){
	var tmpDiv = "individualInput.html #" + div;
	$("#changeIssueDiv").load(tmpDiv);
}