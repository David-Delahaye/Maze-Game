const {Engine,Render,World,Runner,Bodies,Body,Bounds,Events,Vector} = Matter;
let game = document.querySelector('#game');
let container = document.querySelector('.container');
let levelDisplay = document.querySelector('#level');
let coinDisplay = document.querySelector('#coins');
let menu = document.querySelector('.menu');
let menuHead =document.querySelector('#menu-head')
let menuButton = document.querySelector('#menu-button');
let level = 1;
let coins = 0;


const update = () => {
levelDisplay.innerHTML = 'Level: ' + level;
coinDisplay.innerHTML = 'Coins: '+ coins;
}
update();

const newLevel = (reason) => {
    game1 = new Game(game,level,game.clientWidth,game.clientHeight,);
    game1.mazeBuild();
    game1.spritesBuild();
    game1.controlsBuild();
    game1.eventsBuild();
    console.log(reason);
}

const clear = ()=>{
    game1.worldClear();
}

newLevel('start');

const win = () => {
    menu.classList.remove('hidden');
    menuHead.textContent = 'Level ' + level + ' Complete';
    menuButton.style.backgroundColor = 'hsl('+game1.hue+', 40%,30%)'
}


menuButton.addEventListener('click', ()=>{
    menu.classList.add('hidden');
    level++
    update();
    clear();
    newLevel('win');
})

const coinPickup = () => {
    coins++;
    update();
}

const debounce = (func,delay) =>{
    let timeoutId;
    return (...args) => {
        if(timeoutId){
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(null,args);
        }, delay);
    }
}


// Screen Refresh & scroll stop
const reset = () => {
    game1.worldClear();
    newLevel('reset');
}

window.addEventListener('resize', debounce(reset,1000));

//stop scrolling
window.addEventListener("scroll", preventMotion, {passive: false});
window.addEventListener("touchmove", preventMotion,  {passive: false});

function preventMotion(event)
{
    window.scrollTo(0, 0);
    event.preventDefault();
    event.stopPropagation();
}

// container.style.width = window.innerWidth + 'px';
// container.style.height = window.innerHeight + 'px';

menuHead.textContent = 'Maze Game';
menu.classList.remove('hidden');
