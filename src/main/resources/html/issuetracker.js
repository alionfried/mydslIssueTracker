//Status für aDIV
// 1 := onLoad / Ready  (Seite fertig gealden / Button Issue...
// 2 := optionCreateNewIssue
// 3 := btnChangeAssignee
// 4 := btnSearch
// 5 := alertSearch

var aDiv = [
  ['mainDiv'             , true, true, true, false, false],
  ['issueOverview'       , true, false, false, false, false],
  ['optionCreateNewIssue', false, true, false, false, false],
  ['changeIssueDiv'      , false, true, false, true, false],
  ['optionChangeAssignee', false, false, true, false, false]
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

//change Assignee
$('#btnSelectChangeAssignee').change(function(){  
	var sReturn = this.options[this.selectedIndex].text;
    $("#navRigth").text(sReturn);
});

//Change IssueType
$('#btnListCreateIssues').change(function(){
    var sReturn = this.options[this.selectedIndex].value;    
    (loadIssueTypeStandard(sReturn));
});

//issueTracker
$("#aShow").click(function () {
    einAusblendenDIV(1, 1000);
});

//Create New Issue
$("#btnCreateNewIssue").click(function () {
	var sOption = $("#optionChangeAssignee option");
	var actPerson;
	var findPersonRole;
	var findPerson = false;
	var i = 0;
	//Get person who wants to create
	while(i < sOption.length && findPerson == false){
		if(sOption[i].selected == true){
			actPerson = sOption[i];
			findperson = true;
		}
		i++;
	}
	
	//Get Persons
	$.get( "http://localhost:4567/getPersonsFromDb", function( data ) {
	    var n = 0;
	    var personGet = false;
		while(n < data.length && personGet == false){						
			if(data[n]._id.$oid == actPerson.value){				
				personGet = true;
				findPersonRole = data[n];
			}
			n++;
		}		
		
		//Check if he is allowed to create
		var permissionForCreateIssue = false;
		for(var z = 0; z < findPersonRole.roles.length; z++){
			if(findPersonRole.roles[z].openIssue != true){
				permissionForCreateIssue = false;
			}else{
				permissionForCreateIssue = true;
			}				
		}
		
		//to be sure that the issuetypes have default values
		var sReturn = $("#optionCreateNewIssue option");    
	    var length = sReturn.length;	    	    
	    if(length > 1){    	
	    	(loadIssueTypeStandard(sReturn[1].value));    	    	
	    	(loadIssueTypeStandard(sReturn[0].value));
	    }	   
			       
	    if (permissionForCreateIssue == true) {       
	        einAusblendenDIV(2, 1000);
	    }
	    else {
	        alertNoPermission();
	    }   
		
	});	
         	
});

//Search an Issue
function findIssue(){
	einAusblendenDIV(5, 10);
    var inputSearch = $("#inputSearchAutosuggest");
	var searchTxt = inputSearch[0].value;	
	sendSearch(searchTxt);
}

function alertNoPermission(){
	alert("You don't have the permissions for this action.");
}

$('#btnChangeAssignee').click(function () {	
        einAusblendenDIV(3, 1000);    
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
    },
    complete: function(data){        
        loadIssueType(data.responseJSON.issueType, data);        
    },
    error: function(data){        
    }
});
}

function sendSearchSuggest(searchTxt){
	$.ajax({
	    type:"POST",
	    url: "http://localhost:4567/searchSuggest",
	    data:searchTxt,
	    dataType: 'json',
	    success: function(data){
	        autocomplete(data);
	    },
	    error: function(data){
	    }
	});
}

$('#btnSearchIssue').click(function () {
    findIssue();  
});

