function Game(root, level, width, height){
    this.difficulty = 1.4;
    for(let i = 0; i < level ;i++){
      this.difficulty += (i*0.7/level)*0.05;
    }
    if (level % 10 === 0) {
      this.difficulty += 0.5;
    }
    (this.width = width), (this.height = height);
    if (width > height) {
      this.columns = Math.round(2 * (width / height) * this.difficulty);
      this.rows = Math.round(2 * this.difficulty);
    } else {
      this.columns = Math.round(2 * this.difficulty);
      this.rows = Math.round(2 * (height / width) * this.difficulty);
    }
    // this.columns = Math.round(width / 100 * this.difficulty),
    // this.rows = Math.round(height / 100 * this.difficulty),
    (this.unitWidth = width / this.columns),
      (this.unitHeight = height / this.rows),
      (this.unitThickness = 100 / this.rows),
      (this.friction = 0.249),
      (this.speedx = ((50 * width) / 600) * (4 / this.columns)),
      (this.speedy = ((50 * height) / 600) * (4 / this.rows)),
      (this.hue = Math.floor(Math.random() * 356)),
      // create an engine
      (this.engine = Engine.create()),
      (this.world = this.engine.world),
      // create a renderer
      (this.render = Render.create({
        element: root,
        engine: this.engine,
        options: {
          wireframes: false,
          width: width,
          height: height,
          background: gameData.color.back(),
        },
      }));
    Engine.run(this.engine);
    Runner.run(Runner.create(), this.engine);
    Render.run(this.render);
    this.engine.world.gravity.y = 0;
  }
  //Maze Gen-----------------------------------------------------------------------------------------
  Game.prototype.mazeBuild = function(){
    const {
      width,
      height,
      unitThickness,
      hue,
      world,
      rows,
      columns,
      unitWidth,
      unitHeight,
    } = this;
    this.walls = [];
    //walls -------------
    const edges = [
      //bottom
      Bodies.rectangle(width / 2, height, width, unitThickness, {
        isStatic: true,
        render: { fillStyle: gameData.color.wall()},
      }),
      //left
      Bodies.rectangle(0, height / 2, unitThickness, height, {
        isStatic: true,
        render: { fillStyle: gameData.color.wall()},
      }),
      //right
      Bodies.rectangle(width, height / 2, unitThickness, height, {
        isStatic: true,
        render: { fillStyle: gameData.color.wall()},
      }),
      //top
      Bodies.rectangle(width / 2, 0, width, unitThickness, {
        isStatic: true,
        render: { fillStyle: gameData.color.wall()},
      }),
    ];

    // add walls
    World.add(world, edges);
    for (const edge of edges){
      this.walls.push(edge);
    }

    //maze Generation ---------------
    const grid = Array(rows)
      .fill(null)
      .map(() => Array(columns).fill(false));

    this.verticals = Array(rows)
      .fill(null)
      .map(() => Array(columns - 1).fill(false));

    this.horizontals = Array(rows - 1)
      .fill(null)
      .map(() => Array(columns).fill(false));

    //starting cell
    const startx = rows - 1;
    const starty = columns - 1;
    // const startx = Math.floor(Math.random()*rows);
    // const starty = Math.floor(Math.random()*columns);

    const shuffle = (arr) => {
      for (let i = arr.length - 1; i >= 1; i--) {
        const random = Math.floor(Math.random() * i);
        const temp = arr[i];
        arr[i] = arr[random];
        arr[random] = temp;
      }
      return arr;
    };

    //Step Iterator
    const stepThroughCell = (row, column) => {
      //if i have visited th cell at row,column then return
      if (grid[row][column]) {
        return;
      }
      //mark the cell as visited
      grid[row][column] = true;

      //Assemble list of neibours RANDOM
      const neighbours = shuffle([
        [row - 1, column, "up"],
        [row + 1, column, "down"],
        [row, column - 1, "left"],
        [row, column + 1, "right"],
      ]);

      //for each neighbour:---
      for (const neighbour of neighbours) {
        const [nextRow, nextColumn, direction] = neighbour;

        //check if neighbour is out of bounds
        if (
          nextRow < 0 ||
          nextRow >= rows ||
          nextColumn < 0 ||
          nextColumn >= columns
        ) {
          continue;
        }

        //check if  visited that neigbour
        if (grid[nextRow][nextColumn]) {
          continue;
        }

        //remove a wall from either horizontal or vertical array
        if (direction === "left") {
          this.verticals[row][column - 1] = true;
        } else if (direction === "right") {
          this.verticals[row][column] = true;
        } else if (direction === "up") {
          this.horizontals[row - 1][column] = true;
        } else if (direction === "down") {
          this.horizontals[row][column] = true;
        }

        //visit that cell
        stepThroughCell(nextRow, nextColumn);
      }
    };

    stepThroughCell(startx, starty);
    //Draw the maze walls
    this.horizontals.forEach((row, rowIndex) => {
      row.forEach((open, columnIndex) => {
        if (open === true) {
          return;
        }
        const wall = Bodies.rectangle(
          columnIndex * unitWidth + unitWidth / 2,
          rowIndex * unitHeight + unitHeight,
          unitWidth,
          unitThickness,
          {
            isStatic: true,
            label: "wall",
            slop: 0,
            friction: 0,
            render: {
              fillStyle: gameData.color.wall(),
            },
          }
        );
        World.add(world, wall);
        this.walls.push(wall);
      });
    });
    this.verticals.forEach((row, rowIndex) => {
      row.forEach((open, columnIndex) => {
        if (open === true) {
          return;
        }
        const wall = Bodies.rectangle(
          columnIndex * unitWidth + unitWidth,
          rowIndex * unitHeight + unitHeight / 2,
          unitThickness,
          unitHeight,
          {
            isStatic: true,
            label: "wall",
            friction: 0,
            slop: 0,
            density: 1,
            render: {
              fillStyle: gameData.color.wall(),
            },
          }
        );
        World.add(world, wall);
        this.walls.push(wall);
      });
    });

    for (let x = 0; x < columns + 1; x++) {
      for (let y = 0; y < rows + 1; y++) {
        const nub = Bodies.rectangle(
          unitWidth * x,
          unitHeight * y,
          unitThickness,
          unitThickness,
          {
            isStatic: true,
            label: "wall",
            friction: 0,
            slop: 0,
            density: 1,
            render: {
              fillStyle: gameData.color.nub(),
            },
          }
        );
        World.add(world, nub);
      }
    }
  };

  Game.prototype.worldClear = function(){
    World.clear(this.world);
    Engine.clear(this.engine);
    Render.stop(this.render);
    this.render.canvas.remove();
    this.render.canvas = null;
    this.render.context = null;
  };

  //sprites=========================================================================================================================================
  Game.prototype.spritesBuild = function(){
    const {
      width,
      height,
      unitHeight,
      unitWidth,
      unitThickness,
      hue,
      world,
      friction,
      rows,
      columns,
    } = this;
    const goal = Bodies.rectangle(
      width - unitWidth / 2,
      height - unitHeight / 2,
      unitWidth - unitThickness,
      unitHeight - unitThickness,
      {
        isStatic: true,
        label: "goal",
        isSensor: true,
        render: {
          fillStyle: gameData.color.goal(),
        },
      }
    );
    World.add(world, goal);

    this.player = Bodies.rectangle(
      unitWidth / 2,
      unitHeight / 2,
      unitWidth - (unitThickness * 0.90),
      unitHeight - (unitThickness * 0.90),
      {
        inertia: Infinity,
        frictionAir: friction,
        frictionStatic: 40,
        friction: 0,
        slop: 0,
        label: "player",
        render: {
          fillStyle: gameData.color.player(),
        },
      }
    );
    World.add(world, this.player);

    for (let i = 0; i < (((rows * columns)/10)); i++) {
      const coin = Bodies.rectangle(
        Math.floor(Math.random() * columns) * unitWidth + unitWidth / 2,
        Math.floor(Math.random() * rows) * unitHeight + unitHeight / 2,
        unitWidth / 4,
        unitHeight / 4,
        {
          isStatic: true,
          label: "coin",
          isSensor: true,
          render: {
            fillStyle: gameData.color.goal(),
          },
        }
      );
      World.add(world, coin);
    }

    this.enemies = [];
    for (let i = 0; i < Math.floor(this.difficulty - 1); i++) {
      const sideways = Math.random();
      if (sideways > 0.5) {
        for (let i = 0; i < 10; i++) {
          const plotX = Math.floor(Math.random() * this.columns);
          const plotY = Math.floor(Math.random() * (this.rows - 1));
          if (this.horizontals[plotY][plotX]) {
            const enemy = Bodies.rectangle(
              plotX * unitWidth + unitWidth / 2,
              plotY * unitHeight + unitHeight,
              unitWidth - unitThickness,
              unitThickness,
              {
                inertia: Infinity,
                frictionAir: friction,
                friction: 0,
                slop: 0,
                isStatic: true,
                isSensor: true,
                label: "enemy",
                render: {
                  fillStyle: gameData.color.wall(),
                },
              }
            );
            World.add(world, enemy);
            this.enemies.push(enemy);
            break;
          }
        }
      } else {
        for (let i = 0; i < 10; i++) {
          const plotX = Math.floor(Math.random() * this.columns);
          const plotY = Math.floor(Math.random() * this.rows);
          if (this.verticals[plotY][plotX]) {
            const enemy = Bodies.rectangle(
              plotX * unitWidth + unitWidth,
              plotY * unitHeight + unitHeight / 2,
              unitThickness,
              unitHeight - unitThickness,
              {
                inertia: Infinity,
                frictionAir: friction,
                friction: 0,
                slop: 0,
                isStatic: true,
                isSensor: true,
                label: "enemy",
                render: {
                  fillStyle: gameData.color.wall(),
                },
              }
            );
            World.add(world, enemy);
            this.enemies.push(enemy);
            break;
          }
        }
      }
    }
  };
  //EVENTS BUILD ====================================================================================================================================================
  Game.prototype.eventsBuild = function(){
    const { engine, world } = this;
    Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach((collision) => {
        const winLabels = ["player", "goal"];
        const coinLabels = ["player", "coin"];
        const enemyLabels = ["player", "enemy"];

        //Win Condition
        if (
          winLabels.includes(collision.bodyA.label) &&
          winLabels.includes(collision.bodyB.label)
        ) {
          win();
        }

        // Coin Pickup
        if (
          coinLabels.includes(collision.bodyA.label) &&
          coinLabels.includes(collision.bodyB.label)
        ) {
          if (collision.bodyA.label === "coin") {
            World.remove(world, collision.bodyA);
          } else {
            {
              World.remove(world, collision.bodyB);
            }
          }
          coinPickup();
        }

        if (
          enemyLabels.includes(collision.bodyA.label) &&
          enemyLabels.includes(collision.bodyB.label)
        ) {
          if (collision.bodyA.label === "enemy") {
            collision.bodyA.render.opacity = 0.1;
          } else {
            collision.bodyB.render.opacity = 0.1;
          }
        }
      });
    });
  };
  //Controller =================================================================================================================================
  Game.prototype.controlsBuild = function(){
    const {
      player,
      unitThickness,
      unitWidth,
      unitHeight,
      walls,
      speedx,
      speedy,
    } = this;
    const { x, y } = this.player.velocity;

    document.removeEventListener("keydown", handleKeyMove);
    document.addEventListener("keydown", handleKeyMove);

    function handleKeyMove(event) {
      // console.log('move player up');
      if(gameData.active){
      if (event.keyCode === 87) {
        const point = Vector.create(
          player.vertices[0].x + unitWidth / 2,
          player.vertices[0].y - unitThickness / 2
        );
        if (moveCheck(point, walls)) {
          Body.setVelocity(player, { x, y: y - speedy });
        }
      }

      // console.log('move player right');
      if (event.keyCode === 68) {
        const point = Vector.create(
          player.vertices[1].x + unitThickness / 2,
          player.vertices[1].y + unitHeight / 2
        );
        if (moveCheck(point, walls)) {
          Body.setVelocity(player, { x: x + speedx, y });
        }
      }

      // console.log('move player down');
      if (event.keyCode === 83) {
        const point = Vector.create(
          player.vertices[2].x - unitWidth / 2,
          player.vertices[2].y + unitThickness / 2
        );
        if (moveCheck(point, walls)) {
          Body.setVelocity(player, { x, y: y + speedy });
        }
      }

      // console.log('move player left');
      if (event.keyCode === 65) {
        const point = Vector.create(
          player.vertices[3].x - unitThickness / 2,
          player.vertices[3].y - unitHeight / 2
        );
        if (moveCheck(point, walls)) {
          Body.setVelocity(player, { x: x - speedx, y });
        }
      }
    }
    }

    //check if wall in the way
    const moveCheck = (point, walls) => {
      let blocked = false;
      for (const wall of walls) {
        if (Bounds.contains(wall.bounds, point)) {
          blocked = true;
        }
      }
      return !blocked;
    };

    //Mobile swipe support
    document.addEventListener("touchstart", handleTouchStart, false);
    document.addEventListener("touchmove", handleTouchMove, false);

    var xDown = null;
    var yDown = null;

    function getTouches(evt) {
      return (
        evt.touches || evt.originalEvent.touches // browser API
      ); // jQuery
    }

    function handleTouchStart(evt) {
      const firstTouch = getTouches(evt)[0];
      xDown = firstTouch.clientX;
      yDown = firstTouch.clientY;
    }

    function handleTouchMove(evt) {
      if(gameData.active){
      if (!xDown || !yDown) {
        return;
      }

      var xUp = evt.touches[0].clientX;
      var yUp = evt.touches[0].clientY;

      var xDiff = xDown - xUp;
      var yDiff = yDown - yUp;

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        /*most significant*/
        if (xDiff > 0) {
          //left
          const point = Vector.create(
            player.vertices[3].x - unitThickness / 2,
            player.vertices[3].y - unitHeight / 2
          );
          if (moveCheck(point, walls)) {
            Body.setVelocity(player, { x: x - speedx, y });
          }
        } else {
          //right
          const point = Vector.create(
            player.vertices[1].x + unitThickness / 2,
            player.vertices[1].y + unitHeight / 2
          );
          if (moveCheck(point, walls)) {
            Body.setVelocity(player, { x: x + speedx, y });
          }
        }
      } else {
        if (yDiff > 0) {
          //up
          const point = Vector.create(
            player.vertices[0].x + unitWidth / 2,
            player.vertices[0].y - unitThickness / 2
          );
          if (moveCheck(point, walls)) {
            Body.setVelocity(player, { x, y: y - speedy });
          }
        } else {
          //down
          const point = Vector.create(
            player.vertices[2].x - unitWidth / 2,
            player.vertices[2].y + unitThickness / 2
          );
          if (moveCheck(point, walls)) {
            Body.setVelocity(player, { x, y: y + speedy });
          }
        }
    }
      /* reset values */
      xDown = null;
      yDown = null;
    }
  }
  };
