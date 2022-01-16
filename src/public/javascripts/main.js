document.addEventListener('DOMContentLoaded', main)
function main() {
    const submitButton = document.querySelector('.playBtn');

    submitButton.addEventListener('click', function (event) {
        event.preventDefault();
        document.querySelector('.start').classList.toggle('hide');
        let startingCards = document.getElementById('startValues').value;
        const deck = generateDeck();
        shuffle(deck);
 
        input = inputParser(startingCards);
        inputHandler(input, deck);

        const user = [];
        const computer = [];
        computer.push(deck.pop());
        user.push(deck.pop());
        computer.push(deck.pop());
        user.push(deck.pop());

        // game begin
        //card display
        const game = document.getElementsByClassName('game');
        const computerElement = deckElementCreator('computerElement', computer);
        game[0].appendChild(computerElement);
        const userElement = deckElementCreator('userElement', user);
        game[0].appendChild(userElement);

        //score display
        const computerScore = scoreElementCreator('computer', computer);
        const userScore = scoreElementCreator('user', user);
        game[0].insertBefore(computerScore, computerElement);
        game[0].insertBefore(userScore, userElement);

        const hit = buttonElementCreator('Hit');
        const stay = buttonElementCreator('Stand');

        const combine = document.createElement('div');
        combine.className = 'hit-stay';
        combine.appendChild(hit);
        combine.appendChild(stay);
        game[0].appendChild(combine);
        
        
        //hit
        hit.addEventListener('click', function(event){
            event.preventDefault();
            const card = deck.pop();
            user.push(card);
            userElement.appendChild(cardElementCreater(card));
            updateTotal(userScore, user, 'user', game);
            if (calculateScore(user)>21){
                computerScore.childNodes[0].nodeValue = 'Computer Score: ' + calculateScore(computer);
                computerElement.childNodes[0].style.textIndent = "0px";

                const resetDiv = document.createElement('div');
                resetDiv.className = 'hit-stay';
                resetDiv.style.paddingLeft = '530px';
                resetDiv.id = 'resetDiv';
                const reset = buttonElementCreator('start over');
                reset.style.border = 'solid';
                reset.style.borderWidth = 'thin';
                reset.style.backgroundColor = 'yellow';
                resetDiv.appendChild(reset);
                game[0].appendChild(resetDiv);
                reset.addEventListener('click', function (event) {
                    window.location.reload(true);
                });
            }
        });

        stay.addEventListener('click', function(event){
            event.preventDefault();
            let compScoreTemp = calculateScore(computer);
            while(compScoreTemp <= 17){
                const card = deck.pop();
                computer.push(card);
                computerElement.appendChild(cardElementCreater(card));
                // updateTotal(computerScore, computer, 'computer', game);
                compScoreTemp = calculateScore(computer);
            }
            const computerFinalScore = calculateScore(computer);
            updateTotal(computerScore, computer, 'computer', game);
            const userFinalScore = calculateScore(user);

            if(computerFinalScore > userFinalScore && computerFinalScore <= 21){
                const ele = document.createElement('div');
                ele.classList.toggle('total');
                ele.appendChild(document.createTextNode('Computer Win!'));
                const game = document.getElementsByClassName('game');
                game[0].appendChild(ele);
            }else if(userFinalScore > computerFinalScore && userFinalScore <= 21){
                const ele = document.createElement('div');
                ele.classList.toggle('total');
                ele.appendChild(document.createTextNode('Player Win!'));
                const game = document.getElementsByClassName('game');
                game[0].appendChild(ele);
            }else if(computerFinalScore === userFinalScore){
                const ele = document.createElement('div');
                ele.classList.toggle('total');
                ele.appendChild(document.createTextNode('Tie!'));
                const game = document.getElementsByClassName('game');
                game[0].appendChild(ele);
            }
            document.getElementsByClassName('hit-stay')[0].classList.toggle('hide');
            computerElement.childNodes[0].style.textIndent = "0px";
            // document.getElementsByClassName('hit-stay')[1].classList.toggle('hide');

            const resetDiv = document.createElement('div');
            resetDiv.className = 'hit-stay';
            resetDiv.style.paddingLeft = '530px';
            resetDiv.id = 'resetDiv';
            const reset = buttonElementCreator('start over');
            reset.style.border = 'solid';
            reset.style.borderWidth = 'thin';
            reset.style.backgroundColor = 'yellow';
            resetDiv.appendChild(reset);
            game[0].appendChild(resetDiv);
            reset.addEventListener('click', function (event) {
                window.location.reload(true);
            });
        });
    });
}

