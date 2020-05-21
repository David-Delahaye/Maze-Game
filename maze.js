const createMaze = ({
    root,
    difficulty,
    width,
    height,
})=>{
    worldBuild(root,difficulty,width,height);
    mazeBuild(width,height);
    const {player,goal,enemy} = spritesBuild(width,height);
    controlsInit(Body,player,speedx,speedy);
    eventsBuild(enemy);
}
