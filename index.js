let game = document.querySelector('#game');
let level = 1.3;

const newLevel = () => {
createMaze({
    root:game,
    difficulty:level,
    width: game.clientWidth,
    height: game.clientHeight,
})
}

newLevel();
const win = () => {
    level+= 0.1
    newLevel();
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
