let playerBalance = 0;
let totalEarned = 0;
let totalLoansValue = 0;
let payingLoan = false;
let loanInterval;
let totalLoanValue = 0;
let remainingTime = 0;
let loanInterest = 0;

// Update the displayed balance in both sections
function updateBalance() {
    document.getElementById('money-count').innerText = `Money: $${playerBalance.toFixed(2)}`;
    document.head.appendChild(document.createElement('link')).title = `Gambling simulator: $${playerBalance.toFixed(2)}`;
}

// Add money and save the updated balance
function addMoney(amount) {
    if (!isNaN(amount)) {
        playerBalance += amount;
        totalEarned += amount;
        updateBalance();
        saveGameData();  // Save every time the balance changes
    }
}

// Deduct money and save the updated balance
function deductMoney(amount, IsSalary = false) {
    if (!IsSalary) {
        if (playerBalance >= amount) {
            playerBalance -= amount;
            updateBalance();
            saveGameData();  // Save every time the balance changes
            return true;
        } else {
            return false;
        }
    } else {
        playerBalance -= amount;
        updateBalance();
        saveGameData();  // Save every time the balance changes
        return playerBalance >= 0;
    }
}

const TimeToPayLoans = 100; // Time in seconds between payments
let TimeUntilPayingLoans = 0;

function takeLoan(amount, time, interest) {
    if (payingLoan) {
        console.log('Player bankrupt');
        playerBalance = NaN;
        return;
    }

    addMoney(amount); // Adds loan amount to player's balance
    saveGameData();  // Save every time the balance changes
    payingLoan = true;

    totalLoanValue = amount + (amount * (interest / 100)); // Total loan + interest
    const monthlyPayment = totalLoanValue / time; // Monthly payment to pay off over the specified period
    remainingTime = time; // Save the time remaining for the loan

    document.getElementById("loansPer").innerText = `Loans: -$${monthlyPayment.toFixed(2)} per ${TimeToPayLoans}s`;
    loanInterest = interest;
    
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
                remainingTime--;

                if (remainingTime <= 0) {
                    payingLoan = false;
                    clearInterval(loanInterval); // Stop loan payments once the loan is fully paid
                    document.getElementById("loansPer").innerText = `Loans: NaN per ---s`;
                    console.log('Loan fully repaid');
                }
            }

            TimeUntilPayingLoans = 0; // Reset time counter after each payment
        }
    }, 1000); // Check every second, but payments happen every TimeToPayLoans seconds
}

// Save game data to localStorage
function saveGameData() {
    const gameData = {
        Money: playerBalance,
        totalEarned : totalEarned,
        payingLoan: payingLoan,
        totalLoanValue: totalLoanValue,
        remainingTime: remainingTime,
        loanInterest: loanInterest,
        loanIntervalActive: !!loanInterval,
        Count: Count,
        Income: Income,
        performance: performance,
        jobCosts: jobCosts,
        jobSalary: jobSalary,
        amountOfTimesGambled: amountOfTimesGambled,
        totalMoneyGambled: totalMoneyGambled,
        totalMoneyWonOnGambling: totalMoneyWonOnGambling
    };
    localStorage.setItem('gameData', JSON.stringify(gameData));
    displayGameData(gameData); // Call displayGameData with gameData after saving
}

// Load saved game data from localStorage
function loadGameData(loadData = true) {
    let savedData = localStorage.getItem('gameData');
    
    if (!loadData && confirm("Are you sure you want to reset the game? This will delete all your progress.")) {
        savedData = null;
        localStorage.removeItem('gameData'); // Clear local storage as well
    }

    // If there's no savedData, initialize with default values
    if (!savedData) {
        console.log("No saved game data found, starting a new game.");
        initializeDefaultValues();
        playerBalance = 0;
        return;
    }

    // Parse and load the game data if savedData exists
    console.log("Loading saved game data...");
    const gameData = JSON.parse(savedData);
    updateGameData(gameData);

    // Call displayGameData after successfully loading game data
    displayGameData(gameData);
}

// Initialize game with default values
function initializeDefaultValues() {
    playerBalance = 0;
    totalEarned = 0;
    payingLoan = false;
    totalLoanValue = 0;
    remainingTime = 0;
    loanInterest = 0;

    Count = {
        autoclicker: 0,
        freelancer: 0,
        assistant: 0,
        developer: 0,
        consultant: 0,
        designer: 0,
        analyst: 0,
        manager: 0,
        company: 0,
        realestate: 0,
        enterprise: 0,
        factory: 0
    };

    jobCosts = {
        autoclicker: 50,
        freelancer: 200,
        assistant: 1000,
        developer: 5000,
        consultant: 100000,
        designer: 15000,
        analyst: 25000,
        manager: 50000,
        company: 100000,
        realestate: 500000,
        enterprise: 1000000,
        factory: 15237358
    };

    amountOfTimesGambled = 0;
    totalMoneyGambled = 0;
    totalMoneyWonOnGambling = 0;

    updateBalance();
    saveGameData(); // Save default values as a fresh start
}

