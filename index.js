let game = document.querySelector('#game');
let levelDisplay = document.querySelector('#level');
let coinDisplay = document.querySelector('#coins');
let winDisplay = document.querySelector('.win');
let nextLevelInput = document.querySelector('#next-level')
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
    difficulty:(level*0.02)+1,
    width:game.clientWidth,
    height:game.clientHeight,

})
}

const win = () => {
    winDisplay.classList.remove('hidden');
}

nextLevelInput.addEventListener('click', ()=>{
    worldClear();
    winDisplay.classList.add('hidden');
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

window.addEventListener('resize', debounce(reset,1000));
newLevel();