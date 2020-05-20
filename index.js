const game = document.querySelector('#game');
let level = 1;

createMaze({
    root:game,
    difficulty:level,
    width: game.clientWidth,
    height: game.clientHeight,
})

const win = () => {
    level+= 0.1
    createMaze({
        root:game,
        difficulty:level,
        width: game.clientWidth,
        height: game.clientHeight,
    })
}