// Update game state with loaded data
function updateGameData(gameData) {
    playerBalance = gameData.Money || 0;
    totalEarned = gameData.totalEarned || 0;
    payingLoan = gameData.payingLoan || false;
    totalLoanValue = gameData.totalLoanValue || 0;
    remainingTime = gameData.remainingTime || 0;
    loanInterest = gameData.loanInterest || 0;

    // Load all job-related data
    Count = gameData.Count || {};

    Income = gameData.Income || 0;
    performance = gameData.performance || 0;
    jobCosts = gameData.jobCosts || {
        autoclicker: 50,
        freelancer: 200,
        assistant: 1000,
        developer: 5000,
        consultant: 100000,
        designer: 15000,
        analyst: 25000,
        manager: 50000,
        company: 100000,
        realestate: 500000,
        enterprise: 1000000,
        factory: 15237358
    };

    jobSalary = gameData.jobSalary || 0;

    amountOfTimesGambled = gameData.amountOfTimesGambled || 0;
    totalMoneyGambled = gameData.totalMoneyGambled || 0;
    totalMoneyWonOnGambling = gameData.totalMoneyWonOnGambling || 0;

    updateBalance();

    // Restart loan payment system if a loan is active
    if (payingLoan) {
        takeLoan(totalLoanValue / (1 + (loanInterest / 100)), remainingTime, loanInterest); // Use saved loan values
    }
}

// Function to dynamically display game data
function displayGameData(gameData) {
    const statsDiv = document.getElementById('stats');
    
    // Ensure statsDiv exists before proceeding
    if (!statsDiv) {
        console.error("Stats div not found");
        return;
    }

    // Clear previous stats
    statsDiv.innerHTML = '';

    // Create the main stats header
    const header = document.createElement('h1');
    header.innerText = "Game Stats";
    statsDiv.appendChild(header);

    // Iterate through the properties of the gameData object
    for (const key in gameData) {
        if (gameData.hasOwnProperty(key)) {
            const value = gameData[key];

            // Create a paragraph element for each property
            const statItem = document.createElement('p');
            if (isDigit(value)) {
                statItem.innerHTML = `<strong>${capitalizeFirstLetter(key.replace(/([A-Z])/g, ' $1'))}:</strong> ${formatValue(value)}`;
                statsDiv.appendChild(statItem);
            }
        }
    }
    // Button to download game data
    const downloadGameDataBtn = document.createElement('button');
    downloadGameDataBtn.id = "btn"
    downloadGameDataBtn.innerText = 'Download Game Data';
    downloadGameDataBtn.onclick = () => downloadGameData(); // Set click event to trigger the download

    // Button to trigger file input for uploading game data
    const fileInputBtn = document.createElement('button');
    fileInputBtn.id = "btn"
    fileInputBtn.innerText = 'Upload Game Data';
    fileInputBtn.onclick = () => fileInput.click(); // Set click event to trigger file input

    // Button to delete game data
    const deleteGameDataBtn = document.createElement('button');
    deleteGameDataBtn.id = "btn"
    deleteGameDataBtn.innerText = 'Delete Game Data';
    deleteGameDataBtn.onclick = () => loadGameData(false); // Set click event to delete game data

    statsDiv.appendChild(downloadGameDataBtn);
    statsDiv.appendChild(fileInputBtn);
    statsDiv.appendChild(deleteGameDataBtn);
}

function isDigit(value) {
    return !isNaN(value) && !isNaN(parseFloat(value));
}

// Helper function to format values for display
function formatValue(value) {
    if (typeof value === 'number') {
        return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return value; // Return as is for non-number types
}

// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

document.addEventListener('DOMContentLoaded', () => {
    // Load saved game data after DOM is fully loaded
    loadGameData();

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.code === 'KeyQ') {
            loadGameData(false); // Delete data
        } else if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.code === 'KeyD') {
            downloadGameData(); // Call the download function
        } else if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.code === 'KeyU') {
            fileInput.click();
        }
    });

    // Handle file input for uploading game data
    const fileInput = document.getElementById('fileInput');
    
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            loadGameDataFromFile(file); // Load game data from the selected file
        }
    });
});
