recalculateServiceTime();
$(".priority-only").hide();

$(document).ready(function () {
  $("#quantumParagraph").hide();
  $(".servtime").show();

  recalculateServiceTime();
});

function addRow() {
  var lastRow = $("#inputTable tr:last");
  var lastRowNumebr = parseInt(lastRow.children()[1].innerText);

  var newRow =
    "<tr><td>P" +
    (lastRowNumebr + 1) +
    "</td><td>" +
    (lastRowNumebr + 1) +
    '</td><td><input class="exectime" type="number"/></td><td class="servtime"></td>' +
    //if ($('input[name=algorithm]:checked', '#algorithm').val() == "priority")
    '<td class="priority-only"><input type="text"/></td></tr>';

  lastRow.after(newRow);

  var minus = $("#minus");
  minus.show();

  $(".priority-only").hide();

  $("#inputTable tr:last input").change(function () {
    recalculateServiceTime();
  });
}

function deleteRow() {
  var lastRow = $("#inputTable tr:last");
  lastRow.remove();

  var minus = $("#minus");
 
}

$(".initial").change(function () {
  recalculateServiceTime();
});

function recalculateServiceTime() {
  var inputTable = $("#inputTable tr");
  var totalExectuteTime = 0;

  var exectuteTimes = [];
  $.each(inputTable, function (key, value) {
    if (key == 0) return true;
    exectuteTimes[key - 1] = parseInt(
      $(value.children[2]).children().first().val()
    );
  });//appends all the burst times to the array 

  var currentIndex = -1;
  for (var i = 0; i < exectuteTimes.length; i++) {
    currentIndex = findNextIndex(currentIndex, exectuteTimes);

    if (currentIndex == -1) return;

    $(inputTable[currentIndex + 1].children[3]).text(totalExectuteTime);

    totalExectuteTime += exectuteTimes[currentIndex];
  }
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
  $('fresh').html('');
  var inputTable = $('#inputTable tr');
  var th = '';
  var td = '';

    var executeTimes = [];

    $.each(inputTable, function (key, value) {
      if (key == 0) return true;
      var executeTime = parseInt($(value.children[2]).children().first().val());
      executeTimes[key - 1] = { "executeTime": executeTime, "P": key - 1 };
    });

    executeTimes.sort(function (a, b) {
      if (a.executeTime == b.executeTime)
        return a.P - b.P;
      return a.executeTime - b.executeTime
    });

    $.each(executeTimes, function (key, value) {
      th += '<th style="height: 60px; width: ' + value.executeTime * 20 + 'px;">P' + value.P + '</th>';
      td += '<td>' + value.executeTime + '</td>';
    });

    $('fresh').html('<table id="resultTable" class="table bg-secondary"><tr>'
                    + th
                    + '</tr><tr>'
                    + td
                    + '</tr></table>'
                   );

  animate();
}


function findNextIndex(currentIndex, array) {
    var currentTime = 0;
    if (currentIndex != -1) currentTime = array[currentIndex];            
    var resultTime = 1000000;
    var resultIndex = -1;
    var sameTime = false;
    var areWeThereYet = false;
  
    $.each(array, function (key, value) {
      var changeInThisIteration = false;
  
      if (key == currentIndex) {
        areWeThereYet = true;
        return true;
      }
      if (value >= currentTime && value <= resultTime) {
        if (value == resultTime) {                        
          if (currentTime == value && !sameTime) {
            sameTime = true;
            changeInThisIteration = true;
            resultTime = value;
            resultIndex = key;                            
          }                        
        }
        else if (value == currentTime) {
          if (areWeThereYet) {
            sameTime = true;
            areWeThereYet = false;
            changeInThisIteration = true;
            resultTime = value;
            resultIndex = key;
          }
        }
        else {
          resultTime = value;
          resultIndex = key;
        }
  
        if (value < resultTime && !changeInThisIteration)
          sameTime = false;
      }
    });
    return resultIndex;
  }
  
