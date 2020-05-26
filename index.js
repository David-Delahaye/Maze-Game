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

const gameData = {
  startingSession:true,
  active:false,
  level: parseInt(localStorage.getItem('level')) || 1,
  coins: parseInt(localStorage.getItem('coins')) || 0,
  canvas: document.querySelector("#game"),
  container: document.querySelector(".container"),
  color:{
    newHue:function(){gameData.color.gameHue =(Math.floor(Math.random()*356))},
    gameHue:1,
    player:function(){return `hsl( ${gameData.color.gameHue}, 70%, 50%)`},
    goal:function(){return `hsl( ${gameData.color.gameHue+178}, 70%, 50%)`},
    scoreBar:function(){return `hsl( ${gameData.color.gameHue}, 40%, 30%)`},
    nub:function(){return `hsl( ${gameData.color.gameHue}, 40%, 30%)`},
    wall:function(){return `hsl( ${gameData.color.gameHue}, 40%, 40%)`},
    back:function(){return `hsl( ${gameData.color.gameHue}, 40%, 10%)`}
  },
  display:{
    levelDisplay:document.querySelector("#level"),
    coinDisplay:document.querySelector("#coins"),
    timeDisplay:document.querySelector("#timer"),
    timeBackDisplay:document.querySelector("#timer-back"),
    resetDisplay:document.querySelector('#reset')
  },
  menu:{
    root:document.querySelector(".menu"),
    head:document.querySelector("#menu-head"),
    button:document.querySelector("#menu-button"),
  },
  timer: {
    max:localStorage.getItem('timeMax') || 10,
    left:this.timer.timeMax,
    shop:document.querySelector('#addTime'),
    shopColor:document.querySelectorAll('.addTime-color'),
    shopPrice:document.querySelector('#addTime-cost'),
    shopLevel:document.querySelector('#addTime-lvl'),
    cost:function(){return 20+Math.floor((gameData.timer.max-10)*5)},
  },
  moneyMultiplier: {
    value:localStorage.getItem('moneyMultiplier') || 1,
    shop:document.querySelector('#addMoney'),
    shopColor:document.querySelectorAll('.addMoney-color'),
    shopPrice:document.querySelector('#addMoney-cost'),
    shopLevel:document.querySelector('#addMoney-lvl'),
    cost:function(){return 20*this.value},
    coinValue:function(){ const coinValue = parseInt(-Math.floor(3*Math.random())+parseInt(gameData.moneyMultiplier.value));
                          if(coinValue >=1 && Math.sign(coinValue) === 1){
                            return coinValue;
                          }else{return 1}},
  },
  wallBreaker:{
    shop:document.querySelector("#wallBreaker"),
    shopColor:document.querySelector('#wallBreaker-color'),
    pressed:false,
    cost:5,
  }
}

//levelData Reset
gameData.display.resetDisplay.addEventListener('click', ()=>{
  resetData(1,0,);
  clear();
  newLevel();
  gameBuild();
  gameData.startingSession = true;
  gameData.menu.head.textContent = "Level 1";
  gameData.menu.button.textContent = "Begin";
})
const resetData = (l,c)=>{
  gameData.coins = c;
  gameData.level = l;
  gameData.timer.max = 10;
  gameData.moneyMultiplier.value = 1;
  localStorage.setItem('timeMax',gameData.timer.max);
  localStorage.setItem('moneyMultiplier',gameData.moneyMultiplier.value);
  update();
}


//SHOP ==================
//wall viewer shop
gameData.wallBreaker.shop.addEventListener("click", () => {
  if (gameData.coins >= 5 && game1.enemies.length > 0 && gameData.wallBreaker.pressed===false) {
    for (const enemy of game1.enemies) {
      enemy.render.opacity = 0.1;
    }
    coins -= 5;
    gameData.wallBreaker.pressed = true;
    update();
  }
});

//add time shop
gameData.timer.shop.addEventListener("click", ()=>{
  if (gameData.coins >= gameData.timer.cost()) {
    gameData.coins -= gameData.timer.cost();
    gameData.timer.max++;
    localStorage.setItem('timeMax', gameData.timer.max);
    gameData.timer.left ++;
    shopUpdate();
    update();
  }
})
//money shop
gameData.moneyMultiplier.shop.addEventListener("click", ()=>{
  if (gameData.coins >= gameData.moneyMultiplier.cost()) {
    gameData.coins -= gameData.moneyMultiplier.cost();
    gameData.moneyMultiplier.value++;
    localStorage.setItem('moneyMultiplier', gameData.moneyMultiplier.value);
    shopUpdate();
    update();
  }
})




