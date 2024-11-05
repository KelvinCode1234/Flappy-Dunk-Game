const game = document.getElementById('game');
const bird = document.getElementById('bird');
const scoreDisplay = document.getElementById('score');
const highscoreDisplay = document.getElementById('highscore');
const startButton = document.getElementById('startButton');
const tryAgainButton = document.getElementById('tryAgainButton');

let birdY = 200;
let gravity = 2;
let isJumping = false;
let jumpStrength = 40;
let score = 0;
let highscore = 0;
let highscoreMultiplier = 2;
let pipes = [];
let foods = [];
let gameInterval;
let pipeInterval;
let foodInterval;


function createPipe() {
  const pipeGap = 120;
  const pipeHeight = Math.floor(Math.random() * 150) + 100;

  const pipeTop = document.createElement('div');
  pipeTop.classList.add('pipe', 'pipe-top');
  pipeTop.style.height = pipeHeight + 'px';
  pipeTop.style.left = '300px';

  const pipeBottom = document.createElement('div');
  pipeBottom.classList.add('pipe', 'pipe-bottom');
  pipeBottom.style.height = 500 - pipeHeight - pipeGap + 'px';
  pipeBottom.style.left = '300px';

  game.appendChild(pipeTop);
  game.appendChild(pipeBottom);

  pipes.push({ top: pipeTop, bottom: pipeBottom, passed: false });
}


function createFood() {
  const food = document.createElement('div');
  food.classList.add('food');
  food.style.top = Math.floor(Math.random() * (game.clientHeight - 20)) + 'px';
  food.style.left = '300px';

  game.appendChild(food);
  foods.push(food);
}


function fall() {
  if (!isJumping) birdY += gravity;
  bird.style.top = birdY + 'px';
}


function jump() {
  isJumping = true;
  let jumpCount = 0;

  const jumpInterval = setInterval(() => {
    birdY -= 3;
    bird.style.top = birdY + 'px';
    jumpCount++;

    if (jumpCount > jumpStrength / 3) {
      clearInterval(jumpInterval);
      isJumping = false;
    }
  }, 16);
}


document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') jump();
});
game.addEventListener('click', jump);


function movePipes() {
  pipes.forEach(pipe => {
    const pipeTop = pipe.top;
    const pipeBottom = pipe.bottom;

    let pipeLeft = parseInt(window.getComputedStyle(pipeTop).left);
    pipeLeft -= 2;
    pipeTop.style.left = pipeLeft + 'px';
    pipeBottom.style.left = pipeLeft + 'px';

    if (
      pipeLeft < 80 && pipeLeft > 20 &&
      (birdY < pipeTop.offsetHeight || birdY > 500 - pipeBottom.offsetHeight - bird.clientHeight)
    ) {
      endGame();
    }

    
    if (!pipe.passed && pipeLeft < 50) {
      score++;
      updateScore();
      pipe.passed = true;
    }

    
    if (pipeLeft < -50) {
      pipeTop.remove();
      pipeBottom.remove();
      pipes.shift();
    }
  });
}


function moveFood() {
  foods.forEach((food, index) => {
    let foodLeft = parseInt(window.getComputedStyle(food).left);
    foodLeft -= 2;
    food.style.left = foodLeft + 'px';

    
    const foodTop = parseInt(food.style.top);
    if (
      foodLeft < 80 && foodLeft > 20 &&
      birdY + bird.clientHeight > foodTop &&
      birdY < foodTop + food.clientHeight
    ) {
      score += 5; 
      updateScore();
      food.remove();
      foods.splice(index, 1);
    }

    
    if (foodLeft < -20) {
      food.remove();
      foods.splice(index, 1);
    }
  });
}


function updateScore() {
  scoreDisplay.textContent = 'Score: ' + score;

  
  if (score >= 20 && score % 20 === 0) {
    highscore += highscoreMultiplier;
    highscoreMultiplier *= 2; 
    highscoreDisplay.textContent = 'Highscore: ' + highscore;
  }
}


function endGame() {
  clearInterval(gameInterval);
  clearInterval(pipeInterval);
  clearInterval(foodInterval);
  alert('Game Over! Your score: ' + score);
  tryAgainButton.style.display = 'block';
  resetGame();
}


function resetGame() {
  birdY = 200;
  bird.style.top = birdY + 'px';
  score = 0;
  highscoreMultiplier = 2; 
  scoreDisplay.textContent = 'Score: 0';
  highscoreDisplay.textContent = 'Highscore: ' + highscore;

  pipes.forEach(pipe => {
    pipe.top.remove();
    pipe.bottom.remove();
  });
  pipes = [];

  foods.forEach(food => food.remove());
  foods = [];
}


function startGame() {
  scoreDisplay.style.display = 'block';
  highscoreDisplay.style.display = 'block';
  startButton.style.display = 'none';
  tryAgainButton.style.display = 'none';
  score = 0;
  scoreDisplay.textContent = 'Score: 0';
  highscoreDisplay.textContent = 'Highscore: ' + highscore;

  gameInterval = setInterval(() => {
    fall();
    movePipes();
    moveFood();

    
    if (birdY > game.clientHeight - bird.clientHeight) {
      endGame();
    } else if (birdY < 0) {
      birdY = 0;
    }
  }, 20);

  pipeInterval = setInterval(createPipe, 2000);
  foodInterval = setInterval(createFood, 5000);
}


startButton.addEventListener('click', startGame);
tryAgainButton.addEventListener('click', startGame);


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
              console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch(error => {
              console.log('Service Worker registration failed:', error);
          });
  });
}
