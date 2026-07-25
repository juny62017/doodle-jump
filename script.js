(function () {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const CANVAS_WIDTH = 480;
  const CANVAS_HEIGHT = 600;
  const GRAVITY = 0.45;
  const JUMP_FORCE = -12;
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

  let player = null;
  let gameRunning = true;
  const keys = { left: false, right: false };

  function resetPlayer() {
    player = {
      x: (CANVAS_WIDTH - PLAYER_WIDTH) / 2,
      y: platform.y - PLAYER_HEIGHT - 2,
      vx: 0,
      vy: JUMP_FORCE,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
    };
    gameRunning = true;
  }

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

    const oldBottom = player.y + player.height;
    player.vy += GRAVITY;
    player.y += player.vy;
    const newBottom = player.y + player.height;

    const overlapX =
      player.x + player.width > platform.x &&
      player.x < platform.x + platform.width;

    if (
      overlapX &&
      oldBottom <= platform.y &&
      newBottom >= platform.y &&
      player.vy >= 0
    ) {
      player.y = platform.y - player.height;
      player.vy = JUMP_FORCE;
    }

    if (player.y > CANVAS_HEIGHT + 40) {
      gameRunning = false;
    }
  }

  function drawGameOver() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = "#fff";
    ctx.font = '32px "Fredoka One"';
    ctx.textAlign = "center";
    ctx.fillText("Game Over", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    ctx.font = '16px "Nunito"';
    ctx.fillText("Press Enter to restart", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 36);
  }

  function gameLoop() {
    if (gameRunning) updatePlayer();

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawPlatform();
    drawPlayer();
    if (!gameRunning) drawGameOver();

    requestAnimationFrame(gameLoop);
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
      keys.left = true;
    }
    if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
      keys.right = true;
    }
    if (event.key === "Enter" && !gameRunning) resetPlayer();
  });

  document.addEventListener("keyup", function (event) {
    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
      keys.left = false;
    }
    if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
      keys.right = false;
    }
  });

  resetPlayer();
  gameLoop();
})();
