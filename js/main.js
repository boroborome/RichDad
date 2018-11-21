"use strict";

function getPlayer(playerName) {
  return findPlayer(playerName, game.allPlayers);
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
  var allPlayers = game.allPlayers;
  for (var i = 0; i < allPlayers.length; i++) {
    if (allPlayers[i].name == playerName) {
      allPlayers.splice(i, 1);
      break;
    }
  }
  saveAllPlayers(allPlayers);
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
  var player = getPlayer(name);
  player.cash = player.cash + player.totalIncoming - player.totalOutcoming;
  showAllPlayers(allPlayers);
  saveAllPlayers(allPlayers);
}

var game={};
function initUI() {
  player_initUI();
  investment_initUI();

  game.allPlayers = loadAllPlayers();
  showAllPlayers(game.allPlayers);
}
