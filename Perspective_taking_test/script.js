const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const TASK_ITEMS = [    ["flower", "tree", "cat", 301],
    ["car", "traffic light", "stop sign", 123],
    ["cat", "tree", "car", 237],
    ["stop sign", "cat", "house", 83],
    ["cat", "flower", "car", 156],
    ["stop sign", "tree", "traffic light", 319],
    ["stop sign", "flower", "car", 235],
    ["traffic light", "house", "flower", 333],
    ["house", "flower", "stop sign", 260],
    ["car", "stop sign", "tree", 280],
    ["traffic light", "cat", "car", 48],
    ["tree", "flower", "house", 26],
    ["cat", "house", "traffic light", 150]
];

let currentItem = 0;
let startTime = Date.now();
let results = [];

function drawCircle() {
    // ctx.clearRect(0, 0, 800, 600);
    ctx.beginPath();
    ctx.arc(300, 300, 250, 0, 2 * Math.PI);
    ctx.strokeStyle = "black";
    ctx.stroke();
}


function drawText(item) {
    ctx.font = '24px Arial';
    ctx.fillText(TASK_ITEMS[item][0], 300, 300);
    ctx.fillText(TASK_ITEMS[item][1], 300, 50);
}
function drawVLine() {

    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(300, 300);
    ctx.lineTo(300 + 250 * Math.cos(-Math.PI/2), 300 + 250 * Math.sin(-Math.PI/2));
    ctx.stroke();
}

function drawLine(angle) {
    ctx.clearRect(0, 0, 800, 600);
    drawCircle()
    drawVLine()
    drawText(currentItem)
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(300, 300);
    ctx.lineTo(300 + 250 * Math.cos(angle), 300 + 250 * Math.sin(angle));
    ctx.stroke();
}
function generatePromptText(item) {
    const item1 = TASK_ITEMS[item][0];
    const item2 = TASK_ITEMS[item][1];
    const item3 = TASK_ITEMS[item][2];
    return `Imagine you are standing at the <span style="font-size:2em;font-weight: bold;">${item1}</span> facing at the <span style="font-size:2em;font-weight: bold;">${item2}</span> point to the <span style="font-size:2em; font-weight: bold;">${item3}</span>`;
}

const promptElement = document.getElementById('prompt');
promptElement.innerHTML = generatePromptText(currentItem);
const temp = document.getElementById('temp')

function calculateAngle(x, y) {
    return Math.atan2(y - 300, x - 300) * 180 / Math.PI;
}

canvas.addEventListener('click', (e) => {

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let angle = calculateAngle(x, y);
    
    // normalize the angle to 0-360
    if (angle < 0) {
        angle += 360;
    }

    drawLine(angle * Math.PI / 180); // convert back to radians for drawing
    angle = (angle + 90) % 360;
    userClickAngle = angle;

});

function endGame() {

    // clearInterval(timerInterval); // Stop the timer

    // ctx.clearRect(0, 0, 800, 600);
    canvas.style.display = "none"; // Hide the canvas
    // ctx.clearRect()
    objectArray.style.display = "none"; // Hide the display array
    submitButton.style.display = "none";
    const totalError = results.reduce((acc, result) => acc + result.error, 0); // Calculate the total error
    const averageError = totalError / results.length; // Calculate the average error
    console.log("Results:", results); // Log the results array in the console
    saveResultsToFile();

    // saveResultsToFile();
    const gameoverText = document.createElement('h2');
    gameoverText.innerText = 'Game Over';
    const resultText = document.createElement('p');
    // resultText.innerText = `Average Error: ${averageError.toFixed(2)}`; // Show the average error
    resultText.innerText = "Great Job!"
    const nextButton = document.createElement('button');
    nextButton.innerText = 'Navigate me to the next page';
    temp.innerText = `The game is over!`
    promptElement.style.display = "none"
    // canvas.removeEventListener('click');
    nextButton.addEventListener('click', () => {
        window.location.href = '../Mental Rotation/introduction.html'; // Replace this with the URL of the next page
    });
    const promptDiv = document.createElement('div');
    promptDiv.appendChild(gameoverText);
    promptDiv.appendChild(resultText);
    promptDiv.appendChild(nextButton);
    document.body.appendChild(promptDiv);
    saveResultsToLocalStorage();

}
// document.addEventListener('keydown', (e) => {
//     if (e.code === 'Space') {
        // const angle = calculateAngle(canvas.width / 2, canvas.height / 2);
        // results.push({
        //     item: currentItem,
        //     correctAngle: TASK_ITEMS[currentItem][3],
        //     userAngle: angle * (180 / Math.PI),
        //     error: Math.abs(TASK_ITEMS[currentItem][3] - angle * (180 / Math.PI))
        // });

