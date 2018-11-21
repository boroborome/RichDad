"use strict";

class Investment {
  constructor(type, description) {
    this.type = type;
    this.description = description;
    this.price = 0;
    this.count = 0;
    this.downPayment = 0;
    this.loans = 0;
    this.incoming = 0;
    this.totalPrice = 0;
  }
};

function recalculateInvestment() {
  var price = $("#investmentPrice").spinner().spinner("value");
  var count = $("#investmentCount").spinner().spinner("value");
  $("#investmentTotalPrice").spinner().spinner("value", price * count);
  var downPayment = $("#investmentDownPayment").spinner().spinner("value");
  $("#investmentLoan").spinner().spinner("value", price * count - downPayment);
}

function newInvestmentAction() {
  var investment = new Investment(
    $("#investmentType").val(),
    $("#investmentDescription").val()
  );

  investment.price = $("#investmentPrice").spinner().spinner("value");
  investment.count = $("#investmentCount").spinner().spinner("value");
  investment.totalPrice = $("#investmentTotalPrice").spinner().spinner("value");
  investment.downPayment = $("#investmentDownPayment").spinner().spinner("value");
  investment.loans = $("#investmentLoan").spinner().spinner("value");
  investment.incoming = $("#investmentIncoming").spinner().spinner("value");

  var playerName = $("#investmentBuyer").text();
  var allPlayers = loadAllPlayers();
  var player = findPlayer(playerName, allPlayers);
  player_appendInvestment(player, investment);
  saveAllPlayers(allPlayers);
  showAllPlayers(allPlayers);
  investment_newInvestmentDialog.dialog("close");
}

function buyInvestmentAction(event) {
  var name = event.target.parentElement.parentElement.firstChild.innerText;
  $("#investmentBuyer").text(name);
  $("#investmentPrice").spinner().spinner("value", 0);
  $("#investmentCount").spinner().spinner("value", 1);
  $("#investmentTotalPrice").spinner().spinner("value", 0);
  $("#investmentDownPayment").spinner().spinner("value", 0);
  $("#investmentLoan").spinner().spinner("value", 0);
  $("#investmentIncoming").spinner().spinner("value", 0);
  $("#investmentDescription").val("");

  investment_newInvestmentDialog.dialog("open");
}

function createTrInvestment(investment) {
  return "<tr><td>" + investment.type
    + "</td><td>" + investment.description
    + "</td><td>" + investment.price
    + "</td><td>" + investment.count
    + "</td><td>" + investment.totalPrice
    + "</td><td>" + investment.downPayment
    + "</td><td>" + investment.loans
    + "</td><td>" + investment.incoming
    + "</td><td><input type='button' class='sellInvestment' value='卖'/>"
    + "</td></tr>"
}

function showInvestmentsAction(event) {
  var name = event.target.parentElement.firstChild.innerText;
  $("#investmentOwner").text(name);
  $("#investmentsTable tr:gt(0)").remove();
  var player = getPlayer(name);

  for (var i = 0; i < player.allInvestments.length; i++) {
    $("#investmentsTable tr:last").after(createTrInvestment(player.allInvestments[i]));
  }
  $(".sellInvestment").click(sellInvestmentAction);
  invetment_showInvestmentsDialog.dialog("open");
}

function sellInvestmentAction(event) {

}

var invetment_showInvestmentsDialog = null;
var investment_newInvestmentDialog = null;
function investment_initUI() {
  investment_newInvestmentDialog = $("#divBuyInvestment").dialog({
    autoOpen: false,
    buttons: [
      {
        text: "OK",
        icon: "ui-icon-check",
        click: newInvestmentAction
      },
      {
        text: "Cancel",
        icon: "ui-icon-closethick",
        click: function(){investment_newInvestmentDialog.dialog("close");}
      }
    ],
    show: { effect: "blind", duration: 100 },
    // height: 400,
    width: 700,
    modal: true});
  $("#investmentPrice").spinner({change: recalculateInvestment});
  $("#investmentCount").spinner({change: recalculateInvestment});
  $("#investmentTotalPrice").spinner().spinner("disable");
  $("#investmentDownPayment").spinner({change: recalculateInvestment});
  $("#investmentLoan").spinner().spinner("disable");
  $("#investmentIncoming").spinner();

  invetment_showInvestmentsDialog = $("#divShowInvestments").dialog({
    autoOpen: false,
    buttons: [
      {
        text: "OK",
        icon: "ui-icon-check",
        click: function(){invetment_showInvestmentsDialog.dialog("close");}
      }
    ],
    show: { effect: "blind", duration: 100 },
    // height: 400,
    width: 700,
    modal: true});

}
