// 1. Deposit money
// 2. Determine number of lines to bet on
// 3. Collect a bet amount
// 4. Spin the slot machine
// 5. check if the user won
// 6. give the user money
// 7. Play again



const prompt = require("prompt-sync")();


const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    A: 2, B: 4, C: 6, D: 8 
}
const SYMBOLS_VALUES = {
    A: 5, B: 4, C: 3, D: 2 
}



const deposit = () => {
    while(true){
        const depositAmount = prompt("Enter a deposit amount: ");
        const numberDepositAmount = parseFloat(depositAmount);
        if(isNaN(numberDepositAmount) || numberDepositAmount <= 0){
            console.log("Invalid deposit try again.");
        }else{
            return numberDepositAmount;
        }
    }
};

const getNumberOfLines = () =>{
    while(true){
        const numberOfLines = prompt("Enter Number of lines(1-3): "); 
        const lines = parseFloat(numberOfLines);
        if(isNaN(lines) || lines <= 0 || lines > 3){
            console.log("Invalid number of lines try again!");
        }else{
            return lines
        }
    }
};

const getbet = (balance, lines) =>{
    while(true){
        const bet = prompt("enter the total bet per line: ");
        const betAmount = parseFloat(bet);
        if(isNaN(betAmount) || betAmount <= 0 || betAmount > balance/lines){
            console.log("Invalid bet try again!!!");
        }else{
            return betAmount;
        }
    }
};

const spin = () =>{
    const symbols = [];
    for (const[symbol, count] of Object.entries(SYMBOLS_COUNT)){
        for(let i = 0; i < count; i++){
            symbols.push(symbol);
        }
    }
    
    const reels = [];
    for(let i = 0; i < COLS; i++){
        reels.push([]);
        //shallow copy
        const reelSymbols = [...symbols];
        for(let j = 0; j< ROWS; j++){
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbols = reelSymbols[randomIndex];
            reels[i].push(selectedSymbols);
            reelSymbols.splice(randomIndex, 1);
        }
    }

    return reels;
};

const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++){
        rows.push([]);
        for(let j = 0; j < COLS; j++){
            rows[i].push(reels[j][i])
        }
    }

    return rows;
};

const printRows = (rows) => {
    for(const row of rows){
        let rowString = "";
        for(const [i, symbol] of row.entries()){
            rowString += symbol;
            if(i != row.length - 1){
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
};

const getWinings = (rows, bet, lines) =>{
    let winings = 0;

    for(let row = 0; row < lines; row++){
        const symbols = rows[row];
        let allSame = true;

        for(const symbol of symbols){
            if(symbol != symbols[0]){
                allSame = false;
                break;
            }
        }

        if(allSame){
            winings += bet * SYMBOLS_VALUES[symbols[0]];
        }
    }
    return winings;
}

const game = () => {

    let balance = deposit();
    while(true){
        console.log("You have a balance of $" + balance);
        const numberOfLines = getNumberOfLines();
        const betAmount = getbet(balance, numberOfLines);
        balance  -= (betAmount* numberOfLines);
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winings = getWinings(rows, betAmount, numberOfLines);
        balance += winings
        console.log("You Won: $" + winings.toString());

        if(balance <= 0){
            console.log("You ran out of money!");
            break;
        }
        const playAgain = prompt("Do you want to play again (y/n): ");
        if(playAgain != 'y'){
            break;
        }
    }

}


game();