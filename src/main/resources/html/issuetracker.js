//Status f�r aDIV
// 1 := onLoad / Ready  (Seite fertig gealden / Button Issue...
// 2 := optionCreateNewIssue
// 3 := btnHide
// 4 := btnShow

var aDiv = [
  ['mainDiv'             , true, true, false,true],
  ['issueOverview'       , true, false, false,true],
  ['optionCreateNewIssue', false, true, false,true]
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

//$('#btnListCreateIssues').click(function(){
//    var sReturn = this.value;    
//    alert(sReturn);
//});

$(".selectpicker").change(function () {

    var sReturn = this.options(this.selectedIndex).value;

    alert(sReturn);

});

function selectedItem() {
    var sReturn = this.options(this.selectedIndex).value;

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
    $(".jumbotron").load("test.html");
});

$(function () {
    einAusblendenDIV(1,10);
});