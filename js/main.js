"use strict";
class Player {
  constructor(name) {
    this.name = name;
    this.cash = 0;
    this.totalIncoming = 0;
    this.totalOutcoming = 0;
    this.totalHouse = 0;
    this.totalCompany = 0;
    this.totalStock = 0;
    this.salary = 0；
    this.totalInvestmentIncoming = 0;
    this.allInvestements = [];
  }
  totalInvestmentIncoming() {
    return this.totalIncoming - this.salary;
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
}


new Player().say();
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

var statusDialog = null;
function initUI() {
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
}
