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
let viewWallsButtonColor = document.querySelector('#wallBreaker-color')
let viewWallsButtonPressed = false;
let timerAddButton = document.querySelector('#addTime');
let timerAddButtonColor = document.querySelector('#addTime-color');
let moneyAddButton = document.querySelector('#addMoney');
let moneyAddButtonColor = document.querySelector('#addMoney-color');
let timer = null;
let moneyMultiplier = localStorage.getItem('moneyMultiplier') || 1;
let timeMax = localStorage.getItem('timeMax') || 10;
let timeLeft = timeMax;
let level = localStorage.getItem('level') || 1;
let coins = localStorage.getItem('coins') || 0;
let startingSession = true;
let active = false
//levelData Reset

const resetData = (num)=>{
  coins = 0;
  level = num;
  timeMax = 10;
  moneyMultiplier = 1;
  localStorage.setItem('timeMax',timeMax);
  localStorage.setItem('moneyMultiplier',moneyMultiplier);
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
  if (coins >= 20 + Math.floor((timeMax-10)*5)) {
    timeMax++;
    localStorage.setItem('timeMax', timeMax);
    coins -= 20 + Math.floor((timeMax-10)*5);
    timeLeft ++;
    update();
  }
})

moneyAddButton.addEventListener("click", ()=>{
  if (coins >= 20) {
    moneyMultiplier = parseFloat(moneyMultiplier) + (1/parseFloat(moneyMultiplier));
    localStorage.setItem('moneyMultiplier', moneyMultiplier);
    coins -= 20;
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
  document.body.style.backgroundColor = "hsl(" + game1.hue + ", 40%,20%)";
  timeDisplay.style.top = (game.clientHeight - (game1.unitThickness/2)) + 'px'
  timeDisplay.style.height = (game1.unitThickness/2) + 'px'
  viewWallsButtonColor.style.fill = "hsl(" + (game1.hue) + ", 70%,40%)";
  timerAddButtonColor.style.fill = "hsl(" + (game1.hue) + ", 70%,40%)";
  moneyAddButtonColor.style.fill = "hsl(" + (game1.hue) +", 70%,40%)";
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
  timeLeft--
  update();
  if(timeLeft <= 0){
    lose();
  }
  },1000)
  }
  
//ui update
  const update = () => {
    timeDisplay.style.width = (Math.floor(timeLeft/timeMax*100)+"%")
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
  const coinValue = parseInt(Math.floor(1*Math.random()*moneyMultiplier)+1);
  coins = parseInt(coins)+coinValue;
  const picked = document.createElement('div');
  document.body.appendChild(picked);
  picked.classList.add('coinFade')
  picked.innerHTML = "+ " + coinValue;
  picked.style.left = (Math.floor(game1.player.position.x) + 'px');
  picked.style.top = (Math.floor(game1.player.position.y)+ 'px')
  update();
  setTimeout(()=>{document.body.removeChild(picked)},1000) 
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

