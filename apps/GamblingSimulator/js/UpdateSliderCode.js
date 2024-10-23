// Get slider elements
let autoClickerSlider = null;
let assistantSlider = null;
let companySlider = null;
let enterpriseSlider = null;
let factorySlider = null;
let realEstateSlider = null;

// Function to update the slider gradient
function updateSliderBackground(slider) {
    const percentage = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.setProperty('--slider-value', `${percentage}%`); // Set slider value dynamically
}

// Function to handle scroll events on the slider
function handleSliderScroll(event, slider) {
    event.preventDefault(); // Prevent the page from scrolling
    const scrollSpeed = 0.25;
    const step = (slider.max - slider.min) / 100 * event.deltaY * scrollSpeed;

    // Update the slider's value based on scroll direction
    slider.value = Math.max(slider.min, Math.min(slider.max, parseFloat(slider.value) - step));

    // Trigger the input event programmatically
    const inputEvent = new Event('input', { bubbles: true });
    slider.dispatchEvent(inputEvent); // Dispatch input event to trigger any associated listeners
}

// Function to add listeners to sliders
function addSliderListeners(slider) {
    // Add 'input' event listener to update the slider background
    slider.addEventListener('input', () => updateSliderBackground(slider));

    // Add 'wheel' event listener for scroll functionality
    slider.addEventListener('wheel', (event) => handleSliderScroll(event, slider));
}

// Initialize sliders
function initializeSliders() {
    const sliders = [
        autoClickerSlider, assistantSlider, companySlider, 
        enterpriseSlider, factorySlider, realEstateSlider,
        freelancerSlider, DeveloperSlider, ConsultantSlider, 
        DesignerSlider, AnalystSlider, ManagerSlider
    ];
    const roles = [
        "AutoClicker", "Assistant", "Company", "Enterprise", "Factory", "RealEstate",
        "Developer", "Consultant", "Designer", "Analyst", "Manager"
    ];

    sliders.forEach((slider, index) => {
        if (slider) { // Ensure slider exists before trying to update
            updateSliderBackground(slider); // Update background on initialization
            addSliderListeners(slider, roles[index]); // Pass the role to the listeners
        }
    });
}



function SeeBank() {
    const settingsElement = document.querySelector('.settings');
    if (settingsElement.classList.contains('show')) {
        settingsElement.classList.remove('show');
        
        // Delay changing visibility until after the opacity transition
        setTimeout(() => {
            settingsElement.classList.add('hide');
        }, 300); // 300ms matches the CSS transition duration for opacity
    } else {
        settingsElement.classList.remove('hide');
        settingsElement.classList.add('show');
    }

    const buttons = document.querySelectorAll('.Globalbutton');
    if (!Array.from(buttons).some(button => button.classList.contains('highlight'))) {
        buttons[0].classList.add('highlight');
    }
}

