//Initialize--------------------------------------------------------
const worldBuild = (root,difficulty,width,height) =>{
    Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Bounds = Matter.Bounds,
    Events = Matter.Events,
    columns = Math.round(width/200 * difficulty),
    rows = Math.round(height/200 * difficulty),
    unitWidth = width/columns,
    unitHeight = height/rows,
    unitThickness = 100/rows,
    friction = 0.1406,
    speed = 10*(10/rows) * (width/600) * (rows/columns),
    hue = Math.floor(Math.random()*350),
    // create an engine
    engine = Engine.create(),
    world = engine.world,
    // create a renderer
    render = Render.create({
    element: root,
    engine: engine,
    options:{
        wireframes:false,
        width:width,
        height:height,
        background: 'hsl('+hue+',40%,10%)'
    }
    })
    Engine.run(engine);
    Runner.run(Runner.create(),engine);
    Render.run(render);
    engine.world.gravity.y = 0;
    
}

//Maze Gen-----------------------------------------------------------------------------------------
const mazeBuild = (width,height) =>{
    //walls -------------
    const walls =[
        //bottom
        Bodies.rectangle(width/2, height, width, unitThickness, { isStatic: true, render:{fillStyle: 'hsl('+hue+',40%,40%)'}}),
        //left
        Bodies.rectangle(0, height/2, unitThickness, height,  { isStatic: true, render:{fillStyle: 'hsl('+hue+',40%,40%)'}}),
        //right
        Bodies.rectangle(width,height/2, unitThickness,height,  { isStatic: true, render:{fillStyle: 'hsl('+hue+',40%,40%)'}}),
        //top
        Bodies.rectangle(width/2,0,width, unitThickness,  { isStatic: true, render:{fillStyle: 'hsl('+hue+',40%,40%)'}})]
        
    // add walls
    World.add(world, walls);
    
    //maze Generation ---------------
    const grid = Array(rows)
        .fill(null)
        .map(()=> Array(columns).fill(false));
    
    const verticals = Array(rows)
        .fill(null)
        .map(()=> Array(columns-1).fill(false));
    
    const horizontals = Array(rows-1)
        .fill(null)
        .map(()=> Array(columns).fill(false));
    
    //starting cell
    const startx = Math.floor(Math.random()*rows);
    const starty = Math.floor(Math.random()*columns);
    
    const shuffle = (arr) =>{
        for (let i = arr.length-1; i >= 1; i--) {
            const random = Math.floor(Math.random()* i);
            const temp = arr[i];
            arr[i] = arr[random];
            arr[random] = temp;
        }
        return arr;
    }
    
    //Step Iterator
    const stepThroughCell = (row, column)=>{
        //if i have visited th cell at row,column then return
        if(grid[row][column]){
            return
        }
        //mark the cell as visited
        grid[row][column] = true;
    
        //Assemble list of neibours RANDOM
        const neighbours = shuffle([
            [row-1, column, 'up'],
            [row+1, column, 'down'],
            [row, column-1, 'left'],
            [row, column+1, 'right'],
        ])
        
    
        //for each neighbour:---
        for (const neighbour of neighbours) {
            const [nextRow, nextColumn, direction] = neighbour;
    
        //check if neighbour is out of bounds
            if((nextRow < 0 || nextRow >= rows) || (nextColumn <0 || nextColumn >= columns)){
                continue;
            }
    
        //check if  visited that neigbour
            if(grid[nextRow][nextColumn]){
                continue;
            }
    
        //remove a wall from either horizontal or vertical array
            if(direction === 'left'){
                verticals[row][column-1] = true;
            }else if(direction ==='right'){
                verticals[row][column] = true;
            }else if(direction ==='up'){
                horizontals[row-1][column] = true;
            }else if(direction ==='down'){
                horizontals[row][column] = true;
            }
    
        //visit that cell
            stepThroughCell(nextRow,nextColumn)
        }
    
    }
    
    stepThroughCell(startx,starty);
    //Draw the maze walls
    horizontals.forEach((row, rowIndex)=>{
        row.forEach((open, columnIndex)=> {
            if(open === true){
                return
            }
            const wall = Bodies.rectangle(
                (columnIndex * unitWidth) + (unitWidth/2),
                (rowIndex * unitHeight) + unitHeight,
                unitWidth,
                unitThickness,
                {isStatic:true,
                label:'wall',
                slop:0.5,
                render: {
                    fillStyle: 'hsl('+hue+',40%,40%)'
                }
                }
            )
            World.add(world, wall);
        })
    })
    verticals.forEach((row, rowIndex)=>{
        row.forEach((open, columnIndex)=> {
            if(open === true){
                return
            }
            const wall = Bodies.rectangle(
                (columnIndex * unitWidth) + unitWidth,
                (rowIndex * unitHeight) + (unitHeight/2),
                unitThickness,
                unitHeight,
                {isStatic:true,
                label:'wall',
                slop:0.5,
                    render: {
                        fillStyle: 'hsl('+hue+',40%,40%)'
                    }
                    }
            )
            World.add(world, wall);
        })
    })
    
    for(let x = 0; x < columns +1; x++){
        for (let y = 0; y < rows + 1; y++) {
            const nub = Bodies.rectangle(
                unitWidth * x,
                unitHeight * y,
                unitThickness,
                unitThickness,
                {isStatic:true,
                label:'wall',
                friction:0,
                slop:0.5,
                render: {
                    fillStyle: 'hsl('+hue+',40%,30%)'
                }}
            )
            World.add(world,nub)
        }
    }
}