function generateDeck() {
    const deck = [];
    for(let i = 1; i <= 13; i++){
      let n = '';
      if (i === 1) {
        n = 'A';
      } else if (i === 11) {
        n = 'J';
      } else if (i === 12) {
        n = 'Q';
      } else if (i === 13) {
        n = 'K';
      } else {
        n = i + '';
      }
      deck.push({'number': n, 'suit': '\u2666'}); //diamond
      deck.push({'number': n, 'suit': '\u2663'}); //club
      deck.push({'number': n, 'suit': '\u2660'}); //spade
      deck.push({'number': n, 'suit': '\u2665'}); //heart
    }
    return deck;
}

function shuffle(deck) {
    for(let i = deck.length-1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      const temp = deck[i];
      deck[i] = deck[j];
      deck[j] = temp;
    }
}

function inputParser(inputString) {
    if (inputString.length===0){
        return;
    }else{
        return inputString.split(',');
    }
}

function inputHandler(input, deck) {
    if (input === undefined){
        return;
    }
    for (let i = 0; i<input.length; i++){
        for (let j = 0; j<deck.length; j++){
            if (deck[j].number===input[i]){
                const temp = deck[j];
                deck[j] = deck[deck.length - 1 - i];
                deck[deck.length - 1 - i] = temp;
            }
        }
    }
}

function deckElementCreator(element, arr) {
    const ele = document.createElement('div');
    ele.className = element;
    for (let i = 0; i<arr.length; i++){
        const child = document.createElement('p');
        child.innerText = arr[i].suit + arr[i].number;
        if(i===0 && element==='computerElement'){
            child.className = 'hiddencard';
            child.innerText = arr[i].suit + arr[i].number;
        }
        ele.appendChild(child)
        if(element==='computerElement' && i===0){
            child.classList.toggle('cardDisplayHidden');
        } else {
            child.classList.toggle('cardDisplay');
        }
    }
    return ele;

}

function scoreElementCreator(element, arr) {
    if (element==='computer') {
        const ele = document.createElement('div');
        ele.classList.toggle('total');
        ele.appendChild(document.createTextNode('Computer Score: ?'));
        return ele;
    }else{
        const ele = document.createElement('div');
        ele.classList.toggle('total');
        const total = calculateScore(arr);
        ele.appendChild(document.createTextNode('Player Score: ' + total));
        return ele;
    }
}

function calculateScore(arr) {
    let score = 0;
    for(let i = 0; i<arr.length; i++){
        if(arr[i].number==='A'){
            score += 1;
        }else if(arr[i].number==='J'){
            score += 11;
        } else if (arr[i].number==='Q') {
            score += 12;
        }else if (arr[i].number==='K') {
            score += 13;
        }else {
            score += parseInt(arr[i].number);
        }
    }
    return score;
}

function buttonElementCreator(name) {
    const ele = document.createElement('BUTTON');
    const text = document.createTextNode(name);
    ele.className = name;
    ele.appendChild(text);
    ele.classList.toggle('button');
    return ele;
}

function cardElementCreater (card) {
    const ele = document.createElement('p');
    ele.innerText = card.suit + card.number;
    ele.classList.toggle('cardDisplay');
    return ele;
}

function updateTotal(element, arr, player, game) {
    if(player === 'user'){
        const total = calculateScore(arr);
        element.childNodes[0].nodeValue = 'Player Score: ' + total;
        if(total > 21){
            const ele = document.createElement('div');
            ele.classList.toggle('total');
            ele.appendChild(document.createTextNode('Player Lost (Bust!)'));
            game[0].appendChild(ele);
            document.getElementsByClassName('hit-stay')[0].classList.toggle('hide');
            // document.getElementsByClassName('hit-stay')[1].classList.toggle('hide');
        }
    }else{
        const total = calculateScore(arr);
        element.childNodes[0].nodeValue = 'Computer Score: ' + total;
        if(total > 21){
            const ele = document.createElement('div');
            ele.classList.toggle('total');
            ele.appendChild(document.createTextNode('Computer Lost (Bust!)'));
            game[0].appendChild(ele);
        }
    }
}