//         currentItem++;
//         const remainingTime = 300 - Math.floor((Date.now() - startTime) / 1000);
//         if (currentItem >= TASK_ITEMS.length || remainingTime <= 0) {
//             endGame();
//         } else {
//             drawVerticalRadius(angle); // Draw the vertical radius
//             drawLine(angle);
//             drawText(currentItem);
//         }
//     }
// });
const submitButton = document.getElementById('submit-button');
submitButton.addEventListener('click', () => {
    const angle = userClickAngle;
    temp.innerText = `Keep Going`
    console.log("Error value:", Math.abs(TASK_ITEMS[currentItem][3] - userClickAngle));
    console.log("Angle value:", Math.abs(userClickAngle));
    console.log("Correct value:", Math.abs(TASK_ITEMS[currentItem][3]));
    results.push({
        item: currentItem,
        correctAngle: TASK_ITEMS[currentItem][3],
        userAngle: userClickAngle, // this is now in 0-360 range
        error: Math.abs(TASK_ITEMS[currentItem][3] - userClickAngle),
        timestamp: new Date().toISOString() // Add timestamp
    });

currentItem++;
if (currentItem >= TASK_ITEMS.length || (Date.now() - startTime) / 1000 >= 300) {
    endGame();
} else {
    // ctx.clearRect(0, 0, 800, 600);
    // drawCircle();
    // drawText(currentItem);
    // drawVLine(0)
    promptElement.innerHTML = generatePromptText(currentItem); // Update prompt text
    ctx.clearRect(0, 0, 800, 600); // Clear the canvas before drawing the line
    drawLine(angle);

    // drawVLine(angle); // Draw the vertical radius
    // drawText(currentItem);
    // temp.innerText = `${angle}`
}
});

// function saveResultsToFile() {
//     const resultsString = JSON.stringify(results, null, 2); // Convert results array to a formatted JSON string
//     const blob = new Blob([resultsString], { type: 'text/plain' }); // Create a new Blob object
//     const url = URL.createObjectURL(blob); // Create a URL for the Blob
//     const a = document.createElement('a'); // Create a new <a> element
//     a.href = url; // Set the href attribute of the <a> element to the URL
//     a.download = 'results.txt'; // Set the download attribute of the <a> element
//     document.body.appendChild(a); // Append the <a> element to the DOM
//     a.click(); // Click the <a> element to trigger the download
//     document.body.removeChild(a); // Remove the <a> element from the DOM
// }
function saveResultsToLocalStorage() {
    const previousResults = JSON.parse(localStorage.getItem("results")) || [];
    localStorage.setItem("results", JSON.stringify([...previousResults, results]));
}

function saveResultsToFile() {
    const resultsString = JSON.stringify(results, null, 2); // Convert results array to a formatted JSON string
    const filename = "results_prospective.json"; // Set the filename with .json extension
    const a = document.createElement('a'); // Create a new <a> element
    a.href = "data:application/json;charset=utf-8," + encodeURIComponent(resultsString); // Set the href attribute of the <a> element to a data URI containing the results
    a.download = filename; // Set the download attribute of the <a> element to the filename
    document.body.appendChild(a); // Append the <a> element to the DOM
    a.click(); // Click the <a> element to trigger the download
    document.body.removeChild(a); // Remove the <a> element from the DOM
}

    
    // Initial draw
    drawCircle();
    drawVLine(0)
    drawText(currentItem);
    setInterval(() => {
        const remainingTime = 300 - Math.floor((Date.now() - startTime) / 1000);
        const timerElement = document.getElementById('timer');
        timerElement.innerHTML = `Remaining Time:<span style="font-size: larger; font-weight: bold;"> ${remainingTime}s</span>`;
    }, 1000);
