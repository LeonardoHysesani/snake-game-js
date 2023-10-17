function game() {
    let canvasSize = 500
    let blockSize = 10
    let gridSize = canvasSize/blockSize
    let tickInterval = 100
    let score = {
        value: -1,
        increment: () => {
            score.value++

            // 1% speed increase for every food eaten
            tickInterval *= 0.8
        },
        reset: () => {
            score.value = -1
            tickInterval = 100
        }
    };
    let food = {
        x: 25,
        y: 25,
        generateNew: () => {
            food.x = Math.round(Math.random() * (gridSize - 1))
            food.y = Math.round(Math.random() * (gridSize - 1))

            let flag = false;

            if (food.x === snake.head.x || food.y === snake.head.y) {
                flag = true
            }
            for (const bodyElement of snake.body) {
                if (food.x === snake.body.x || food.y === snake.body.y) {
                    flag = true
                    break
                }
            }

            if (flag) {
                food.generateNew()
            }

            score.increment()
        }
    }
    function getSnake() {
        return {
            head: {
                x: 3,
                y: 0
            },
            direction: {
                x: 1,
                y: 0
            },
            body: [
                {x: 2, y: 0},
                {x: 1, y: 0},
                {x: 0, y: 0},
            ],
            colors: {
                head: "#00ff00",
                body: "#aaff00"
            },
            cachedDirection: {
                x: 1,
                y: 0
            },
            changeDirection: (newDirectionX, newDirectionY) => {
                let newDirection = {
                    isDiagonal: newDirectionX * newDirectionY !== 0,
                    isOpposing: newDirectionX + snake.cachedDirection.x === 0 || newDirectionX + snake.cachedDirection.x === 0,
                }
                // make sure one of the two is always zero,
                // so we don't have diagonal direction
                if (!newDirection.isDiagonal && !newDirection.isOpposing) {
                    snake.direction.x = newDirectionX
                    snake.direction.y = newDirectionY
                }
            },
            move: () => {
                let predecessor = {x: snake.head.x, y: snake.head.y}

                // move forward based on current direction
                snake.head.x += snake.direction.x
                snake.head.y += snake.direction.y

                // artificially forcing positive only values,
                // by virtually moving our snake one grid length to the positive axis'
                snake.head.x += gridSize
                snake.head.y += gridSize

                // stay within actual grid
                snake.head.x %= gridSize
                snake.head.y %= gridSize

                // check if ate food
                if (food.x === snake.head.x && food.y === snake.head.y) {
                    //grow body without moving
                    snake.body.unshift(predecessor)
                    food.generateNew()
                }
                else {
                    // make body follow
                    for (let i = 0; i < snake.body.length; i++) {
                        let temp = snake.body[i]
                        snake.body[i] = predecessor
                        predecessor = temp
                    }
                }


                // cache current direction
                // we do it this way because javascript would use pass by reference by default
                // I hate this language
                Object.assign(snake.cachedDirection, snake.direction)

                // check for collision
                for (const bodyElement of snake.body) {
                    if (snake.head.x === bodyElement.x && snake.head.y === bodyElement.y) {
                        alert("Game over!")
                        restart()
                    }
                }
            }
        }
    }
    let snake = getSnake()

    function restart() {
        score.reset()
        snake = getSnake()
        food.generateNew()
    }

    document.addEventListener("keydown", (ev) => {
        switch (ev.key) {
            case "w":
                snake.changeDirection(0, -1)
                break
            case "s":
                snake.changeDirection(0, 1)
                break
            case "a":
                snake.changeDirection(-1, 0)
                break
            case "d":
                snake.changeDirection(1, 0)
                break
        }
    })

    function draw() {
        let canvas = document.getElementById("game-canvas")
        let ctx = canvas.getContext("2d")

        // background
        ctx.fillStyle = "#000000"
        ctx.fillRect(0, 0, canvasSize, canvasSize)

        // snake
        // head
        ctx.fillStyle = snake.colors.head
        ctx.fillRect(
            snake.head.x*blockSize,
            snake.head.y*blockSize,
            blockSize,
            blockSize
        )

        // body
        ctx.fillStyle = snake.colors.body
        for (const bodypart of snake.body) {
            ctx.fillRect(
                bodypart.x*blockSize,
                bodypart.y*blockSize,
                blockSize,
                blockSize
            )
        }

        // food
        ctx.fillStyle = "#ff0000"
        ctx.fillRect(food.x*blockSize, food.y*blockSize, blockSize, blockSize)
    }

    function updateScoreboard() {
        document.getElementById("scoreboard").innerHTML = score.value.toString()
    }

    function tick() {
        snake.move()
        draw()
        updateScoreboard()
        window.setTimeout(tick, tickInterval)
    }
    function getGameCanvas() {
        let canvas = document.createElement("canvas")
        canvas.id = "game-canvas"
        canvas.width = canvasSize
        canvas.height = canvasSize
        return canvas
    }

    function getScoreBoard() {
        let div = document.createElement("div")
        div.id = "scoreboard"
        return div
    }

    function getTickInterval() {

    }

    function getGameDiv() {
        let gameDiv = document.createElement("div")
        gameDiv.id = "game-div"
        gameDiv.appendChild(getScoreBoard())
        gameDiv.appendChild(getGameCanvas())
        window.setTimeout(tick, tickInterval)
        return gameDiv
    }

    function getOuterWrapper() {
        let outerWrapper = document.createElement("div")
        outerWrapper.id = "outer-wrapper"
        outerWrapper.appendChild(getGameDiv())
        return outerWrapper
    }

    document.body.replaceChildren(getOuterWrapper())
    food.generateNew()
}


window.onload = () => {
    game()
}

