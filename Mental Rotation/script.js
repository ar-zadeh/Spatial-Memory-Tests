let currentTrial;
let trialIndex = 0;
let trialType = 'practice';
let results = [];
let feedback = document.getElementById("feedback");
let buttons = document.getElementById("buttons");
let showButtons = true;
let displayTrial = false;

document.addEventListener('click', function() {
    html2canvas(document.body).then(canvas => {
        const imgDataUrl = canvas.toDataURL("image/png");

        // Sending AJAX request to Flask backend
        fetch('http://localhost:5000/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `image=${encodeURIComponent(imgDataUrl)}`
        })
        .then(response => response.json())
        .then(data => {
            console.log('Image saved:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
  });
function proceedToGame() {
    window.location.href = "index.html";
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function showTrial(trial) {
    const image = document.getElementById("image");
    image.src = trial.picture;
    currentTrial = trial;
}

function timeUp() {
    alert("Time's up! Game Over!");
    downloadResults();
}
const gameDuration = 300000; // 300 seconds in milliseconds
setTimeout(timeUp, gameDuration);
let remainingTime = 300; // 300 seconds

const countdownElement = document.getElementById("countdown");
const countdownInterval = setInterval(() => {
    remainingTime--;
    countdownElement.textContent = `Time remaining: ${remainingTime} seconds`;

    if (remainingTime <= 0) {
        clearInterval(countdownInterval);
    }
}, 1000);


function downloadResults() {
    // Add timestamp to each result
    const timestampedResults = results.map(result => ({
        ...result,
        timestamp: new Date().toISOString()
    }));

    const jsonContent = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(timestampedResults, null, 2));

    // Retrieve existing results from local storage
    let existingResults = localStorage.getItem("results");
    if (existingResults) {
        // If there are existing results, parse them
        existingResults = JSON.parse(existingResults);
    } else {
        // If there are no existing results, initialize an empty array
        existingResults = [];
    }

    // Add the new results to the existing results array
    existingResults.push(timestampedResults);

    // Update local storage with the combined results
    localStorage.setItem("results", JSON.stringify(existingResults));

    // Create a temporary link element to trigger the download
    const link = document.createElement("a");
    link.href = jsonContent;
    link.download = "results_rotation.json";
    link.click();

    setTimeout(() => {
        window.location.href = "../color_test.html";
    }, 1000); // wait for saving to local storage to complete before navigating
}



function nextTrial() {
    if (trialType === 'practice' && trialIndex >= 5) {
        trialIndex = 0;
        trialType = 'main';
        showButtons = false;
        buttons.style.display = 'none'; // hide buttons
        document.getElementById("proceed-button").style.display = "block";
        feedback.textContent = "Click the button to proceed to the actual game";
    } else if (trialType === 'main' && trialIndex >= 20) {
        alert("Game Over! Downloading results...");
        downloadResults();
        return;
    }

    if (trialType === 'main' && trialIndex === 0 && !displayTrial) {
        return;
    }

    const trial = trialType === 'practice' ? practice_trials.key_press[trialIndex] : main_trials.key_press[trialIndex];
    trialIndex++;
    showTrial(trial);

    if (!showButtons) {
        buttons.style.display = 'none';
    } else {
        buttons.style.display = 'flex';
    }
}



function checkAnswer(answer) {
    const correct = answer === currentTrial.expected;
    const result = {
        trial: trialIndex,
        answer: answer,
        correct: correct,
        angle: currentTrial.angle
    };

    if (trialType === 'main') {
        results.push(result);
    }

    if (trialType === 'practice') {
        feedback.textContent = correct ? "Correct!" : "Incorrect!";
    }

    setTimeout(() => {
        feedback.textContent = "";
        if (trialType === 'main') {
            buttons.style.display = 'flex'; // show buttons
        }
        nextTrial();
    }, 1000);
}


function proceedToMainPhase() {
    document.getElementById("proceed-button").style.display = "none";
    showButtons = true;
    buttons.style.display = 'flex'; // show buttons
    feedback.textContent = "";
    trialType = 'main';
    shuffleArray(main_trials.key_press); // Add this line to shuffle the main_trials
    document.getElementById("title").textContent = "The main test";
    displayTrial = true;
    nextTrial();
}



// display the title for the practice phase or main phase
if (trialType === 'practice') {
    document.getElementById("title").textContent = "Practice";
}

nextTrial();
