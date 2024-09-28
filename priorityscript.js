recalculateServiceTime();

$(document).ready(function () {
    $(".priority-only").show();
    $(".servtime").show();
    $("#quantumParagraph").hide();
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
    '<td class="priority-only"><input type="text"/></td></tr>';

  lastRow.after(newRow);

  var minus = $("#minus");
  minus.show();

  $("#inputTable tr:last input").change(function () {
    recalculateServiceTime();
  });
}

function deleteRow() {
  var lastRow = $("#inputTable tr:last");
  lastRow.remove();
}

$(".initial").change(function () {
  recalculateServiceTime();
});

function recalculateServiceTime() {
  var inputTable = $("#inputTable tr");
  var totalExectuteTime = 0;

  var exectuteTimes = [];
  var priorities = [];

  $.each(inputTable, function (key, value) {
    if (key == 0) return true;
    exectuteTimes[key - 1] = parseInt(
      $(value.children[2]).children().first().val()
    );
    priorities[key - 1] = parseInt(
      $(value.children[4]).children().first().val()
    );
    console.log(key , value);
  });

  var currentIndex = -1;
  for (var i = 0; i < exectuteTimes.length; i++) {
    currentIndex = findNextIndexWithPriority(currentIndex, priorities);

    if (currentIndex == -1) return;

    $(inputTable[currentIndex + 1].children[3]).text(totalExectuteTime);

    totalExectuteTime += exectuteTimes[currentIndex];
  }
}

function findNextIndexWithPriority(currentIndex, priorities) {
  var currentPriority = 1000000;
  if (currentIndex != -1) currentPriority = priorities[currentIndex];
  var resultPriority = 0;
  var resultIndex = -1;
  var samePriority = false;
  var areWeThereYet = false;

  $.each(priorities, function (key, value) {
    var changeInThisIteration = false;

    if (key == currentIndex) {
      areWeThereYet = true;
      return true;
    }
    if (value <= currentPriority && value >= resultPriority) {
      if (value == resultPriority) {
        if (currentPriority == value && !samePriority) {
          samePriority = true;
          changeInThisIteration = true;
          resultPriority = value;
          resultIndex = key;
        }
      } else if (value == currentPriority) {
        if (areWeThereYet) {
          samePriority = true;
          areWeThereYet = false;
          changeInThisIteration = true;
          resultPriority = value;
          resultIndex = key;
        }
      } else {
        resultPriority = value;
        resultIndex = key;
      }

      if (value > resultPriority && !changeInThisIteration)
        samePriority = false;
    }
  });
  return resultIndex;
}

function animate() {
  $("fresh").prepend(
    '<div id="curtain" style="position: absolute; right: 0; width:100%; height:100px;"></div>'
  );

  $("#curtain").width($("#resultTable").width());
  $("#curtain").css({ left: $("#resultTable").position().left });

  var sum = 0;
  $(".exectime").each(function () {
    sum += Number($(this).val());
  });

  console.log($("#resultTable").width());
  var distance = $("#curtain").css("width");

  animationStep(sum, 0);
  jQuery("#curtain").animate(
    { width: "0", marginLeft: distance },
    (sum * 1000) / 2,
    "linear"
  );
}

function animationStep(steps, cur) {
  $("#timer").html(cur);
  if (cur < steps) {
    setTimeout(function () {
      animationStep(steps, cur + 1);
    }, 500);
  } else {
  }
}

function draw() {
  $("fresh").html("");
  var inputTable = $("#inputTable tr");
  var th = "";
  var td = "";
  var executeTimes = [];

  $.each(inputTable, function (key, value) {
    if (key == 0) return true;
    var executeTime = parseInt($(value.children[2]).children().first().val());
    var priority = parseInt($(value.children[4]).children().first().val());
    executeTimes[key - 1] = {
      executeTime: executeTime,
      P: key - 1,
      priority: priority,
    };
  });

  executeTimes.sort(function (a, b) {
    if (a.priority == b.priority) return a.P - b.P;
    return b.priority - a.priority;
  });

  $.each(executeTimes, function (key, value) {
    th +=
      '<th style="height: 60px; width: ' +
      value.executeTime * 20 +
      'px;">P' +
      value.P +
      "</th>";
    td += "<td>" + value.executeTime + "</td>";
  });

  $("fresh").html(
    '<table class="table bg-secondary" id="resultTable" style="width: 70%"><tr>' +
      th +
      "</tr><tr>" +
      td +
      "</tr></table>"
  );
  animate();
}
