let game = document.querySelector('#game');
let levelDisplay = document.querySelector('#level');
let coinDisplay = document.querySelector('#coins');
let menu = document.querySelector('.menu');
let menuHead =document.querySelector('#menu-head')
let menuButton = document.querySelector('#menu-button');
let level = 1;
let coins = 0;


const update = () => {
levelDisplay.innerHTML = 'Level: ' + level;
coinDisplay.innerHTML = 'Coins: '+coins;
}
update();

const newLevel = (reason) => {
console.log(reason);
createMaze({
    root:game,
    difficulty:(level*0.02)+1.4,
    width:game.clientWidth,
    height:game.clientHeight,

})
}

const win = () => {
    menu.classList.remove('hidden');
    menuButton.style.backgroundColor = 'hsl('+hue+', 40%,30%)'
}

menuButton.addEventListener('click', ()=>{
    worldClear();
    menu.classList.add('hidden');
    level++
    newLevel('win');
    update();
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


const reset = () => {
    worldClear();
    newLevel('reset');
}

menuHead.textContent = 'Maze Game';
menu.classList.remove('hidden');

window.addEventListener('resize', debounce(reset,1000));

newLevel('win');