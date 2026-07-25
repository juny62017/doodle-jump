(function () {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const CANVAS_WIDTH = 480;
  const CANVAS_HEIGHT = 600;
  const PLATFORM_HEIGHT = 14;
  const PLAYER_WIDTH = 36;
  const PLAYER_HEIGHT = 40;

  const platform = {
    x: 170,
    y: CANVAS_HEIGHT - 80,
    width: 140,
    height: PLATFORM_HEIGHT,
  };

  const player = {
    x: (CANVAS_WIDTH - PLAYER_WIDTH) / 2,
    y: platform.y - PLAYER_HEIGHT - 2,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
  };

  function drawPlatform() {
    ctx.fillStyle = "#6bcb77";
    ctx.strokeStyle = "#4ade80";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(platform.x, platform.y, platform.width, platform.height, 6);
    ctx.fill();
    ctx.stroke();
  }

  function drawPlayer() {
    ctx.fillStyle = "#2d3436";
    ctx.beginPath();
    ctx.roundRect(player.x, player.y, player.width, player.height, 8);
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(player.x + 12, player.y + 14, 6, 0, Math.PI * 2);
    ctx.arc(player.x + player.width - 12, player.y + 14, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#2d3436";
    ctx.beginPath();
    ctx.arc(player.x + 12, player.y + 14, 3, 0, Math.PI * 2);
    ctx.arc(player.x + player.width - 12, player.y + 14, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawGame() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawPlatform();
    drawPlayer();
  }

  drawGame();
})();
