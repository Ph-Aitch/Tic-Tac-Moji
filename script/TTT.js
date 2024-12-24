const GameModule = (() => {
    // DOM Elements
    const cells = Array.from(document.querySelectorAll(".cell"))
    const display = document.querySelector(".display")
    const reset = document.querySelector("#reset")
    const form = document.querySelector("form")
    const container = document.querySelector(".formContainer")
    const theme = document.querySelector(".theme-toggler")
    const instructions = document.querySelector(".instructions")
    const legend = document.querySelector(".legend")

    // Game State Variables
    let player1
    let player2
    const icons = ["😎", "😡"]
    let score1 = 0
    let score2 = 0
    let turn = true

    // Initialize the game
    const init = () => {
        cells.forEach(cell => cell.addEventListener("click", handleCellClick))
        reset.addEventListener("click", resetGame)
        form.addEventListener("submit", handleFormSubmit)
        theme.addEventListener("click", toggleTheme)
        instructions.addEventListener("click", showInstructions)
        document.addEventListener("keydown", handleKeydown)
        mutual()
    }

    // Handle cell click
    const handleCellClick = (e) => {
        const cell = e.target
        if (cell.textContent === "") {
            if (turn) {
                display.textContent = `Current Turn: ${icons[1]}`
                cell.textContent = icons[0]
                cell.dataset.player = "1"
                cell.classList.toggle("active", true)
                gameState(cells, 1)
            } else {
                display.textContent = `Current Turn: ${icons[0]}`
                cell.textContent = icons[1]
                cell.dataset.player = "2"
                cell.classList.toggle("active", true)
                gameState(cells, 2)
            }
            turn = !turn
        }
    }

    // Check game state
    const gameState = (arr, player) => {
        const winConditions = [
            // horizontal
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            // vertical
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            // diagonal
            [0, 4, 8],
            [2, 4, 6]
        ]
        const playerCells = arr.map((cell, index) => cell.dataset.player === String(player) ? index : -1).filter(index => index !== -1)
        const hasWon = winConditions.some(condition => condition.every(index => playerCells.includes(index)))

        if (hasWon) {
            const winningCondition = winConditions.find(condition => condition.every(index => playerCells.includes(index)))
            winningCondition.forEach(index => {
                arr[index].style.backgroundColor = "lightgreen"
            })
            arr.forEach(cell => {
                if (cell.textContent === "") {
                    cell.textContent = " "
                    cell.classList.toggle("active", true)
                }
            })
            display.textContent = `${player === 1 ? player1 : player2} Won ${turn ? icons[0] : icons[1]}`
            turn ? score1++ : score2++
            updateScore()
            return
        }

        const isTie = arr.every(cell => cell.textContent !== "")
        if (isTie) {
            display.textContent = `It's a TIE GAME 🤝🏻`
        }
    }

    // Update score display
    const updateScore = () => {
        const label1score = document.querySelector(".player1score")
        const label2score = document.querySelector(".player2score")
        label1score.textContent = `${player1} ${icons[0]} Score: ${score1}`
        label2score.textContent = `${player2} ${icons[1]} Score: ${score2}`
    }

    // Reset game
    const resetGame = () => {
        cells.forEach(cell => {
            cell.dataset.player = ""
            cell.textContent = ""
            cell.style = ""
            cell.classList.toggle("active", false)
        })
        display.textContent = `Current Turn: ${icons[0]}`
        turn = true
    }

    // Handle form submission
    const handleFormSubmit = (e) => {
        e.preventDefault()
        const playerOne = document.querySelector("#player1")
        const playerTwo = document.querySelector("#player2")
        const playerOneEmoji = document.querySelector("#player1emoji")
        const playerTwoEmoji = document.querySelector("#player2emoji")

        player1 = playerOne.value
        player2 = playerTwo.value
        icons[0] = playerOneEmoji.value
        icons[1] = playerTwoEmoji.value
        score1 = 0
        score2 = 0

        updateScore()
        display.textContent = `Current Turn: ${icons[0]}`
        form.reset()
        container.style.left = "-10000px" // Hide the form
    }

    // Update mutual emoji selection
    const mutual = () => {
        const player1emoji = document.querySelector("#player1emoji")
        const player2emoji = document.querySelector("#player2emoji")

        const updateChange = () => {
            const player1Options = Array.from(player1emoji.options)
            const player2Options = Array.from(player2emoji.options)
            player1Options.forEach(option => {
                if (option.value !== "") {
                    if (option.value === player2emoji.value) {
                        option.disabled = true
                    } else {
                        option.disabled = false
                    }
                }
            })
            player2Options.forEach(option => {
                if (option.value !== "") {
                    if (option.value === player1emoji.value) {
                        option.disabled = true
                    } else {
                        option.disabled = false
                    }
                }
            })
        }

        player1emoji.addEventListener("change", updateChange)
        player2emoji.addEventListener("change", updateChange)
    }

    // Toggle theme
    const toggleTheme = () => {
        theme.classList.toggle("active")
        document.body.dataset.theme = document.body.dataset.theme === "" ? "light" : ""
    }

    // Show instructions
    const showInstructions = () => {
        legend.showModal()
        if (legend.open) {
            document.addEventListener("mousedown", () => {
                legend.close()
            })
        }
    }

    // Handle keyboard shortcuts
    const handleKeydown = (e) => {
        switch (e.key) {
            case "r":
            case "R":
                reset.click()
                break
            case "q":
            case "Q":
                if (container.style.left === "-10000px") {
                    reset.click()
                    container.style.left = "0"
                }
                break
            default:
                break
        }
    }

    // Initialize the game
    init()

})()