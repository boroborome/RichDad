"use strict";
class Player {
  constructor(name) {
    this.name = name;
    this.cash = 0;
    this.childCost = 0;
    this.totalIncoming = 0;
    this.totalOutcoming = 0;
    this.totalHouse = 0;
    this.totalCompany = 0;
    this.totalStock = 0;
    this.salary = 0;
    this.totalInvestmentIncoming = 0;
    this.allInvestements = [];
    this.totalInvestmentIncoming = 0;
  }
};

class Investment {
  constructor(type, description) {
    this.type = type;
    this.description = description;
    this.price = 0;
    this.count = 0;
    this.downPayment = 0;
    this.loans = 0;
    this.incoming = 0;
  }
  totalPrice () {
    return this.price * this.count;
  }
};


function prefixInteger(num, length) {
  return (Array(length).join('0') + num).slice(-length);
}

function addExp(a, b) {
  return a + "+" + b;
}
function delExp(a, b) {
  if (a < b) {
    var t = a;
    a = b;
    b = t;
  }
  return a + "-" + b;
}

function createStatusInfo() {
  var status = new Object();
  status.startTime = new Date();
  status.endTime = null;
  status.rightQuestions = [];
  status.wrongQuestions = [];
  status.currentExpression = null;
  return status;
}
var currentStatus = createStatusInfo();

function randomExpression() {
  var range = document.getElementById("range");
  var r = range.value;
  var a = Math.floor((Math.random()*r));
  var b = Math.floor((Math.random()*r));
  var opv = Math.floor((Math.random()*2));
  var operationExp = (opv >= 1) ? delExp : addExp;
  return operationExp(a, b);
}

function isDistinctExpression(expression, status) {
  return !$.inArray(expression, status.rightQuestions)
    && !$.inArray(expression, status.wrongQuestions);
}

function distinctRandomExpression(status) {
  var tryTime = 10;
  var expression = null;
  while (true) {
    var expression = randomExpression();
    if (tryTime < 0 || isDistinctExpression(expression, status)) {
      break;
    }
    tryTime--;
  }
  return expression;
}

function changeExpression() {
  currentStatus.currentExpression = distinctRandomExpression(currentStatus);
  $("#expression").html(currentStatus.currentExpression);
  var totalNum = currentStatus.rightQuestions.length + currentStatus.wrongQuestions.length + 1;
  $("#txtQuestionNum").html("第" + totalNum + "题");
}

function startPractice(event) {
  statusDialog.dialog( "close" );
  currentStatus = createStatusInfo();
  changeExpression();
}

function rightAnswer(event) {
  statusDialog.dialog( "close" );
  currentStatus.rightQuestions.push(currentStatus.currentExpression);
  changeExpression();
}

function wrongAnswer(event) {
  statusDialog.dialog( "close" );
  currentStatus.wrongQuestions.push(currentStatus.currentExpression);
  changeExpression();
}

function calculateExpendTime(status) {
  var milliseconds = parseInt(status.endTime.getTime() - status.startTime.getTime());
  var millisecondsInHour = 1000*60*60;
  var hour = parseInt(milliseconds/millisecondsInHour);
  milliseconds = milliseconds - hour * millisecondsInHour;

  var millisecondsInMinus = 1000*60;
  var minus = parseInt(milliseconds/millisecondsInMinus);
  milliseconds = milliseconds - minus * millisecondsInMinus;

  var millisecondsInSecond = 1000;
  var second = parseInt(milliseconds/millisecondsInSecond);
  milliseconds = milliseconds - second * millisecondsInSecond;

  var timeExpend = prefixInteger(hour, 2) + ":"
    + prefixInteger(minus, 2) + ":"
    + prefixInteger(second, 2) + "."
    + prefixInteger(milliseconds, 3);
  return timeExpend;
}

function arrayToString(array) {
  var result = "";
  for(var i in array){
    result = result + array[i] + "<br>";
  }
  return result;
}

function endPractice(event) {
  currentStatus.endTime = new Date();

  $("#txtTitleRight").html("作对" + currentStatus.rightQuestions.length + "题");
  $("#txtTitleWrong").html("作错" + currentStatus.wrongQuestions.length + "题");
  $("#txtAllRightQuestions").html(arrayToString(currentStatus.rightQuestions));
  $("#txtAllWrongQuestions").html(arrayToString(currentStatus.wrongQuestions));
  $("#timeExpend").html("耗时： " + calculateExpendTime(currentStatus));

  statusDialog.dialog( "open" );
}

