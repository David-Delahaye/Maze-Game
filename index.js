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
let timer = null;
let timeLeft = 10;
let level = localStorage.getItem('level') || 1;
let coins = localStorage.getItem('coins') || 0;
let startingSession = true;
let active = false;

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

function startTimer(){
timer = setInterval(()=>{
console.log('tick');
timeLeft--
update();
},1000)
}


const update = () => {
  timeDisplay.innerHTML = "Time Left: " + timeLeft;
  localStorage.setItem('level', level);
  localStorage.setItem('coins', coins);
  levelDisplay.innerHTML = "Level: " + localStorage.getItem('level', level);;
  coinDisplay.innerHTML = "Coins: " + coins;
};
update();

const nextLevel = (reason) => {
  game1 = new Game(game, level, game.clientWidth, game.clientHeight);
  game1.mazeBuild();
  game1.spritesBuild();
  game1.controlsBuild();
  game1.eventsBuild();
  viewWallsButtonPressed = false;
  viewWallsButton.style.backgroundColor = "hsl(" + game1.hue + ", 40%,20%)";
  update();
  console.log(reason);
};

const clear = () => {
  game1.worldClear();
};

const win = () => {
  level++
  menu.classList.remove("hidden");
  menuHead.textContent = "Level " + level + " Complete";
  menuButton.textContent = "Next Level";
  menuButton.style.backgroundColor = "hsl(" + game1.hue + ", 40%,30%)";
};

menuButton.addEventListener("click", () => {
  if (startingSession){
    clearInterval(timer);
    timeLeft = 10;
    startTimer();
    menu.classList.add("hidden");
    startingSession = false;
  }else{
    newLevel();
  }
});

const newLevel = () =>{
  clearInterval(timer);
  timeLeft = 10;
  startTimer();
  menu.classList.add("hidden");
  level++;
  update();
  clear();
  nextLevel("win");
}

const coinPickup = () => {
  coins++;
  update();
};

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
  newLevel("reset");
};

nextLevel('start');

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

