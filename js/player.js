"use strict";
class Player {
  constructor(name) {
    this.name = name;
    this.cash = 0;
    this.childCost = 0;
    this.childCount = 0;
    this.totalIncoming = 0;
    this.totalOutcoming = 0;
    this.totalHouse = 0;
    this.totalCompany = 0;
    this.totalStock = 0;
    this.totalCoin = 0;
    this.salary = 0;
    this.totalInvestmentIncoming = 0;
    this.allInvestments = [];
  }
};

function player_appendInvestment(player, investment) {
  if (player.allInvestments == null) {
    player.allInvestments = [];
  }
  player.allInvestments.push(investment);
  player.cash -= investment.downPayment;
  player.totalIncoming += investment.incoming;
  player.totalInvestmentIncoming += investment.incoming;
  var investmentType = investment.type;
  if (investmentType == "house") {
    player.totalHouse++;
  } else if (investmentType == "stock") {
    player.totalStock++;
  } else if (investmentType == "company") {
    player.totalCompany++;
  } else if (investmentType == "coin") {
    player.totalCoin++;
  }
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

function createTrPlayerSummary(player) {
  return "<tr><td>" + player.name
    + "</td><td>" + player.cash
    + "</td><td>" + player.totalIncoming
    + "</td><td>" + player.totalOutcoming
    + "</td><td>" + player.totalInvestmentIncoming
    + "</td><td class='showInvestments'>" + player.totalHouse
    + "</td><td class='showInvestments'>" + player.totalCompany
    + "</td><td class='showInvestments'>" + player.totalStock
    + "</td><td><input type='button' class='delPlayer' value='x'/>"
    + "<input type='button' class='monthCash' value='月结'/>"
    + "<input type='button' class='buyInvestment' value='买'/>"
    + "</td></tr>"
}

function showAllPlayers(allPlayers) {
  $("#summaryTable tr:gt(0)").remove();
  for (var i = 0; i <allPlayers.length; i++) {
    $("#summaryTable  tr:last").after(createTrPlayerSummary(allPlayers[i]));
  }
  $(".delPlayer").click(deletePlayerAction);
  $(".monthCash").click(monthCashPlayerAction);
  $(".buyInvestment").click(buyInvestmentAction);
  $(".showInvestments").click(showInvestmentsAction);
}

function openNewPlayerDialog() {
  $("#newPlayerName").val("");
  $("#newPlayerCash").val("");
  $("#newPlayerSalary").val("");
  $("#newPlayerChildCost").val("");
  player_newPlayerDialog.dialog( "open" );
}

function newPlayer(event) {
  var player = new Player($("#newPlayerName").val());
  player.cash = parseInt($("#newPlayerCash").val());
  player.salary = parseInt($("#newPlayerSalary").val());
  player.childCost = parseInt($("#newPlayerChildCost").val());
  player.totalIncoming = player.salary;
  player.totalOutcoming = parseInt($("#newPlayerTotalOutcoming").val());

  var allPlayers = loadAllPlayers();
  allPlayers.push(player);
  saveAllPlayers(allPlayers);
  player_newPlayerDialog.dialog("close");
  showAllPlayers(allPlayers);
}

var player_newPlayerDialog = null;
function player_initUI() {
  $("#btnNewPlayer").click(openNewPlayerDialog);
  player_newPlayerDialog = $("#divNewPlayer").dialog({
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
        click: function(){player_newPlayerDialog.dialog("close");}
      }
    ],
    show: { effect: "blind", duration: 100 },
    // height: 400,
    width: 350,
    modal: true});
  $("#newPlayerCash").spinner();
  $("#newPlayerSalary").spinner();
  $("#newPlayerChildCost").spinner();
}
