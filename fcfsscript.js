recalculateServiceTime();
var list = document.querySelectorAll(".priority-only");
for (var i = 0; i < list.length; i++) {
  list[i].style.display = "none";
}

document.onload = function () {
  document.$("#quantumParagraph").hide();
};

function addRow() {
  var lastRow = $("#inputTable tr:last");
  var lastRowNumebr = parseInt(lastRow.children()[1].innerText);

  var newRow =
    "<tr><td>P" +
    (lastRowNumebr + 1) +
    "</td><td>" +
    (lastRowNumebr + 1) +
    '</td><td><input class="exectime" type="number"/></td><td class="servtime"></td>' +
    '<td class="priority-only"><input type="text"/></td></tr>';

  lastRow.after(newRow);//inserts newrow after lastrow

  var minus = $("#minus");
  minus.show();

  $(".priority-only").hide();

  $("#inputTable tr:last input").change(function () {//gets executed when change detected
    recalculateServiceTime();
  });
}

function deleteRow() {
  var lastRow = $("#inputTable tr:last");
  lastRow.remove();

}

$(".initial").change(function () {//if inital values are changed
  recalculateServiceTime();
});

function recalculateServiceTime() {
  var inputTable = $("#inputTable tr");
  var totalExectuteTime = 0;

  $.each(inputTable, function (key, value) {//for iterating over each element
    if (key == 0) return true;
    $(value.children[3]).text(totalExectuteTime);

    var executeTime = parseInt($(value.children[2]).children().first().val());
    totalExectuteTime += executeTime;
  });
}


function animate() {
	$('fresh').prepend('<div id="curtain" style="position: absolute; right: 0; width:100%; height:100px;"></div>');
  
  $('#curtain').width($('#resultTable').width());
  $('#curtain').css({left: $('#resultTable').position().left});
  
  var sum = 0;
  $('.exectime').each(function() {
      sum += Number($(this).val());
  });
  
  console.log($('#resultTable').width());
  var distance = $("#curtain").css("width");
  
  animationStep(sum, 0);
  jQuery('#curtain').animate({ width: '0', marginLeft: distance}, sum*1000/2, 'linear');
}


function animationStep(steps, cur) {
	$('#timer').html(cur);
	if(cur < steps) {
		setTimeout(function(){ 
   	     animationStep(steps, cur + 1);
  	}, 500);
  }
  else {
  }
}


function draw() {
  $("fresh").html("");
  var inputTable = $("#inputTable tr");
  var th = "";
  var td = "";

  $.each(inputTable, function (key, value) {
    if (key == 0) return true;
    var executeTime = parseInt($(value.children[2]).children().first().val());
    th +=
      '<th style="height: 60px; width: ' +
      executeTime * 20 +
      'px;">P' +
      (key - 1) +
      "</th>";
      
    td += "<td>" + executeTime + "</td>";
  });

  $("fresh").html(
    '<table id="resultTable" class="table bg-secondary"><tr>' + th + "</tr><tr>" + td + "</tr></table>"
  );
  animate();
}


