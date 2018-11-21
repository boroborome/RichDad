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

function investment_dialog_new_recalculate_action() {
  var price = $("#investmentPrice").spinner().spinner("value");
  var count = $("#investmentCount").spinner().spinner("value");
  $("#investmentTotalPrice").spinner().spinner("value", price * count);
  var downPayment = $("#investmentDownPayment").spinner().spinner("value");
  $("#investmentLoan").spinner().spinner("value", price * count - downPayment);
}

function investment_dialog_sell_recalculate_action() {
  var price = $("#investment_sell_out_price").spinner().spinner("value");
  var count = $("#investment_sell_out_count").spinner().spinner("value");
  $("#investment_sell_out_total_price").text(price * count);
}

function newInvestmentAction() {
  var investment = new Investment(
    $("#buy_investmentType").val(),
    $("#buy_investmentDescription").val()
  );

  investment.price = $("#buy_investmentPrice").spinner().spinner("value");
  investment.count = $("#buy_investmentCount").spinner().spinner("value");
  investment.totalPrice = $("#buy_investmentTotalPrice").spinner().spinner("value");
  investment.downPayment = $("#buy_investmentDownPayment").spinner().spinner("value");
  investment.loans = $("#buy_investmentLoan").spinner().spinner("value");
  investment.incoming = $("#buy_investmentIncoming").spinner().spinner("value");

  var playerName = $("#buy_investmentBuyer").text();
  var player = getPlayer(playerName);
  player_appendInvestment(player, investment);
  saveAllPlayers(game.allPlayers);
  showAllPlayers(game.allPlayers);
  investment_dialog_new.dialog("close");
}

function buyInvestmentAction(event) {
  var name = event.target.parentElement.parentElement.firstChild.innerText;
  $("#buy_investmentBuyer").text(name);
  $("#buy_investmentPrice").spinner().spinner("value", 0);
  $("#buy_investmentCount").spinner().spinner("value", 1);
  $("#buy_investmentTotalPrice").spinner().spinner("value", 0);
  $("#buy_investmentDownPayment").spinner().spinner("value", 0);
  $("#buy_investmentLoan").spinner().spinner("value", 0);
  $("#buy_investmentIncoming").spinner().spinner("value", 0);
  $("#buy_investmentDescription").val("");

  investment_dialog_new.dialog("open");
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
  $("#investment_show_list_owner").text(name);
  $("#investment_show_list_table tr:gt(0)").remove();
  var player = getPlayer(name);

  for (var i = 0; i < player.allInvestments.length; i++) {
    $("#investment_show_list_table tr:last").after(createTrInvestment(player.allInvestments[i]));
  }
  $(".sellInvestment").click(investment_dialog_show_list_sell_action);
  investment_dialog_show_list.player = player;
  investment_dialog_show_list.dialog("open");
}

function investment_dialog_show_list_sell_action(event) {
  var investment_index = $(this).closest("tr").index() - 1;
  var player = investment_dialog_show_list.player;
  var investment = player.allInvestments[investment_index];
  $("#investment_sell_owner").text(player.name);
  $("#investment_sell_type").selectable().val(investment.type);
  $("#investment_sell_description").text(investment.description);
  $("#investment_sell_price").text(investment.price);
  $("#investment_sell_count").text(investment.count);
  $("#investment_sell_total_price").text(investment.totalPrice);
  $("#investment_sell_down_payment").text(investment.downPayment);
  $("#investment_sell_loan").text(investment.loans);
  $("#investment_sell_incoming").text(investment.incoming);
  $("#investment_sell_out_price").val(0);
  $("#investment_sell_out_count").val(0);
  investment_dialog_sell.dialog("open");
}

function investment_dialog_sell_ok_action() {

}

var investment_dialog_show_list = null;
var investment_dialog_new = null;
var investment_dialog_sell = null;
function investment_initUI() {
  investment_dialog_new = investment_init_new_dialog();
  investment_dialog_show_list = investment_init_show_list_dialog();
  investment_dialog_sell = investment_init_sell_dialog();
}

function investment_init_sell_dialog() {
  $("#investment_sell_out_price").spinner({change: investment_dialog_sell_recalculate_action});
  $("#investment_sell_out_count").spinner({change: investment_dialog_sell_recalculate_action});
  return $("#divSellInvestment").dialog({
    autoOpen: false,
    buttons: [
      {
        text: "OK",
        icon: "ui-icon-check",
        click: investment_dialog_sell_ok_action
      },
      {
        text: "Cancel",
        icon: "ui-icon-closethick",
        click: function(){investment_dialog_sell.dialog("close");}
      }
    ],
    show: { effect: "blind", duration: 100 },
    // height: 400,
    width: 700,
    modal: true});
}
function investment_init_show_list_dialog() {
  $("#investment_sell_type").selectable({
    disabled: true
  });
  return $("#divShowInvestments").dialog({
    autoOpen: false,
    buttons: [
      {
        text: "OK",
        icon: "ui-icon-check",
        click: function(){investment_dialog_show_list.dialog("close");}
      }
    ],
    show: { effect: "blind", duration: 100 },
    // height: 400,
    width: 700,
    modal: true});
}

function investment_init_new_dialog() {
  $("#buy_investmentPrice").spinner({change: investment_dialog_new_recalculate_action});
  $("#buy_investmentCount").spinner({change: investment_dialog_new_recalculate_action});
  $("#buy_investmentTotalPrice").spinner().spinner("disable");
  $("#buy_investmentDownPayment").spinner({change: investment_dialog_new_recalculate_action});
  $("#buy_investmentLoan").spinner().spinner("disable");
  $("#buy_investmentIncoming").spinner();

  return $("#divBuyInvestment").dialog({
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
        click: function(){investment_dialog_new.dialog("close");}
      }
    ],
    show: { effect: "blind", duration: 100 },
    // height: 400,
    width: 700,
    modal: true});
}
