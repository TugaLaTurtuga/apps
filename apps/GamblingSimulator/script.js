let incomePerSecond = 0;
let clickPower = 1;
let IsPayingsalaries = false;

// Updates money and job shop section
window.onload = () => {
    
    updateBalance();
    createJobShop();
    createGamesSection();
    startPassiveIncome();
};

// Clicking to earn money
function earnMoney() {
    addMoney(clickPower);
}

// Job shop creation
function createJobShop() {
    const shopSection = document.getElementById('job-shop-section');

    // Create job buttons dynamically
    for (let job in jobCosts) {
        const jobButton = document.createElement('button');
        jobButton.innerText = `Buy ${capitalizeFirstLetter(job)} (Cost: $${jobCosts[job]})`;
        jobButton.onclick = () => buyJob(job);
        shopSection.appendChild(jobButton);
    }
}

// Buying a job upgrade
function buyJob(job) {
    if (deductMoney(jobCosts[job])) {
        Count[job]++;
        updateIncome();
        jobCosts[job] = Math.max(Math.floor(jobCosts[job] * 1.2), 1);  // Increment cost dynamically, but never allow it to be 0 or negative
        seeWorkersBtn();
        updateJobShop();
    } else {
        // Feedback for insufficient funds
        const buttons = document.querySelectorAll('#job-shop-section button');
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].innerText.includes(capitalizeFirstLetter(job))) {
                buttons[i].innerText = "Not enough money"; // Change button text
                setTimeout(() => {
                    buttons[i].innerText = `Buy ${capitalizeFirstLetter(job)} (Cost: $${jobCosts[job]})`;
                }, 1000); 
                break;
            }
        }
    }
    IsPayingsalaries = true;
    calculateTotalSalary(); // update the salary per s
}

// Function to update the income per second based on performance
function updateIncome() {
    incomePerSecond = 0;
    for (let job in Count) {
        incomePerSecond += Count[job] * jobIncome[job] * performance[job];
    }
}

// Calculate performance based on salary
function calculatePerformance() {
    for (let job in jobSalary) {
        if (jobSalary[job] < salaries[job].perfectSalary) {
            performance[job] = jobSalary[job] / salaries[job].perfectSalary;  // Decrease performance if underpaid
        } else {
            performance[job] = 1 + (jobSalary[job] - salaries[job].perfectSalary) / salaries[job].perfectSalary;  // Bonus performance if overpaid
        }

        // Update workers count in the workers grid
        const roleCount = document.getElementById(`Amount of workers in ${job}`);
        if (roleCount) {
            roleCount.innerText = `Workers: ${Count[job]}`;
        }
    }
    updateIncome();  // Recalculate income based on new performance values
}

let IsSeingWorkers = false;
function seeWorkersBtn() {
    const sw = document.getElementById("seeWorkers");
    sw.style.display = "block";
    const gameContainer = document.getElementById("job-clicker-section");
    gameContainer.style.height = "auto";
    document.getElementById("seeWorkers").onclick = () => { 
        if (IsSeingWorkers) {
            document.getElementById("clicker-section").style.display = "block";
            document.getElementById("Workers-section").style.display = "none";
            sw.innerText = 'See Workers';
            gameContainer.style.height = "auto";
            IsSeingWorkers = false;
        } else {
            document.getElementById("clicker-section").style.display = "none";
            document.getElementById("Workers-section").style.display = "block";
            sw.innerText = 'See Jobs';
            gameContainer.style.height = "auto";
            IsSeingWorkers = true;
        }
    };
}

// Updates the job shop with new costs
function updateJobShop() {
    const buttons = document.querySelectorAll('#job-shop-section button');
    let i = 0;
    for (let job in jobCosts) {
        buttons[i].innerText = `Buy ${capitalizeFirstLetter(job)} (Cost: $${jobCosts[job]})`;
        ++i;
    }
}

// Salary to be paid per job type based on the income they generate
function calculateTotalSalary() {
    let totalSalary = 0;
    for (let job in Count) {
        totalSalary += Count[job] * jobSalary[job];
    }

    document.getElementById("salariesPer").innerText = `Salaries: $${totalSalary} per ${TimeToPaySalaries}s`;

    return totalSalary; // Total salary to be paid each cycle
}

const TimeToPaySalaries = 100;
let TimeUntilPayingSalaries = 0;
const salaryDiv = document.getElementById("salaryDiv");
function startPassiveIncome() {
    setInterval(() => {
        addMoney(incomePerSecond); // Increment player's balance by income
        document.getElementById('total-mps').innerText = `mps: $${incomePerSecond.toFixed(2)}`;

        if (TimeUntilPayingSalaries >= TimeToPaySalaries) {
            const totalSalary = calculateTotalSalary(); // Calculate the total salary to pay

            if (!deductMoney(totalSalary)) {
                console.log('Not enough money for salaries, taking loan');
                takeLoan(playerBalance * -1.2, 12, 4);
            } else {
                console.log(`Paid salaries: $${totalSalary}`);
            }
            TimeUntilPayingSalaries = 0; // Reset the counter after paying salaries

            salaryDiv.innerText = `Salaries: -$${totalSalary.toFixed(2)}`;
            salaryDiv.classList.add('show');
            setTimeout(() => {
                salaryDiv.classList.remove('show');
            }, 1500);
        }

        if (IsPayingsalaries) {
            TimeUntilPayingSalaries++;
        }
        calculatePerformance(); // Update performance based on the current salary
        clickPower = 1 + incomePerSecond * 0.01;
    }, 1000); // Every second
}

// Utility function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Add a function to handle salary updates based on slider values
function updateSalaryAndPerformance(role, sliderValue) {
    const perfectSalary = salaries[role].perfectSalary;
    const worstSalary = perfectSalary * 0.5;  // Assuming worst salary is half of perfect

    // Calculate the new salary based on the slider's position
    const salary = worstSalary + (perfectSalary - worstSalary) * sliderValue; // Interpolate between worst and perfect salary
    const performance = 1 - (0.8 * (1 - sliderValue)); // Maps slider value 1 to max performance

    // Update the displayed values in the UI
    document.querySelector(`#${role}Slider + p`).innerText = `New salary: $${Math.round(salary)}`;
    document.querySelector(`#${role}Slider + p:nth-of-type(2)`).innerText = `New performance: ${Math.round(performance * 100)}%`;

    jobSalary[role] = salary;
    performance[role] = performance;
    calculatePerformance(); // Recalculate performance
}