const worldClear = (world,engine,render) =>{
    World.clear(world);
    Engine.clear(engine);
    Render.stop(render);
    render.canvas.remove();
    render.canvas = null;
    render.context = null;
}

//EVENTS BUILD ====================================================================================================================================================
const eventsBuild = () =>{
Events.on(engine, 'collisionStart', event => {
    event.pairs.forEach (collision => {
        const winLabels = ['player', 'goal'];
        const coinLabels = ['player', 'coin']

        //Win Condition
        if (winLabels.includes(collision.bodyA.label) && winLabels.includes(collision.bodyB.label)){
            // world.gravity.y = 1;
            // world.bodies.forEach(body => {
            //     if(body.label === 'wall'){
            //         Body.setStatic(body, false);
            //     }
            // })
            worldClear(world,engine,render);
            win();
        }

        // Coin Pickup
        if (coinLabels.includes(collision.bodyA.label) && coinLabels.includes(collision.bodyB.label)){
            if (collision.bodyA.label === 'coin')
                {World.remove(world,collision.bodyA)}
            else{
                {World.remove(world,collision.bodyB)}    
            }
            coinPickup();
        }
    })
})

}



//sprites=========================================================================================================================================
const spritesBuild = (width,height) => {
    const goal = Bodies.rectangle(
        (width - unitWidth/2),
        (height  - unitHeight/2),
        unitWidth - unitThickness,
        unitHeight - unitThickness,
        {isStatic:true,
        label:'goal',
        render: {
            fillStyle: 'hsl('+(hue+170)+',70%,40%)'
            }
        }
    )
    World.add(world,goal)
    
    const player = Bodies.rectangle(
        (unitWidth/2),
        (unitHeight/2),
        unitWidth - unitThickness,
        unitHeight - unitThickness,
        {
        inertia:Infinity,
        frictionAir:friction,
        friction:0,
        slop:0.5,
        density:1,
        label:'player',
        render: {
                fillStyle: 'hsl('+hue+',70%,40%)'
            },
        }
    )
    World.add(world,player);

    for(let i = 0; i<5;i++){
    const coin = Bodies.rectangle(
        (Math.floor(Math.random()*columns) * unitWidth) + unitWidth/2,
        (Math.floor(Math.random()*rows) * unitHeight) + unitHeight/2,
        (unitWidth/2),
        (unitHeight/2),
        {
        isStatic:true,
        label:'coin',
        isSensor:true,
        render:{
            fillStyle: 'hsl('+(hue + 170)+',70%,40%)'
        }
        }
    )
    World.add(world,coin)
    }
    return {player,goal}
   }

   //Controller =================================================================================================================================
const controlsInit = (Body, player, speed)=>{
    document.addEventListener('keydown', (event) =>{
        const {x,y} = player.velocity;
        if (event.keyCode === 87){
            // console.log('move player up');
            Body.setVelocity(player, {x, y:y-speed})
        }
        if (event.keyCode === 68){
            // console.log('move player right');
            Body.setVelocity(player, {x:x+speed, y})
        }
        if (event.keyCode === 83){
            // console.log('move player down');
            Body.setVelocity(player, {x, y:y+speed})
        }
        if (event.keyCode === 65){
            // console.log('move player left');
            Body.setVelocity(player, {x:x-speed, y})
        }
    })
    }