const createMaze = ({
    root,
    difficulty,
    width,
    height,
})=>{
    worldBuild(root,difficulty,width,height);
    const walls = mazeBuild(width,height);
    const {player,goal,enemies} = spritesBuild(width,height);
    controlsInit(Body,player,walls);
    eventsBuild(enemies);
}
