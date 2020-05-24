const {
  Engine,
  Render,
  World,
  Runner,
  Bodies,
  Body,
  Bounds,
  Events,
  Vector,
} = Matter;
let game = document.querySelector("#game");
let container = document.querySelector(".container");
let levelDisplay = document.querySelector("#level");
let coinDisplay = document.querySelector("#coins");
let timeDisplay = document.querySelector("#timer");
let menu = document.querySelector(".menu");
let menuHead = document.querySelector("#menu-head");
let menuButton = document.querySelector("#menu-button");
let viewWallsButton = document.querySelector("#wallBreaker");
let viewWallsButtonPressed = false;
let timerAddButton = document.querySelector('#addTime')
let timer = null;
let timeMax = localStorage.getItem('timeMax') || 10;
let timeLeft = timeMax;
let level = localStorage.getItem('level') || 1;
let coins = localStorage.getItem('coins') || 0;
let startingSession = true;
let active = false
//levelData Reset
const resetData = ()=>{
  coins = 0;
  level = 1;
  timeMax = 10;
  update();
}


//SHOP ==================
//wall viewer shop
viewWallsButton.addEventListener("click", () => {
  if (coins >= 5 && game1.enemies.length > 0 && viewWallsButtonPressed===false) {
    for (const enemy of game1.enemies) {
      enemy.render.opacity = 0.1;
    }
    coins -= 5;
    viewWallsButtonPressed = true;
    update();
  }
});

//add time shop
timerAddButton.addEventListener("click", ()=>{
  if (coins >= 20) {
    timeMax++;
    localStorage.setItem('timeMax', timeMax);
    coins -= 20;
    timeLeft ++;
    update();
  }
})

//build wall
const gameBuild = () => {
  game1 = new Game(game, level, game.clientWidth, game.clientHeight);
  game1.mazeBuild();
  game1.spritesBuild();
  game1.controlsBuild();
  game1.eventsBuild();
  update();
  viewWallsButtonPressed = false;
  viewWallsButton.style.backgroundColor = "hsl(" + game1.hue + ", 40%,20%)";
  timerAddButton.style.backgroundColor = "hsl(" + game1.hue + ", 40%,20%)";
  document.body.style.backgroundColor = "hsl(" + game1.hue + ", 40%,20%)";
};

const clear = () => {
  game1.worldClear();
};

//win/loss statements------------
const win = () => {
  clearInterval(timer);
  active = false;
  level++
  menu.classList.remove("hidden");
  menuHead.textContent = "Level " + (level-1) + " Complete";
  menuButton.textContent = "Next Level";
  menuButton.style.backgroundColor = "hsl(" + game1.hue + ", 40%,30%)";
  update();
};

const lose = () => {
  clearInterval(timer);
  active = false;
  menu.classList.remove("hidden");
  menuHead.textContent = "Level " + level + " Failed";
  menuButton.textContent = "Retry";
  menuButton.style.backgroundColor = "hsl(" + game1.hue + ", 40%,30%)";
}

//menu button
menuButton.addEventListener("click", () => {
  if (startingSession){
    newLevel();
    menu.classList.add("hidden");
    startingSession = false;
  }else{
    menu.classList.add("hidden");
    clear();
    newLevel();
    gameBuild();
  }
});

//coundtown
function startTimer(){
  timer = setInterval(()=>{
  console.log('tick');
  timeLeft--
  update();
  if(timeLeft <= 0){
    lose();
  }
  },1000)
  }
  
//ui update
  const update = () => {
    timeDisplay.innerHTML = "Time Left: " + timeLeft;
    localStorage.setItem('level', level);
    localStorage.setItem('coins', coins);
    levelDisplay.innerHTML = "Level: " + localStorage.getItem('level', level);;
    coinDisplay.innerHTML = "Coins: " + coins;
  };

//add game level data
const newLevel = () =>{
  active = true;
  clearInterval(timer);
  timeLeft = timeMax;
  startTimer();
  update();
}

const coinPickup = () => {
  coins++;
  update();
};

//refresh delay
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

// Screen Refresh & scroll stop
const reset = () => {
  game1.worldClear();
  newLevel();
  gameBuild();
};

update();
gameBuild();


window.addEventListener("resize", debounce(reset, 1000));

//stop scrolling
window.addEventListener("scroll", preventMotion, { passive: false });
window.addEventListener("touchmove", preventMotion, { passive: false });

function preventMotion(event) {
  window.scrollTo(0, 0);
  event.preventDefault();
  event.stopPropagation();
}

// container.style.width = window.innerWidth + 'px';
// container.style.height = window.innerHeight + 'px';

