const testForm = document.getElementById("perspective-taking-test");
const nextTestButton = document.getElementById("next-test");

testForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Add your scoring logic here
    console.log("Test submitted");

    // Show next test button after evaluation
    nextTestButton.style.display = "block";
});

nextTestButton.addEventListener("click", function () {
    window.location.href = "mental_rotation_task.html";
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