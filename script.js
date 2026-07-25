(function () {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const CANVAS_WIDTH = 480;
  const CANVAS_HEIGHT = 600;
  const MOVE_SPEED = 5;
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
    vx: 0,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
  };

  const keys = {
    left: false,
    right: false,
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
    ctx.save();
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
    if (keys.left) ctx.scale(-1, 1);
    ctx.translate(-(player.x + player.width / 2), -(player.y + player.height / 2));

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

    ctx.restore();
  }

  function updatePlayer() {
    if (keys.left) player.vx = -MOVE_SPEED;
    else if (keys.right) player.vx = MOVE_SPEED;
    else player.vx *= 0.85;

    player.x += player.vx;
    player.x = Math.max(0, Math.min(CANVAS_WIDTH - player.width, player.x));
  }

  function gameLoop() {
    updatePlayer();
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawPlatform();
    drawPlayer();
    requestAnimationFrame(gameLoop);
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
      keys.left = true;
    }
    if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
      keys.right = true;
    }
  });

  document.addEventListener("keyup", function (event) {
    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
      keys.left = false;
    }
    if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
      keys.right = false;
    }
  });

  gameLoop();
})();
