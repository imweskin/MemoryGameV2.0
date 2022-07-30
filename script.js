let startBtn = document.querySelector(".start-btn");
let submitBtn = document.querySelector(".popup button");
let popupBox = document.querySelector(".popup-box");
let closePopupBtn = document.querySelector(".popup i");
let gameHeader = document.querySelector(".game-header");
let gameWrapper = document.querySelector(".wrapper");
let correctSound = document.querySelector("audio.correct");
let wrongSound = document.querySelector("audio.wrong");
let failSpan = document.querySelector(".fails span");
let resultsDiv = document.querySelector(".results");
let timeSpan = document.querySelector(".time span");
let refreshBtn = document.querySelector(".refresh button");
let replayBtn = document.querySelector(".results .replay");
let exitBtn = document.querySelector(".results .exit");
let nameInput = document.querySelector(".popup input");
let nameSpan = document.querySelector(".game-header span");
const cards = document.querySelectorAll(".card");

let playerName;

startBtn.addEventListener("click", function() {
    popupBox.classList.add("show");
    nameInput.focus();
});

submitBtn.addEventListener("click", function(e) {
    //prevent form from submitting
    e.preventDefault();
    //get name
    playerName = nameInput.value;
    if(playerName) { //not empty
        startBtn.classList.add("hide");
        popupBox.classList.remove("show");
        gameHeader.classList.add("show");
        gameWrapper.classList.add("show");
        //insert name
        nameSpan.textContent = playerName;
        shuffleCards();
    }
    else {
        alert("You must type a username");
    }
});

closePopupBtn.addEventListener("click", function() {
    nameInput.value = "";
    popupBox.classList.remove("show");
});

refreshBtn.addEventListener("click", function() {
    shuffleCards();
});

replayBtn.addEventListener("click", function() {
    gameHeader.classList.add("show");
    gameWrapper.classList.add("show");
    resultsDiv.classList.remove("show");
    shuffleCards();
});

exitBtn.addEventListener("click", function() {
    startBtn.classList.remove("hide");
    resultsDiv.classList.remove("show");
    gameHeader.classList.remove("show");
    clearInterval(countSetInterval);
});

//chosen cards
let cardOne, cardTwo;

let disableDeck = false;

let matchedCards = 0;

let fails = 0;

let countSetInterval;

let time = 60; //seconds

function flipCard(e) {
    let clickedCard = e.target;
    if(clickedCard !== cardOne && !disableDeck) { //to prevent the user from clicking the same card again And prevent him to click until first cards unflip
        clickedCard.classList.add("flip");
        if(!cardOne) {
            //if cardOne is empty return the clickedcard value to cardOne
            return cardOne = clickedCard;
        }
        cardTwo = clickedCard;

        disableDeck = true;

        let cardOneImg = cardOne.querySelector("img").src,
        cardTwoImg = cardTwo.querySelector("img").src;
        
        checkCards(cardOneImg,cardTwoImg);
    }
};

function checkCards(imgSrc1, imgSrc2) {
    if(imgSrc1 === imgSrc2) { //The two cards match
        correctSound.play();
        //increasing matched cards count
        matchedCards++;
        if(matchedCards === cards.length / 2 ) { //all cards are matched
            setTimeout(() => {
                showResults();
            },1000);
        } else {
            //prevent user from clicking them again
            cardOne.removeEventListener("click", flipCard);
            cardTwo.removeEventListener("click", flipCard);
            //resetting chosen cards values
            cardOne = cardTwo = "";
            disableDeck = false;
        }
    } else {
        wrongSound.play();
        //increasing fails
        fails++;
        //updating fails
        failSpan.textContent = fails;
        //adding shake class after 400 ms
        setTimeout(() => {
            cardOne.classList.add("shake");
            cardTwo.classList.add("shake");
        },400)
        //remove shake & flip class after 1200 ms
        setTimeout(() => {
            cardOne.classList.remove("shake","flip");
            cardTwo.classList.remove("shake","flip");
            //resetting chosen cards values
            cardOne = cardTwo = "";

            disableDeck = false;
        }, 1200);
    }
};

function showResults() {
    let result;

    if(matchedCards === cards.length / 2 ) { //all cards are matched
        result = `<i class="uil uil-trophy"></i>
                  <p>Congratulations, you won !</p>
                  <p>Your fails count is : <span class="failCount">6</span></p>
                  <p>Come again and do better !</p>`;
    } else {
        result = `<i class="uil uil-frown"></i>
        <p>Sorry, you lost ...</p>
        <p>Your fails count is : <span class="failCount">6</span></p>
        <p>You will do better next time</p>`;
    }

    document.querySelector(".results .content").innerHTML = result;

    gameHeader.classList.remove("show");
    gameWrapper.classList.remove("show");
    resultsDiv.classList.add("show");
    let finalFails = document.querySelector(".results .failCount");
    finalFails.textContent = fails;
};

function shuffleCards() {
    //resetting settings
    matchedCards = 0;
    disableDeck = false;
    cardOne = cardTwo = "";
    fails = 0;
    time = 60;
    clearInterval(countSetInterval);
    //resetting fails span
    failSpan.textContent = fails;
    //resetting timer span
    timeSpan.textContent = time;
    //since there are 8 cards
    let arr = [1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6,7,8,9,10];
    arr.sort(() => Math.random() > 0.5 ? 1 : -1); //sorting array items randomly

    cards.forEach((card, index) => {
        card.classList.remove("flip");
        let imgTag = card.querySelector("img");
        imgTag.src = `images/img-${arr[index]}.png`;
    });

    //first view
    cards.forEach((card) => {
        card.classList.add("flip");
        setTimeout(() => {
            card.classList.remove("flip");
            card.addEventListener("click", flipCard);
        },3000);
    });

    setTimeout(() => {
        countSetInterval = setInterval(() => {
            timeSpan.innerHTML = time;
            time--;
            if(time < 0) {
                clearInterval(countSetInterval);
                showResults();
            }
        },1000);
    },3000);
};