(function () {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("scoreEl");

  const CANVAS_WIDTH = 480;
  const CANVAS_HEIGHT = 600;
  const GRAVITY = 0.45;
  const JUMP_FORCE = -12;
  const MOVE_SPEED = 5;
  const PLATFORM_MIN_WIDTH = 60;
  const PLATFORM_MAX_WIDTH = 120;
  const PLATFORM_HEIGHT = 14;
  const PLATFORM_GAP_MIN = 50;
  const PLATFORM_GAP_MAX = 120;
  const PLAYER_WIDTH = 36;
  const PLAYER_HEIGHT = 40;
  const CAMERA_LEAD = 0.4;

  let player = null;
  let platforms = [];
  let cameraY = 0;
  let startCameraY = 0;
  let score = 0;
  let gameRunning = true;
  const keys = { left: false, right: false };

  function createPlatform(x, y, width) {
    return {
      x,
      y,
      width,
      height: PLATFORM_HEIGHT,
    };
  }

  function initPlatforms() {
    platforms = [];
    let y = CANVAS_HEIGHT - 80;

    for (let i = 0; i < 10; i++) {
      const width =
        PLATFORM_MIN_WIDTH + Math.random() * (PLATFORM_MAX_WIDTH - PLATFORM_MIN_WIDTH);
      let x = Math.random() * (CANVAS_WIDTH - width);

      if (i === 0) x = (CANVAS_WIDTH - width) / 2;

      platforms.push(createPlatform(x, y, width));
      y -= PLATFORM_GAP_MIN + Math.random() * (PLATFORM_GAP_MAX - PLATFORM_GAP_MIN);
    }
  }

  function resetGame() {
    cameraY = 0;
    score = 0;
    scoreEl.textContent = "0";
    keys.left = false;
    keys.right = false;
    initPlatforms();

    const firstPlatform = platforms[0];
    player = {
      x: (CANVAS_WIDTH - PLAYER_WIDTH) / 2,
      y: firstPlatform.y - PLAYER_HEIGHT - 2,
      vx: 0,
      vy: JUMP_FORCE,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
    };

    startCameraY = player.y - CANVAS_HEIGHT * CAMERA_LEAD;
    gameRunning = true;
  }

  function drawPlatform(platform) {
    const y = platform.y - cameraY;
    if (y < -40 || y > CANVAS_HEIGHT + 40) return;

    ctx.fillStyle = "#6bcb77";
    ctx.strokeStyle = "#4ade80";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(platform.x, y, platform.width, platform.height, 6);
    ctx.fill();
    ctx.stroke();
  }

  function drawPlayer() {
    const y = player.y - cameraY;

    ctx.save();
    ctx.translate(player.x + player.width / 2, y + player.height / 2);
    if (keys.left) ctx.scale(-1, 1);
    ctx.translate(-(player.x + player.width / 2), -(y + player.height / 2));

    ctx.fillStyle = "#2d3436";
    ctx.beginPath();
    ctx.roundRect(player.x, y, player.width, player.height, 8);
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(player.x + 12, y + 14, 6, 0, Math.PI * 2);
    ctx.arc(player.x + player.width - 12, y + 14, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#2d3436";
    ctx.beginPath();
    ctx.arc(player.x + 12, y + 14, 3, 0, Math.PI * 2);
    ctx.arc(player.x + player.width - 12, y + 14, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function updatePlayer() {
    if (keys.left) player.vx = -MOVE_SPEED;
    else if (keys.right) player.vx = MOVE_SPEED;
    else player.vx *= 0.85;

    player.x += player.vx;
    player.x = Math.max(0, Math.min(CANVAS_WIDTH - player.width, player.x));

    player.vy += GRAVITY;
    player.y += player.vy;

    for (const platform of platforms) {
      const playerBottom = player.y + player.height;
      const overlapX =
        player.x + player.width > platform.x &&
        player.x < platform.x + platform.width;

      if (
        overlapX &&
        playerBottom >= platform.y - 2 &&
        playerBottom <= platform.y + 12 &&
        player.vy >= 0
      ) {
        player.vy = JUMP_FORCE;
        player.y = platform.y - player.height - 1;
      }
    }

    const targetCameraY = player.y - CANVAS_HEIGHT * CAMERA_LEAD;
    if (targetCameraY < cameraY) {
      cameraY = targetCameraY;
      score = Math.max(0, Math.floor((startCameraY - cameraY) / 8));
      scoreEl.textContent = score;
    }

    if (player.y - cameraY > CANVAS_HEIGHT + 50) gameRunning = false;
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
    platforms.forEach(drawPlatform);
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
    if (event.key === "Enter" && !gameRunning) resetGame();
  });

  document.addEventListener("keyup", function (event) {
    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
      keys.left = false;
    }
    if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
      keys.right = false;
    }
  });

  resetGame();
  gameLoop();
})();
