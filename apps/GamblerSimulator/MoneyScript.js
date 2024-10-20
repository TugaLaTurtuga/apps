let playerBalance = 0;
let jobUpgrades = {
    autoClicker: 0,
    assistant: 0,
    company: 0,
    enterprise: 0,
    factory: 0,
    realEstate: 0
};

// Update the displayed balance in both sections
function updateBalance() {
    document.getElementById('money-count').innerText = `Money: $${playerBalance.toFixed(2)}`;
    document.head.appendChild(document.createElement('link')).title = `Gambling simulator: $${playerBalance.toFixed(2)}`;
}

// Add money and save the updated balance
function addMoney(amount) {
    if (!isNaN(amount)) {
        playerBalance += amount;
        updateBalance();
        // saveGameData();  // Save every time the balance changes
    }
}

// Deduct money and save the updated balance
function deductMoney(amount, IsSalary = false) {
    if (!IsSalary) {
        if (playerBalance >= amount) {
            playerBalance -= amount;
            updateBalance();
            // saveGameData();  // Save every time the balance changes
            return true;
        } else {
            return false;
        }
    } else {
        playerBalance -= amount;
        updateBalance();
        // saveGameData();  // Save every time the balance changes
        if (playerBalance >= 0) {
            return true;
        } else {
            return false;
        }
    }
}

const TimeToPayLoans = 100;
let TimeUntilPayingLoans = 0;
let amountPaid = 0;
let payingLoan = false;
let loanInterval;

function takeLoan(amount, time, interest) {
    if (payingLoan) {
        console.log('Player bankrupt');
        playerBalance = NaN;
        return;
    }

    addMoney(amount); // Adds loan amount to player's balance
    // saveGameData();  // Save every time the balance changes
    payingLoan = true;

    const LoanDiv = document.getElementById("LoanDiv");
    const totalLoanValue = amount + (amount * (interest / 100)); // Total loan + interest
    const monthlyPayment = totalLoanValue / time; // Monthly payment to pay off over the specified period

    document.getElementById("loansPer").innerText = `Loans: -$${monthlyPayment} per ${TimeToPayLoans}s`
    loanInterval = setInterval(() => {
        TimeUntilPayingLoans++;
        
        if (TimeUntilPayingLoans >= TimeToPayLoans) {
            if (!deductMoney(monthlyPayment, true)) {
                console.log('Player bankrupt');
                playerBalance = NaN;
                clearInterval(loanInterval); // Stop further payments
                return;
            } else {
                console.log(`Paid loan: $${monthlyPayment.toFixed(2)}`);
                amountPaid += monthlyPayment;

                if (amountPaid >= totalLoanValue) {
                    payingLoan = false;
                    clearInterval(loanInterval); // Stop loan payments once the loan is fully paid
                    document.getElementById("loansPer").innerText = `Loans: NaN per ---s`
                    console.log('Loan fully repaid');
                }
            }
            // saveGameData();  // Save every time the balance changes

            LoanDiv.innerText = `Loans: -$${monthlyPayment.toFixed(2)}`;
            LoanDiv.classList.add('show');
            setTimeout(() => {
                LoanDiv.classList.remove('show');
            }, 1500);
            
            TimeUntilPayingLoans = 0; // Reset time counter after each payment
        }
    }, 1000); // Check every second, but payments happen every 5 seconds
}

/*
// Load saved data when the page is loaded
window.onload = () => {
    loadGameData();
}; 
*/