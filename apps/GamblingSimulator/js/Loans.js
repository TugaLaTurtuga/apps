const TimeToPayLoans = 10; // Time in seconds between payments
let TimeUntilPayingLoans = 0;
const loansDiv = document.getElementById("loanDiv");
function takeLoan(amount, interest, time, IsSavingSystem=false) {
    if (payingLoan || isNaN(playerBalance)) {
        console.log('Player bankrupt');
        playerBalance = NaN;
        updateBalance();
        saveGameData();
        return;
    } payingLoan = true;

    const totalLoanValue = amount + (amount * (interest / 100));
    const monthlyPayment = totalLoanValue / time; // Monthly payment to pay off over the specified period
    remainingLoanTime = time; // Save the time remaining for the loan

    document.getElementById("loansPer").innerText = `Loans: -$${monthlyPayment.toFixed(2)} per ${TimeToPayLoans}s`;
    loanInterest = interest;
    remainingLoanValue = totalLoanValue;
    saveGameData();

    if (!IsSavingSystem) {
        addMoney(amount); // Adds loan amount to player's balance

        const resultElement = document.getElementsByClassName('game-result')[0];
        result = `Taking loan of: $${amount.toFixed(2)} for ${time} months`
        resultElement.innerText = result;
        const oldColor = resultElement.style.color
        resultElement.style.color = 'red';

        try {
            resultElement.classList.remove('show');
        } catch (error) {
            console.error("Error removing 'show' class bc it doesn't exist"); // Log error if any
        }
        // Add the 'show' class to display the result
        resultElement.classList.add('show');
        setTimeout(() => {
            resultElement.classList.remove('show');
            
        }, 3000);
        setTimeout(() => {resultElement.style.color = oldColor}, 3400) // change the color back to normal
    }
  
    loanInterval = setInterval(() => {
        TimeUntilPayingLoans++;
        
        if (TimeUntilPayingLoans >= TimeToPayLoans) {
            if (!deductMoney(monthlyPayment, true)) {
                console.log('Player bankrupt');
                playerBalance = NaN;
                clearInterval(loanInterval); // Stop further payments
                saveGameData();  // Save the final game state
                return;
            } else {
                console.log(`Paid loan: $${monthlyPayment.toFixed(2)}`);
                remainingLoanValue -= monthlyPayment;
                remainingLoanTime--;
                saveGameData();

                loansDiv.innerText = `Loans: -$${monthlyPayment.toFixed(2)}`;
                loansDiv.classList.add('show');
                setTimeout(() => {
                    loansDiv.classList.remove('show');
                }, 1500);

                if (remainingLoanTime <= 0) {
                    payingLoan = false;
                    remainingLoanValue = 0;
                    clearInterval(loanInterval); // Stop loan payments once the loan is fully paid
                    document.getElementById("loansPer").innerText = `Loans: -$___ per __s`;
                    loanInterest = 0;
                    console.log('Loan fully repaid');
                }
            }

            TimeUntilPayingLoans = 0; // Reset time counter after each payment
        }
    }, 1000); // Check every second, but payments happen every TimeToPayLoans seconds
}


IsTakingLTD = false;
function TakeLongTermDeposits(amount, interest, IsSimpleInterest, time, IsSavingSystem = false) {
    if (!IsSavingSystem) {
        if (IsTakingLTD) {
            console.log('Already has a ltd');
            return;
        }
        if (!deductMoney(amount)) {
            console.log('Not enough money to make a deposit.');
            return;
        }
    }

    const originalAmount = amount;
    const interestRate = interest / 100;
    let remainingTime = time;  // Time is in months or periods
    let intervalCounter = 0;

    if (!IsSavingSystem) {
        const resultElement = document.getElementsByClassName('game-result')[0];
        const result = `Deposited: $${originalAmount.toFixed(2)} at ${interest}% interest`;
        resultElement.innerText = result;
        const oldColor = resultElement.style.color;
        resultElement.style.color = 'green';

        try {
            resultElement.classList.remove('show');
        } catch (error) {
            console.error("Error removing 'show' class because it doesn't exist");
        }
        resultElement.classList.add('show');
        setTimeout(() => {
            resultElement.classList.remove('show');
        }, 3000);
        setTimeout(() => {
            resultElement.style.color = oldColor;
        }, 3400);
    }

    const depositInterval = setInterval(() => {
        intervalCounter++;

        if (intervalCounter >= TimeToPayLoans) {
            remainingTime--;

            if (remainingTime <= 0) {
                clearInterval(depositInterval);

                let totalAmount = 0;
                if (IsSimpleInterest) {
                    // Simple Interest formula: Principal + (Principal * Rate * Time)
                    totalAmount = originalAmount + (originalAmount * interestRate * (time / 12));  // time is in months
                } else {
                    // Compound Interest formula: Principal * (1 + Rate) ^ Time
                    totalAmount = originalAmount * Math.pow((1 + interestRate), (time / 12));  // time is in months
                }

                addMoney(totalAmount);  // Add total amount (principal + interest) to player's balance
                console.log(`Deposit matured: $${totalAmount.toFixed(2)} added to balance.`);

                const depositsDiv = document.getElementById('depositsDiv');
                depositsDiv.innerText = `Deposits: $${totalAmount.toFixed(2)}`;
                depositsDiv.classList.add('show');
                setTimeout(() => {
                    depositsDiv.classList.remove('show');
                }, 1500);
            } else {
                console.log(`Remaining time: ${remainingTime}`);
            }

            intervalCounter = 0;  // Reset the counter after each interval
        }

        saveGameData();  // Save game progress regularly
    }, 1000);  // Check every second, but execute every `TimeToPayLoans` interval
}
