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
    + "</td><td>" + player.salary
    + "</td><td>" + player.totalInvestmentIncoming
    + "</td><td>" + player.totalIncoming
    + "</td><td>" + player.childCount
    + "</td><td>" + player.childCost
    + "</td><td>" + player.totalOutcoming
    + "</td><td class='showInvestments'>" + player.totalHouse
    + "</td><td class='showInvestments'>" + player.totalCompany
    + "</td><td class='showInvestments'>" + player.totalStock
    + "</td><td class='showInvestments'>" + player.totalCoin
    + "</td><td><input type='button' class='delPlayer' value='x'/>"
    + "<input type='button' class='monthCash' value='月结'/>"
    + "<input type='button' class='buyInvestment' value='买'/>"
    + "<input type='button' class='extalChange' value='额外'/>"
    + "</td></tr>"
}

function showAllPlayers(allPlayers) {
  $("#summaryTable tr:gt(0)").remove();
  for (var i = 0; i <allPlayers.length; i++) {
    $("#summaryTable  tr:last").after(createTrPlayerSummary(allPlayers[i]));
  }
  $(".showInvestments").click(showInvestmentsAction);
  $(".delPlayer").click(deletePlayerAction);
  $(".monthCash").click(monthCashPlayerAction);
  $(".buyInvestment").click(buyInvestmentAction);
  $(".extalChange").click(player_extal_change_action);
}

function player_extal_change_action(event) {
  var name = event.target.parentElement.parentElement.firstChild.innerText;
  $("#player_extral_change_name").text(name);
  $("#player_extral_change_cash").spinner().spinner("value", 0);
  $("#player_extral_change_outcoming").spinner().spinner("value", 0);
  $("#player_extral_change_child").spinner().spinner("value", 0);

  player_dialog_extral_change.dialog("open");
}

function openNewPlayerDialog() {
  $("#newPlayerName").val("");
  $("#newPlayerCash").val("");
  $("#newPlayerSalary").val("");
  $("#newPlayerChildCost").val("");
  player_dialog_new.dialog( "open" );
}

function newPlayer(event) {
  var player = new Player($("#newPlayerName").val());
  player.cash = parseInt($("#newPlayerCash").val());
  player.salary = parseInt($("#newPlayerSalary").val());
  player.childCost = parseInt($("#newPlayerChildCost").val());
  player.totalIncoming = player.salary;
  player.totalOutcoming = parseInt($("#newPlayerTotalOutcoming").val());

  var allPlayers = game.allPlayers;
  allPlayers.push(player);
  saveAllPlayers(allPlayers);
  player_dialog_new.dialog("close");
  showAllPlayers(allPlayers);
}

function player_dialog_extral_change_ok_action() {
  var name = $("#player_extral_change_name").text();
  var player = getPlayer(name);

  player.cash -= $("#player_extral_change_cash").spinner().spinner("value");
  var outcoming = $("#player_extral_change_outcoming").spinner().spinner("value");

  var childCount = $("#player_extral_change_child").spinner().spinner("value");
  player.childCount += childCount;
  outcoming += (childCount * player.childCost);

  player.totalOutcoming += outcoming;
  saveAllPlayers(game.allPlayers);
  showAllPlayers(game.allPlayers);
  player_dialog_extral_change.dialog("close");
}

var player_dialog_new = null;
var player_dialog_extral_change = null;
function player_initUI() {
  player_dialog_new = player_init_new_dialog();
  player_dialog_extral_change = player_init_extral_change_dialog();
}

function player_init_extral_change_dialog() {
  $("#player_extral_change_cash").spinner();
  $("#player_extral_change_outcoming").spinner();
  $("#player_extral_change_child").spinner();
  var dialog = $("#devExtralChange").dialog({
    autoOpen: false,
    buttons: [
      {
        text: "OK",
        icon: "ui-icon-check",
        click: player_dialog_extral_change_ok_action
      },
      {
        text: "Cancel",
        icon: "ui-icon-closethick",
        click: function(){dialog.dialog("close");}
      }
    ],
    show: { effect: "blind", duration: 100 },
    // height: 400,
    width: 550,
    modal: true});
  return dialog;
}

function player_init_new_dialog() {
  $("#btnNewPlayer").click(openNewPlayerDialog);
  $("#newPlayerCash").spinner();
  $("#newPlayerSalary").spinner();
  $("#newPlayerChildCost").spinner();
  return $("#divNewPlayer").dialog({
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
        click: function(){player_dialog_new.dialog("close");}
      }
    ],
    show: { effect: "blind", duration: 100 },
    // height: 400,
    width: 350,
    modal: true});
}
