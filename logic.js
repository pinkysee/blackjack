const player = {
    "Points": 0,
    "Hand": [],
    "Skip": false,
}
const dealer = {
    "Points": 0,
    "Hand": [],
    "Skip": false,
}
let ismusic = false

let playerdinamic, dealerdinamic, gamecard, isgamego
let soundcard1, soundcard2, soundcard3, soundcard4, winsound, retrysound 

const cardKeys = [
    "2C", "2D", "2H", "2S",
    "3C", "3D", "3H", "3S",
    "4C", "4D", "4H", "4S",
    "5C", "5D", "5H", "5S",
    "6C", "6D", "6H", "6S",
    "7C", "7D", "7H", "7S",
    "8C", "8D", "8H", "8S",
    "9C", "9D", "9H", "9S",
    "10C", "10D", "10H", "10S",
    "AC", "AD", "AH", "AS",
    "JC", "JD", "JH", "JS",
    "KC", "KD", "KH", "KS",
    "QC", "QD", "QH", "QS"
];

class Player {
    constructor() {
        this.dealer = new Dealer();
        this.game = new Game()
    }
    skipPlayer() {
        playerdinamic.Skip = true
        this.dealer.dealerlogic()
    }

    getPlayer() {
        const card = this.game.getcard("player")
        playerdinamic.Hand.push(card[0])
        drawcard(card[0], "player")
        playerdinamic.Points += card[1]
        drawCount(playerdinamic.Points, "?")
        let f = this.game.gamestatus()
        if (f != "go") {
            this.game.stopGame(f)
        }
    }
}

class Dealer {
    constructor() {
        this.game = new Game()
    }
    skipDealer() {
        dealerdinamic.Skip = true
        if (this.game.gamestatus() != "go") {
            this.game.stopGame(this.game.gamestatus())
        }
    }

    getDealer() {
        const card = this.game.getcard("dealer")
        dealerdinamic.Points += card[1]
        dealerdinamic.Hand.push(card[0])
        drawcard(`BLUE_BACK`, "dealer")
        drawCount(playerdinamic.Points, "?")
        if (this.game.gamestatus() != "go") {
            this.game.stopGame(this.game.gamestatus())
        }

    }
    dealerlogic() { 
        if (!isgamego) { return }       
        let hasAce = () => {
            let b = dealerdinamic.Hand.forEach(element => {
                if (element.split("")[0] === "A") {
                    return true
                }
                return false
            });
            return b
        }   
        if (dealerdinamic.Points < 17 || (dealerdinamic.Points == 17 && hasAce)) {
            setTimeout(() => {
                this.getDealer();
                this.dealerlogic(); // Рекурсия после задержки
            }, Math.floor(Math.random() * 1001) + 1000);
        } else {
            this.skipDealer()
        }
    }
}

