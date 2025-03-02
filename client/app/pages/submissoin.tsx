/**
 * Analyzes an image for trash detection using the Python backend
 * @param {File} imageFile - The image file selected by the user
 * @param {string} description - User-provided description of the image
 * @param {string} userId - Optional user identifier
 * @returns {Promise} Promise that resolves to the analysis result
 */
async function analyzeImageForTrash(imageFile, description, userId = 'anonymous') {
  try {
    // Convert image file to base64
    const base64Image = await fileToBase64(imageFile);
    
    // Prepare the request data
    const requestData = {
      image_data: base64Image.split(',')[1], // Remove the data:image/jpeg;base64, prefix
      description: description,
      user_id: userId
    };
    
    // Send request to Python API
    const response = await fetch('/api/analyze-trash', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log("Analysis result:", result);
    
    // Display results to user
    displayAnalysisResults(result);
    
    return result;
  } catch (error) {
    console.error("Error analyzing image:", error);
    displayError("Failed to analyze image. Please try again.");
    return null;
  }
}

/**
 * Converts a File object to base64 string
 * @param {File} file - The file to convert
 * @returns {Promise<string>} Promise that resolves to the base64 string
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/**
 * Displays analysis results on the page
 * @param {Object} result - The analysis result from the API
 */
function displayAnalysisResults(result) {
  const resultsContainer = document.getElementById('analysis-results');
  if (!resultsContainer) return;
  
  resultsContainer.innerHTML = '';
  
  if (result.error) {
    resultsContainer.innerHTML = `<div class="error">Error: ${result.error}</div>`;
    return;
  }
  
  // Create results display
  const severityClass = result.is_trash ? 
    `severity-${result.severity}` : 'no-trash';
  
  resultsContainer.innerHTML = `
    <div class="result ${severityClass}">
      <h3>${result.is_trash ? 'Trash Detected!' : 'No Trash Detected'}</h3>
      ${result.is_trash ? `<p>Severity Level: ${result.severity}/3</p>` : ''}
      <p>${result.explanation}</p>
    </div>
  `;
}

/**
 * Displays an error message
 * @param {string} message - The error message to display
 */
function displayError(message) {
  const resultsContainer = document.getElementById('analysis-results');
  if (!resultsContainer) return;
  
  resultsContainer.innerHTML = `<div class="error">${message}</div>`;
}

// Example HTML form element handler
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('trash-analysis-form');
  if (!form) return;
  
  form.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const imageInput = document.getElementById('image-input');
    const descriptionInput = document.getElementById('description-input');
    
    if (!imageInput.files || imageInput.files.length === 0) {
      displayError("Please select an image to analyze");
      return;
    }
    
    const imageFile = imageInput.files[0];
    const description = descriptionInput.value || '';
    
    // Show loading indicator
    document.getElementById('analysis-results').innerHTML = '<div class="loading">Analyzing image...</div>';
    
    // Perform the analysis
    await analyzeImageForTrash(imageFile, description);
  });
});