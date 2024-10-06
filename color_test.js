const colors = [
    { name: "Blue", code: "#0299f4" },
    { name: "Red", code: "#ff0000" },
    { name: "Brown", code: "#744700" },
    { name: "Grey", code: "#808080" },
    { name: "Orange", code: "#ffa500" },
    { name: "Navy", code: "#000080" },
    { name: "Purple", code: "#800080" },
    { name: "Green", code: "#008000" },
    { name: "Yellow", code: "#ffff00" },
  ];
  
  const colorsContainer = document.getElementById("colors-container");
  const colorNamesContainer = document.getElementById("color-names-container");
  const colorBoxes = shuffleArray(colors).map(color => createColorBox(color));
  const colorNameElements = shuffleArray(colors).map(color => createColorNameElement(color));
  const nextTestButton = document.getElementById("next-test");
  let numCorrectMatches = 0;
  
  // Append all color boxes and color names to their respective containers
  appendElementsToContainer(colorsContainer, colorBoxes);
  appendElementsToContainer(colorNamesContainer, colorNameElements);
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
  // Attach event listeners to all color boxes
  colorBoxes.forEach(colorBox => {
    colorBox.addEventListener("dragstart", onDragStart);
  });
  
  // Attach event listeners to all color name elements
  colorNameElements.forEach(colorName => {
    colorName.addEventListener("dragover", onDragOver);
    colorName.addEventListener("drop", onDrop);
  });
  
  function createColorBox(color) {
    const colorElement = document.createElement("div");
    colorElement.classList.add("color-box");
    colorElement.style.backgroundColor = color.code;
    colorElement.dataset.colorName = color.name;
    colorElement.draggable = true;
    return colorElement;
  }
  
  function createColorNameElement(color) {
    const colorNameElement = document.createElement("div");
    colorNameElement.classList.add("color-name");
    colorNameElement.textContent = color.name;
    colorNameElement.dataset.colorName = color.name;
    return colorNameElement;
  }
  
  function appendElementsToContainer(container, elements) {
    elements.forEach(element => {
      container.appendChild(element);
    });
  }
  
  function onDragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.dataset.colorName);
  }
  
  function onDragOver(event) {
    event.preventDefault();
  }
  
  function onDrop(event) {
    const colorName = event.dataTransfer.getData("text/plain");
    if (event.target.dataset.colorName === colorName) {
      event.target.classList.add("correct");
      numCorrectMatches++;
  
      if (numCorrectMatches === colors.length) {
        nextTestButton.style.display = "block";
      }
    }
  }
  
  function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
  
  nextTestButton.addEventListener("click", function () {
    // Redirect to the next test or a results page
    window.location.href = "demographics.html";
  });
  