// script.js

// Get form and result container
const form = document.getElementById("doshaForm");
const resultDiv = document.getElementById("result");

// Handle form submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Collect input values
  const data = {
    age: document.getElementById("age").value,
    sleep: document.getElementById("sleep").value,
    digestion: document.getElementById("digestion").value,
    body_temp: document.getElementById("body_temp").value,
    stress: document.getElementById("stress").value,
    diet: document.getElementById("diet").value,
  };

  // Clear previous result
  resultDiv.innerHTML = "Loading...";

  try {
    // Send POST request
    const response = await fetch("https://YOUR_BACKEND_URL/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Check for HTTP errors
    if (!response.ok) {
      throw new Error(`Server Error: ${response.status}`);
    }

    const result = await response.json();

    // Display result
    resultDiv.innerHTML = `
      <h3>Results</h3>
      <p><strong>Vata:</strong> ${result.vata}%</p>
      <p><strong>Pitta:</strong> ${result.pitta}%</p>
      <p><strong>Kapha:</strong> ${result.kapha}%</p>
      <p><strong>Dominant Dosha:</strong> ${result.dominant}</p>
      <p><strong>Explanation:</strong> ${result.explanation}</p>
      <p><strong>Recommendation:</strong> ${result.recommendation}</p>
    `;
  } catch (error) {
    // Handle errors
    console.error("Error:", error);

    resultDiv.innerHTML = `
      <p style="color:red;">
        Failed to fetch results. Please try again later.
      </p>
    `;
  }
});
