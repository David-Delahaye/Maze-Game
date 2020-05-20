let game = document.querySelector('#game');
let levelDisplay = document.querySelector('#level');
let coinDisplay = document.querySelector('#coins');
let level = 1;
let coins = 0;

const update = () => {
levelDisplay.innerHTML = 'Level: ' + level;
coinDisplay.innerHTML = 'Coins: '+coins;
}

update();

const newLevel = () => {

createMaze({
    root:game,
    difficulty:(level*0.1)+1,
    width: game.clientWidth,
    height: game.clientHeight,
})
}

const win = () => {
    level++
    newLevel();
    update();
}

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
    game.innerHTML = ''
    newLevel();
}

window.addEventListener('resize', debounce(reset,1000));
newLevel();