class Game {
    initgame() {
        isgamego = true
        playerdinamic = JSON.parse(JSON.stringify(player))
        dealerdinamic = JSON.parse(JSON.stringify(dealer))
        gamecard = [...cardKeys]
        const dealerinit = [this.getcard("dealer"), this.getcard("dealer")]
        const playerinit = [this.getcard("player"), this.getcard("player")]
        playerdinamic.Points = playerinit[0][1] + playerinit[1][1] 
        dealerdinamic.Points = dealerinit[0][1] + dealerinit[1][1]
        playerdinamic.Hand.push(playerinit[0][0], playerinit[1][0])
        dealerdinamic.Hand.push(dealerinit[0][0], dealerinit[1][0])
        drawCount(playerdinamic.Points, "?")

        drawcard(dealerinit[0][0], "dealer")
        drawcard(`BLUE_BACK`, "dealer")
        drawcard(playerinit[0][0], "player")
        drawcard(playerinit[1][0], "player")
        if (this.gamestatus() != "go") {this.stopGame(this.gamestatus())}
    }
    getcard(client) {
        const randomindex = Math.floor(Math.random() * gamecard.length)
        let card = gamecard[randomindex]

        gamecard.splice(randomindex, 1)
        switch (card.split("")[0]) {
            case "A":
                switch (client) {
                    case "dealer":
                        if (dealerdinamic.Points + 11 > 21) {
                            return [card, 1]
                        } else {
                            return [card, 11]
                        }
                    case "player":
                        if (playerdinamic.Points + 11 > 21) {
                            return [card, 1]
                        } else {
                            return [card, 11]
                        }
                }
            case "J":
                return [card, 10]
            case "K":
                return [card, 10]
            case "Q":
                return [card, 10]
            default:
                if (card.split("")[1] == "0") {return [card, 10]}
                return [card, parseInt(card.split("")[0])]
        }
    }
    stopGame(win) {
        document.getElementById("countcont").classList.toggle("ctninv")
        if (win == "Your") {winsound.play()}
        if (win == "Dealer"){losesound.play()}
        let divElement = document.getElementById("fortextwin");
        divElement.innerHTML = `<h1>${win} win!🎉</h1><br><p>Dealer score: ${dealerdinamic.Points} Your score: ${playerdinamic.Points}`

        document.querySelector('.retmenu_container').classList.toggle('inv');

        divElement = document.getElementById('dealerhand');
        divElement.innerHTML = ``;
        dealerdinamic.Hand.forEach(element => {
            divElement.innerHTML += `<img src="./cards/${element}.svg">`;
        });
    }
    resetGame() {
        document.getElementById('retmenu').classList.add('inv');
        document.getElementById("countcont").classList.toggle("ctninv", false);
        let divElement = document.getElementById('dealerhand');
        divElement.innerHTML = ``;
        divElement = document.getElementById('playerhand');
        divElement.innerHTML = ``;


        this.initgame()
    }
    gamestatus() {
        isgamego = false
        if (playerdinamic.Points == 21 || dealerdinamic.Points > 21) {
            console.log("1")
            return "Your"
        }
        if (dealerdinamic.Points == 21 || playerdinamic.Points > 21) {
            console.log("2")
            return "Dealer"
        }
        if (playerdinamic.Skip && dealerdinamic.Skip) {
            if (dealerdinamic.Points > playerdinamic.Points) {
            console.log("2")
                return "Dealer"
            }
            if (playerdinamic.Points > dealerdinamic.Points) {
                console.log("1")

                return "Your"
            }
            if (playerdinamic.Points == dealerdinamic.Points) {
                return "ni"
            }
        }
        isgamego = true
        return "go"
    }
}

function drawcard(cardname, client) {
    if (ismusic) { 
        const rand =  Math.floor(Math.random() * 4) + 1
        if (rand == 1) {soundcard1.play()}
        if (rand == 2) {soundcard2.play()}
        if (rand == 3) {soundcard3.play()}
        if (rand == 4) {soundcard4.play()}

    }
    const divElement = document.getElementById(client + 'hand');
    divElement.innerHTML += `<img src="./cards/${cardname}.svg">`;
}

function drawCount(player, dealer) {
    const divElement = document.getElementById("countcont");
    divElement.innerHTML = `<div><p>Dealer<br>${dealer}</p><br><p>Your<br>${player}</p>`
}

const game = new Game();
game.initgame();
const playerObj = new Player();
const buttonget = document.getElementById("getcard")
buttonget.addEventListener("click", function() {
    if (playerdinamic.Skip || !isgamego) { return }
    playerObj.getPlayer()
})

const buttonset = document.getElementById("setcard")
buttonset.addEventListener("click", function() {
    if (!isgamego) { return }
    playerObj.skipPlayer()
})

/* const v = document.getElementById("retry")
v.addEventListener("click", function() {
    console.log("123")
}) */

function retryBtnClick() {
    game.resetGame()
    console.log("dspoa[dP")
}
document.body.addEventListener("click", () => {
    soundcard1 = new Audio("./sound/card_1.wav");
    soundcard2 = new Audio("./sound/card_2.wav");
    soundcard3 = new Audio("./sound/card_3.wav");
    soundcard4 = new Audio("./sound/card_4.wav");
    winsound = new Audio("./sound/win.wav")
    losesound = new Audio("./sound/lose.wav")
    ismusic = true
}, { once: true })
