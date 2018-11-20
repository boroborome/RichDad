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
}