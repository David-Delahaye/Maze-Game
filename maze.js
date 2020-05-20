const createMaze = ({
    root,
    difficulty,
    width,
    height,
})=>{
    worldBuild(root,difficulty,width,height);
    mazeBuild(width,height);
    const {player,goal} = spritesBuild(width,height);
    controlsInit(Body,player,speed);
    eventsBuild();
}
