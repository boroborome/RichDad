"use strict";

function getPlayer(playerName) {
  var allPlayers = loadAllPlayers();
  return findPlayer(playerName, allPlayers);
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
  saveAllPlayers(allPlayers);
}

function playSellAction(event) {

}

var newInvestmentDialog = null;
function initUI() {
  player_initUI();
  investment_initUI();

  var allPlayers = loadAllPlayers();
  showAllPlayers(allPlayers);
}
