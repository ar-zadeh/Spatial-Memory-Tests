const demographicsForm = document.getElementById("demographics-form");

// Dummy test results data, replace with actual test results


demographicsForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const gender = event.target.gender.value;
    const age = event.target.age.value;
    const education = event.target.education.value;

    const resultsWithDemographics = {
        
        gender,
        age,
        education,
    };

    // const csvContent = convertToCSV(resultsWithDemographics);

    saveCSV(resultsWithDemographics);
});
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
function saveCSV(result) {
    const storageKey = 'results';
    let savedResults = JSON.parse(localStorage.getItem(storageKey)) || [];

    // Add the new results to the saved results array
    savedResults.push(result);

    // Save updated results in localStorage
    localStorage.setItem(storageKey, JSON.stringify(savedResults));
}

function downloadCSV() {
    const storageKey = 'results';
    const savedResults = localStorage.getItem(storageKey) || "";

    // Send POST request to Python backend
    fetch('http://localhost:5000/save_results', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
        },
        body: savedResults
    })
    .then(response => response.json())
    .then(data => {
        console.log('Data saved:', data);
        // Optionally clear local storage
        localStorage.removeItem(storageKey);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    window.location.href = "Mazeintro.HTML";
}

function downloadTXT() {
    const storageKey = 'results';
    // const savedResults = JSON.parse(localStorage.getItem(storageKey)) || [];
    const savedResults = (localStorage.getItem(storageKey));

    // Convert saved results to text content
    // let txtContent = "data:text/plain;charset=utf-8,";
    // const header = Object.keys(savedResults[0]).join(",") + "\n";
    // txtContent += header;
    
    // savedResults.forEach((result, index) => {
    //     const row = Object.values(result).join(",");
    //     txtContent += row;
    //     if (index < savedResults.length - 1) {
    //         txtContent += "\n";
    //     }
    // });

    // Download txt file
    // const encodedUri = encodeURI(txtContent);
    const encodedUri = encodeURI("data:text/plain;charset=utf-8,"+ savedResults);

    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "all_test_results.txt");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Delete saved results from localStorage
//    localStorage.removeItem(storageKey);
    window.location.href = "Mazeintro.HTML";

}