//add Person to selectBox
function addPersons(){    
    $.get( "http://localhost:4567/getPersonsFromDb", function( data ) {
    var persons = data;
    for (var i = 0; i < persons.length; i++) {
    	var personid = persons[i]._id.$oid;
		var showname = persons[i].shownName;
    	var myOpt = '<option value=' + personid + ' >' + showname + '</option>';    	
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
    selectedObject = returnObjekt.text;

    $("#navRigth").text(selectedObject);
    });
}

$("body").on("submit", function(event){
		
	//check if status is another
    var json = $('#formSubmit').serializeJSON();
    if(json.status != json.selectStatus){    	
    	json.status = json.selectStatus;
    }
    
    var jsonString2 = JSON.stringify(json);
    
    //make dission for insert or update
	if(json._id == "null"){		
		sendJson(jsonString2,"submitIssue");
		location.reload();
	}
	else{						
		sendJson(jsonString2,"updateIssue");
		location.reload();
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
    
    //fill table with latest 10 issues
	$.get( "http://localhost:4567/getLatestIssues", function( data ){
		var issues = data;
		drawTable(issues);			
	});

	addPersons();	 
		
});

$('#inputSearchAutosuggest').on('input', function() { 
	sendSearchSuggest($(this).val()); // get the current value of the input field.
});


function autocomplete(issues){	
	var issuesAuto = [];
	
	for (var i = 0; i < issues.length; i++) {
		issuesAuto.push(issues[i].summary);
	}
	    $( "#inputSearchAutosuggest" ).autocomplete({
	      minLength: 0,
	      source: issuesAuto,
	      focus: function( event, ui ) {
	        $( "#inputSearchAutosuggest" ).val( ui.item.label );
	        return false;	        
	      },

	      select: function( event, ui ) {
	        $( "#inputSearchAutosuggest" ).val( ui.item.label );
	        findIssue();
	        return false;
	      }
	    }).autocomplete( "instance" )._renderItem = function( ul, item ) {
	      return $( "<li>" )
	        .append( "<a>" + item.label)
	        .appendTo( ul );
	    };
}

function drawTable(data) {
    for (var i = 0; i < data.length; i++) {
        drawRow(data[i]);    	
    }
}

function drawRow(rowData) {
    var row = $("<tr />")
    $("#personDataTable").append(row);
    row.append($("<td>" + rowData._id.$oid + "</td>"));
    row.append($("<td>" + rowData.issueType + "</td>"));
    row.append($("<td>" + rowData.status + "</td>"));
    row.append($("<td>" + rowData.summary + "</td>"));
}

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
	var findIssueInformation = data;
	var allowedToChangeIssue = false;
	var personFromDB;	
	var role; //Rollen einer Person
	var neededIssue; //issueType der betroffen ist
	var neededWorkflow; //issueType Workflow
	var neededTransistions = []; //issueType Transition
	
	var checkTransitions = [];
	
	var sOption = $("#optionChangeAssignee option");
	var actPerson;
	var findPersonRole;
	var roleTransition = [];	
	var findPerson = false;
	var i = 0;
	while(i < sOption.length && findPerson == false){
		if(sOption[i].selected == true){
			actPerson = sOption[i];
			findPerson = true;
		}
		i++;
	}
	
	//Get Transition from Person
	$.get( "http://localhost:4567/getPersonsFromDb", function( personData ) {
	    var n = 0;
	    var personGet = false;	    
		while(n < personData.length && personGet == false){						
			if(personData[n]._id.$oid == actPerson.value){				
				personGet = true;
				findPersonRole = personData[n];
			}
			n++;
		}
		
		var  tmprole = [];
		for(var z = 0; z < findPersonRole.roles.length; z++){
			tmprole.push(findPersonRole.roles[z]);							 
		}
		var tmpRoleTransition = [];
		for(var y = 0; y < tmprole.length; y++){
			for(var o = 0; o < tmprole[y].roleTransitions.length; o++){				
				if(tmprole[y].roleTransitions[o].from == findIssueInformation.responseJSON.status){					
					roleTransition.push(tmprole[y].roleTransitions[o].to);
				}																			
			}
		}			
		
		//Get possible Transition from IssueType
	    $.get( "http://localhost:4567/getIssueTypesFromDb", function( dataTypes ) {
	        var issueTypes = dataTypes;
	        for (var i = 0; i < issueTypes.length; i++) {
	        	if(issueTypes[i].issueType == findIssueInformation.responseJSON.issueType){
	        		neededWorkflow = issueTypes[i].workflow;	        		
	        	}	        		        	
	        }
	        for(var t = 0; t < neededWorkflow.workflowTransitions.length; t++){
	        	if(neededWorkflow.workflowTransitions[t].from == findIssueInformation.responseJSON.status){
	        		neededTransistions.push(neededWorkflow.workflowTransitions[t].to);
	        	}	        	 
	        }
	        	        
	        //Now check if there are permissions on both sides	        	        
	        for(var i = 0; i < neededTransistions.length; i++){
	        	for(var o = 0; o < roleTransition.length; o++){
	        		if(neededTransistions[i] == roleTransition[o]){
	        			checkTransitions.push(roleTransition[o]);
	        			allowedToChangeIssue = true;
	        		}
	        	}
	        }	
	
	if (allowedToChangeIssue == true) { 
	einAusblendenDIV(4, 10);	
	var tmpDiv = "individualInput.html #" + div;
	var aFields = $.map(data.responseJSON, function(value, key) { return key } );
	var aValues = $.map(data.responseJSON, function(value, key) { return value } );
	
	$("#changeIssueDiv").load(tmpDiv, function(){
		for(var i in aFields) {

			if(aFields[i] == '_id'){
				document.getElementById('_id').value = aValues[i].$oid;
			}else if(aFields[i] == 'selectStatus'){
				document.getElementById("selectStatus").remove(0);				
				var xy = document.createElement("OPTION");
			    xy.setAttribute("value", findIssueInformation.responseJSON.status);
			    var ty = document.createTextNode(findIssueInformation.responseJSON.status);
			    xy.appendChild(ty);
			    document.getElementById("selectStatus").appendChild(xy);
				for(var i = 0; i < checkTransitions.length; i++){
					var x = document.createElement("OPTION");
				    x.setAttribute("value", checkTransitions[i]);
				    var t = document.createTextNode(checkTransitions[i]);
				    x.appendChild(t);
				    document.getElementById("selectStatus").appendChild(x);					
				}				
			}
			else {
				if(aFields[i] != '_id'){
					document.getElementById(aFields[i]).value = aValues[i];	
				}				
			}
			
			//JSON-ID save
			if(aFields[i] == '_id'){ 
				document.getElementById('_id').value = aValues[i].$oid;
			}else {
				if(aFields[i] != '_id'){
					var tmpType = document.getElementById(aFields[i]).type; 
					//Selected-Field
					if(tmpType == 'select-one'){ 
						var tmpSelect = document.getElementById(aFields[i]);
						var length = document.getElementById(aFields[i]).length;
						var iOption = 0;
						while(iOption < length){							
							if (document.getElementById(aFields[i]).options[iOption].value == aValues[i]) {								
								document.getElementById(aFields[i]).options[iOption].selected = true;
							}
							iOption = iOption + 1;						
						}						
					}else if (tmpType == 'checkbox'){
						var tmpSel = document.getElementById(aFields[i]);
						document.getElementById(aFields[i]).checked = true; 
					}else {
						document.getElementById(aFields[i]).value = aValues[i];	
					}	
				}
			} 
		}			
	});	
	}else {
		einAusblendenDIV(1, 10);
        alertNoPermission();
    }	
	    });
	});	    		    
}

function loadIssueTypeStandard(div){
	var tmpDiv = "individualInput.html #" + div;
	$("#changeIssueDiv").load(tmpDiv);
}