function openNewPlayerDialog() {
  $("#newPlayerName").val("");
  $("#newPlayerCash").val("");
  $("#newPlayerSalary").val("");
  $("#newPlayerChildCost").val("");
  newPlayerDialog.dialog( "open" );
}
function newPlayer(event) {
  var player = new Player($("#newPlayerName").val());
  player.cash = $("#newPlayerCash").val();
  player.salary = $("#newPlayerSalary").val();
  player.childCost = $("#newPlayerChildCost").val();
  var allPlayers = loadAllPlayers();
  allPlayers.push(player);
  saveAllPlayers(allPlayers);
  newPlayerDialog.dialog("close");
  showAllPlayers(allPlayers);
}

function findPlayer(playerName, allPlayers) {
  for (var i = 0; i < allPlayers.length; i++) {
    if (allPlayers[i].name == playerName) {
      return allPlayers[i];
    }
  }
  return null;
}

function deletePlayer(playerName) {
  var allPlayers = loadAllPlayers();
  for (var i = 0; i < allPlayers.length; i++) {
    if (allPlayers[i].name == playerName) {
      allPlayers.splice(i, 1);
      break;
    }
  }
  saveAllPlayers(allPlayers);
  showAllPlayers(allPlayers);
}

function showAllPlayers(allPlayers) {
  $("#summaryTable tr:gt(0)").remove();
  for (var i = 0; i <allPlayers.length; i++) {
    $("#summaryTable  tr:last").after(createTrPlayerSummary(allPlayers[i]));
  }
  $(".delPlayer").click(deletePlayerAction);
  $(".monthCash").click(monthCashPlayerAction);
}

function deletePlayerAction(event) {
  var name = event.target.parentElement.parentElement.firstChild.innerText;
  if (confirm("确认删除玩家(" + name + ")吗？")) {
    deletePlayer(name);
  }
}

function monthCashPlayerAction(event) {
  var name = event.target.parentElement.parentElement.firstChild.innerText;
  if (confirm("确认给玩家(" + name + ")结算？")) {
    monthCashPlayer(name);
  }
}

function monthCashPlayer(name) {
  var allPlayers = loadAllPlayers();
  var player = findPlayer(name, allPlayers);
  player.cash = player.cash + player.totalIncoming - player.totalOutcoming;
  showAllPlayers(allPlayers);
}

function createTrPlayerSummary(player) {
  return "<tr><td>" + player.name
    + "</td><td>" + player.cash
    + "</td><td>" + player.totalIncoming
    + "</td><td>" + player.totalOutcoming
    + "</td><td>" + player.totalInvestmentIncoming
    + "</td><td>" + player.totalHouse
    + "</td><td>" + player.totalCompany
    + "</td><td>" + player.totalStock
    + "</td><td><input type='button' class='delPlayer' value='x'/>"
    + "<input type='button' class='monthCash' value='月结'/>"
    + "</td></tr>"
}

function loadAllPlayers() {
  var json = localStorage.getItem("players");
  if (json == null) {
    json = [];
  }
  return JSON.parse(json);
}
function saveAllPlayers(allPlayers) {
  localStorage.setItem("players", JSON.stringify(allPlayers));
}
var newPlayerDialog = null;
var statusDialog = null;
function initUI() {
  $("#btnNewPlayer").click(openNewPlayerDialog);
  newPlayerDialog = $("#divNewPlayer").dialog({
    autoOpen: false,
    buttons: [
      {
        text: "OK",
        icon: "ui-icon-check",
        click: newPlayer
      },
      {
        text: "Cancel",
        icon: "ui-icon-closethick",
        click: function(){newPlayerDialog.dialog("close");}
      }
    ],
    show: { effect: "blind", duration: 100 },
    // height: 400,
    // width: 350,
    modal: true});
  $("#btnStartPractice").click(startPractice);
  $("#btnRight").click(rightAnswer);
  $("#btnWrong").click(wrongAnswer);
  $("#btnEndPractice").click(endPractice);

  statusDialog = $("#divStatus").dialog({
    autoOpen: false,
    show: { effect: "blind", duration: 100 },
    // height: 400,
    // width: 350,
    modal: false
  });
  startPractice();
  var allPlayers = loadAllPlayers();
  showAllPlayers(allPlayers);
}