function ChangeBankView(View=null) {
    const buttons = document.querySelectorAll('.Globalbutton');
    let HightlightedBtn = null

    if (View) { // loan
        buttons.forEach(button => button.classList.remove('highlight')); 
        buttons[0].classList.add('highlight');
        HightlightedBtn = true;
    } else if (!View) { // deposit
        buttons.forEach(button => button.classList.remove('highlight')); 
        buttons[1].classList.add('highlight');
        HightlightedBtn = false;
    } else {
        if (buttons[0].classList.contains('highlight')) {
            buttons.forEach(button => button.classList.remove('highlight')); 
            buttons[1].classList.add('highlight');
            HightlightedBtn = false;
        } else {
            buttons.forEach(button => button.classList.remove('highlight')); 
            buttons[0].classList.add('highlight');
            HightlightedBtn = true;
        }
    }

    if (HightlightedBtn) {
        document.getElementById('BankLoansDiv').style.display = 'block';
        document.getElementById('BankDepositsDiv').style.display = 'none';
    } else {
        document.getElementById('BankLoansDiv').style.display = 'none';
        document.getElementById('BankDepositsDiv').style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const roles = [
        { name: "autoclicker", label: "Auto clicker" },
        { name: "freelancer", label: "Freelancer" },
        { name: "assistant", label: "Assistant" },
        { name: "developer", label: "Developer" },
        { name: "consultant", label: "Consultant" },
        { name: "designer", label: "Designer" },
        { name: "analyst", label: "Analyst" },
        { name: "manager", label: "Manager" },
        { name: "company", label: "Company" },
        { name: "enterprise", label: "Enterprise" },
        { name: "realestate", label: "Real estate" },
        { name: "factory", label: "Factory" }
    ];

    const workerGrid = document.getElementById('workers-grid');

    roles.forEach((role) => {
        const workerCard = document.createElement('div');
        workerCard.className = 'worker-card';

        const roleTitle = document.createElement('h2');
        roleTitle.innerText = `${role.label}:`;

        const roleCount = document.createElement('h3');
        roleCount.id = `Amount of workers in ${role.name}`;
        roleCount.innerText = `Workers: ${Count[role.name]}`;

        const currentSalary = jobSalary[role.name].toFixed(2);
        const currentPerformance = Math.round(performance[role.name] * 100);

        const currentSalaryText = document.createElement('h3');
        currentSalaryText.innerText = `Current salary: $${(currentSalary * Count[role.name]).toFixed(2)}`;

        const currentPerformanceText = document.createElement('h3');
        currentPerformanceText.innerText = `Current performance: ${currentPerformance}%`;

        const salarySlider = document.createElement('input');
        salarySlider.type = "range";
        salarySlider.id = `${role.label}Slider`;
        salarySlider.min = "0.3";
        salarySlider.max = "1.5";
        salarySlider.step = "0.01";
        salarySlider.value = performance[role.name];
        salarySlider.className = "slider";

        const newSalaryDisplay = document.createElement('h3');
        newSalaryDisplay.innerText = `New salary: $${currentSalary * Count[role.name]}`;

        const newPerformanceDisplay = document.createElement('h3');
        newPerformanceDisplay.innerText = `New performance: ${currentPerformance}%`;

        salarySlider.oninput = function () {
            const sliderValue = parseFloat(salarySlider.value);
            const perfectSalary = salaries[role.name].perfectSalary;
            const worstSalary = salaries[role.name].worstSalary;

            const newSalary = worstSalary + (perfectSalary - worstSalary) * sliderValue;
            const newPerformance = Math.max(0.2, sliderValue);

            newSalaryDisplay.innerText = `New salary: $${(newSalary * Count[role.name]).toFixed(2)}`;
            newPerformanceDisplay.innerText = `New performance: ${(newPerformance * 100).toFixed(0)}%`;
        };

        const sliderValue = parseFloat(salarySlider.value);
        const perfectSalary = salaries[role.name].perfectSalary;
        const worstSalary = salaries[role.name].worstSalary;
        jobSalary[role.name] = worstSalary + (perfectSalary - worstSalary) * sliderValue;
        performance[role.name] = Math.max(0.2, sliderValue);
        currentSalaryText.innerText = `Current salary: $${(jobSalary[role.name] * Count[role.name]).toFixed(2)}`;
        currentPerformanceText.innerText = `Current performance: ${(performance[role.name] * 100).toFixed(0)}%`;
        updateIncome();

        const saveButton = document.createElement('button');
        saveButton.innerText = "Save changes";

        saveButton.onclick = () => {
            const sliderValue = parseFloat(salarySlider.value);
            const perfectSalary = salaries[role.name].perfectSalary;
            const worstSalary = salaries[role.name].worstSalary;

            jobSalary[role.name] = worstSalary + (perfectSalary - worstSalary) * sliderValue;
            performance[role.name] = sliderValue;

            currentSalaryText.innerText = `Current salary: $${(jobSalary[role.name] * Count[role.name]).toFixed(2)}`;
            currentPerformanceText.innerText = `Current performance: ${(performance[role.name] * 100).toFixed(0)}%`;

            calculateTotalSalary();
            updateIncome();
            saveGameData();
        };

        const mpsText = document.createElement('h3');
        mpsText.id = `mps in ${role.name}`;
        mpsText.innerText = `mps: $500.00`;

        workerCard.appendChild(mpsText);
        mpsText.className = "hhhh3"
        workerCard.appendChild(roleTitle);
        workerCard.appendChild(roleCount);
        roleCount.className = "hhh3"
        workerCard.appendChild(currentSalaryText);
        workerCard.appendChild(currentPerformanceText);
        workerCard.appendChild(salarySlider);
        workerCard.appendChild(newSalaryDisplay);
        newPerformanceDisplay.className = "hh3"
        workerCard.appendChild(newPerformanceDisplay);
        workerCard.appendChild(saveButton);
        workerGrid.appendChild(workerCard);
    });

    autoClickerSlider = document.getElementById('Auto clickerSlider');
    assistantSlider = document.getElementById('AssistantSlider');
    companySlider = document.getElementById('CompanySlider');
    enterpriseSlider = document.getElementById('EnterpriseSlider');
    factorySlider = document.getElementById('FactorySlider');
    realEstateSlider = document.getElementById('Real estateSlider');
    autoClickerSlider = document.getElementById('Auto clickerSlider');
    freelancerSlider = document.getElementById('FreelancerSlider');
    DeveloperSlider = document.getElementById('DeveloperSlider');
    ConsultantSlider = document.getElementById('ConsultantSlider');
    DesignerSlider = document.getElementById('DesignerSlider');
    AnalystSlider = document.getElementById('AnalystSlider');
    ManagerSlider = document.getElementById('ManagerSlider');
    initializeSliders();

    document.addEventListener('keydown', function(event) {
        if ((event.ctrlKey || event.metaKey) && event.code === 'KeyB' || event.code === 'KeyL') {
            SeeBank();
        }
    });
});