//build wall
const gameBuild = () => {
  game1 = new Game(gameData.canvas, gameData.level, game.clientWidth, game.clientHeight);
  game1.mazeBuild();
  game1.spritesBuild();
  game1.controlsBuild();
  game1.eventsBuild();
  shopUpdate();
  update();
};

const shopUpdate = ()=>{
  gameData.wallBreaker.pressed = false;
  gameData.container.style.backgroundColor = gameData.color.scoreBar();
  gameData.display.timeDisplay.style.top = (game.clientHeight - (game1.unitThickness/2)) + 'px';
  gameData.display.timeDisplay.style.height = (game1.unitThickness/2) + 'px';
  gameData.display.timeBackDisplay.style.top = (game.clientHeight - (game1.unitThickness/2)) + 'px';
  gameData.display.timeBackDisplay.style.height = (game1.unitThickness/2) + 'px';
  gameData.wallBreaker.shopColor.style.fill = gameData.color.player();
  gameData.timer.shopColor.forEach((part)=>{part.style.fill = gameData.color.player()})
  gameData.moneyMultiplier.shopColor.forEach((part)=>{part.style.fill = gameData.color.player()})
  gameData.timer.shopLevel.innerHTML = gameData.timer.max-10;
  gameData.timer.shopPrice.innerHTML = gameData.timer.cost();
  gameData.moneyMultiplier.shopLevel.innerHTML = gameData.moneyMultiplier.value;
  gameData.moneyMultiplier.shopPrice.innerHTML = gameData.moneyMultiplier.cost();
  gameData.moneyMultiplier.shopLevel.innerHTML = gameData.moneyMultiplier.value + 'x';
  gameData.moneyMultiplier.shopPrice.innerHTML = gameData.moneyMultiplier.cost();
  gameData.timer.shopLevel.innerHTML = '+' + (gameData.timer.max-10) + 's';
  gameData.timer.shopPrice.innerHTML = gameData.timer.cost();
}

const clear = () => {
  game1.worldClear();
};

//win/loss statements------------
const win = () => {
  clearInterval(timer);
  gameData.active = false;
  gameData.menu.root.classList.remove("hidden");
  gameData.menu.head.textContent = "Level " + gameData.level + " Complete";
  gameData.menu.button.textContent = "Next Level";
  gameData.menu.button.backgroundColor = gameData.color.nub();
  gameData.level++
  update();
};

const lose = () => {
  clearInterval(timer);
  gameData.active = false;
  gameData.menu.root.classList.remove("hidden");
  gameData.menu.head.textContent = "Level " + gameData.level + " Failed";
  gameData.menu.button.textContent = "Retry";
  gameData.menu.button.backgroundColor = gameData.color.nub();
  update();
}

//menu button
gameData.menu.button.addEventListener("click", () => {
  if (gameData.startingSession){
    newLevel();
    gameData.menu.root.classList.add("hidden");
    gameData.startingSession = false;
  }else{
    gameData.menu.root.classList.add("hidden");
    clear();
    newLevel();
    gameBuild();
  }
});

//coundtown
function startTimer(){
  timer = setInterval(()=>{
  gameData.timer.left -= 1;
  update();
  if(gameData.timer.left <= 0){
    lose();
  }
  },1000)
  }
  
//ui update
  const update = () => {
    gameData.display.timeDisplay.style.width = (Math.floor(gameData.timer.left/gameData.timer.max*100)+"%")
    localStorage.setItem('level', gameData.level);
    localStorage.setItem('coins', gameData.coins);
    gameData.display.levelDisplay.innerHTML = "Level: " + gameData.level;
    gameData.display.coinDisplay.innerHTML = "Coins: " + gameData.coins;
  };

//add game level data
const newLevel = () =>{
  gameData.active = true;
  clearInterval(timer);
  gameData.timer.left = gameData.timer.max;
  gameData.color.newHue();
  startTimer();
  update();
}

const coinPickup = () => {
  const coinValue = gameData.moneyMultiplier.coinValue();
  gameData.coins = parseInt(gameData.coins)+coinValue;
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

