const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const score = document.querySelector(".score--value")

const audio = new Audio("../assets/audio.mp3")
const finalScore = document.querySelector(".final--score > span")
const menu = document.querySelector(".menu--screen")
const buttonPlay = document.querySelector(".btn--play")

const size = 30

const initialPosition = { x: 270, y: 240 }

let snake = [initialPosition]

const incrementScore = () => {
    score.innerText = +score.innerText + 1
}

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}
const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30
}

const randomColor = () => {

    const red = randomNumber(0, 255)
    const green = randomNumber(0, 255)
    const yellow = randomNumber(0, 255)
    const blue = randomNumber(0, 255)

    return `rgb(${red}, ${green}, ${yellow}, ${blue})`

}


const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()

}

let direction = "right"
let loopId


const drawFood = () => {
    const { x, y } = food;

    // Desenhar a maçã
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();

    // Desenhar o caule da maçã
    ctx.beginPath();
    ctx.rect(x + size / 2 - size / 20, y - size / 8, size / 10, size / 4);
    ctx.fillStyle = 'brown';
    ctx.fill();

    // Desenhar a folha da maçã
    ctx.beginPath();
    ctx.arc(x + size / 2, y - size / 8, size / 6, Math.PI, 2 * Math.PI);
    ctx.fillStyle = 'green';
    ctx.fill();
};





const drawSnake = () => {
    snake.forEach((position, index) => {
        // Desenha o corpo ou a cabeça
        ctx.beginPath();
        ctx.arc(position.x + size / 2, position.y + size / 2, size / 2, 0, 2 * Math.PI);

        // Alterna as cores dos segmentos do corpo
        if (index % 2 === 0) {
            ctx.fillStyle = "#74c961"; // Cor mais clara
        } else {
            ctx.fillStyle = "#5bb547"; // Cor mais escura
        }

        // A cabeça mantém a cor original
        if (index === snake.length - 1) {
            ctx.fillStyle = "#359620"; // Cor da cabeça
        }

        ctx.fill();

        // Se for a cabeça, desenha os detalhes
        if (index === snake.length - 1) {

            ctx.beginPath();
            ctx.ellipse(position.x + 2 * size / 3, position.y + size / 3, size / 10, size / 20, 0, 0, 2 * Math.PI);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(position.x + 2 * size / 3, position.y + size / 3, size / 20, 0, 2 * Math.PI);
            ctx.fillStyle = 'black';
            ctx.fill();

            // Língua
            ctx.beginPath();
            ctx.strokeStyle = "#de0000"; // Cor vermelha para a linha da língua
            ctx.lineWidth = 2; // Definindo uma espessura para a linha
            let tongueOutX = position.x + size; // Posição X onde a língua começa
            let tongueOutY = position.y + size / 2; // Posição Y onde a língua começa

            // Desenha a língua para fora da boca
            ctx.moveTo(tongueOutX, tongueOutY);
            ctx.lineTo(tongueOutX + size / 4, tongueOutY);
            ctx.stroke(); // Desenha o meio da língua

            // Bifurcação da língua
            ctx.moveTo(tongueOutX + size / 4, tongueOutY);
            ctx.lineTo(tongueOutX + size / 3 + size / 20, tongueOutY - size / 20);
            ctx.moveTo(tongueOutX + size / 4, tongueOutY);
            ctx.lineTo(tongueOutX + size / 3 + size / 20, tongueOutY + size / 20);
            ctx.stroke(); // Desenha as bifurcações da língua
        }
    });
};











const moveSnake = () => {

    if (!direction) return

    const head = snake[snake.length - 1]


    if (direction == "right") {
        snake.push({ x: head.x + size, y: head.y })
    }
    if (direction == "left") {
        snake.push({ x: head.x - size, y: head.y })
    }
    if (direction == "down") {
        snake.push({ x: head.x, y: head.y + size })
    }
    if (direction == "up") {
        snake.push({ x: head.x, y: head.y - size })
    }
    snake.shift()
}

const drawGrid = () => {
    // ctx.lineWidth = 1
    // ctx.strokeStyle = "#a2db93"

    // for (let i = 30; i < canvas.width; i += 30) {
    //     ctx.beginPath()
    //     ctx.lineTo(i, 0)
    //     ctx.lineTo(i, 600)
    //     ctx.stroke()

    //     ctx.beginPath()
    //     ctx.lineTo(0, i)
    //     ctx.lineTo(600, i)
    //     ctx.stroke()
    // }


}

const chackEat = () => {
    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y) {
        incrementScore()
        snake.push(head)
        audio.play()

        let x = randomPosition()
        let y = randomPosition()

        while (snake.find((position) => position.x == x && position.y == y)){
            x = randomPosition()
            y = randomPosition()
        }
        food.x = x
        food.y = y
        food.color = randomColor()
    }
}

const checkCollision = () =>{
    const head = snake[snake.length - 1]
    const canvasLimit = canvas.width - size
    const neckIndex = snake.length - 2

    const wallCollision =
        head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    const selfCollision = snake.find((position, index)=>{
        return index < neckIndex && position.x == head.x && position.y == head.y
    })


    if(wallCollision || selfCollision) {
        gameOver()
    }
}

const gameOver = () => {
    direction = undefined

    menu.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(1px)"
}

const gameLoop = () => {
    clearInterval(loopId)

    ctx.clearRect(0, 0, 600, 600)
    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    chackEat()
    checkCollision()

    loopId = setTimeout(() => {
        gameLoop()
    }, 300)
}


gameLoop()

document.addEventListener("keydown", ({ key }) => {

    if (key == "ArrowRight" && direction != "left") {
        direction = "right"
    }
    if (key == "ArrowLeft" && direction != "right") {
        direction = "left"
    }
    if (key == "ArrowDown" && direction != "up") {
        direction = "down"
    }
    if (key == "ArrowUp" && direction != "down") {
        direction = "up"
    }

})

buttonPlay.addEventListener("keydowm",({})=>{
})

buttonPlay.addEventListener("click", ()=>{
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    snake = [initialPosition]
})


