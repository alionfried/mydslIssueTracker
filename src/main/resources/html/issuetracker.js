//Status für aDIV
// 1 := onLoad / Ready  (Seite fertig gealden / Button Issue...
// 2 := optionCreateNewIssue
// 3 := btnChangeAssignee
// 4 := btnShow

var aDiv = [
  ['mainDiv'             , true, true, true,true],
  ['issueOverview'       , true, false, false,true],
  ['optionCreateNewIssue', false, true, false, false],
  ['secondDiv'           , false, true, false, false],
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
function checkpermission(personname) {
    //String Name der Person erhalten und dann über Datenbank abfragen, ob die Aktion durchgeführt werden darf
    return true;
}

//$('#btnListCreateIssues').click(function(){
//    var sReturn = this.value;    
//    alert(sReturn);
//});

$('#btnSelectChangeAssignee').change(function(){
    var sReturn = this.options(this.selectedIndex).value;
    $("#navRigth").text("Signed in as: " + sReturn);
});

function selectedItem() {
    //var sReturn = this.options(this.selectedIndex).value;
    var sReturn = $(".selectpicker").change(function () {

        var sReturn = this.options(this.selectedIndex).value;

        alert(sReturn);

    });

    alert(sReturn);

}

$("#btnHide").click(function () {    
    einAusblendenDIV(3, 100);
});

$("#btnShow").click(function () {
    einAusblendenDIV(4, 300);
});

$("#aShow").click(function () {
    einAusblendenDIV(1, 1000);
});

$("#btnCreateNewIssue").click(function () {
    einAusblendenDIV(2, 3000);
        alert("abc");
	$.get( "http://localhost:4567/getIssuetypes", function( data ) {
  	alert( "Data Loaded: " + data );
  	var issueTypes = data.issueTypes;  
	});
	
});

$("#btnCreateIssue").click(function () {    
    getReturn = (checkpermission("alli"));
    
    var sReturn;
    //selectedItem();
    //$("#optionCreateNewIssue option").each(function () {
        sReturn = $("#optionCreateNewIssue option");//$(this).options($(this).selectedIndex).value;
        //var abc = sReturn.options(sReturn.selectedIndex).value;
        var length = sReturn.length;
        var selectedObject;
        var isSelected = false;

        var returnObjekt;
        var i = 0;
        while (isSelected == false && i < length) {
            //for (var i = 0; i < length; i++) {
                if (sReturn[i].selected == true) {
                    isSelected = true;
                    returnObjekt = sReturn[i];
                }
                i++;
            //}
        }
        selectedObject = returnObjekt.value;
        alert(selectedObject);        
        
    //});

    if (getReturn == true) {
        alert(getReturn);
    }
    else {
        alert("Sie haben nicht die Berechtigung diese Aktion durchzufuehren.");
    }
});

$("#btnCreateIssue").click(function () {
	$("#changeIssueDiv").load("test.html #change");
	
});

$('#btnChangeAssignee').click(function () {
    einAusblendenDIV(3, 10);
});

$("#btnCreateIssue").click(function () {
    $("#standardInputDiv").load("standardInput.html");

});

$(function () {
    einAusblendenDIV(1, 10);

    var sReturn = $("#optionChangeAssignee option");//$(this).options($(this).selectedIndex).value;
    //var abc = sReturn.options(sReturn.selectedIndex).value;
    var length = sReturn.length;
    var selectedObject;
    var isSelected = false;

    var returnObjekt;
    var i = 0;
    while (isSelected == false && i < length) {
        //for (var i = 0; i < length; i++) {
        if (sReturn[i].selected == true) {
            isSelected = true;
            returnObjekt = sReturn[i];
        }
        i++;
        //}
    }
    selectedObject = returnObjekt.value;

    $("#navRigth").text("Signed in as: " + selectedObject);
});