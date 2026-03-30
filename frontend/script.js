// ================= ELEMENTS =================
const form = document.getElementById("doshaForm");
const formSection = document.getElementById("formSection");
const resultsSection = document.getElementById("results");

// Progress + text
const vataProgress = document.getElementById("vataProgress");
const pittaProgress = document.getElementById("pittaProgress");
const kaphaProgress = document.getElementById("kaphaProgress");

const vataText = document.getElementById("vataPercentage");
const pittaText = document.getElementById("pittaPercentage");
const kaphaText = document.getElementById("kaphaPercentage");

const constitutionType = document.getElementById("constitutionType");
const recommendationsList = document.getElementById("recommendationsList");
const explanationText = document.getElementById("explanationText");

// ================= SUBMIT HANDLER =================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Collect form data
  const data = {
    age: document.getElementById("age").value,
    sleep: document.getElementById("sleep").value,
    digestion: document.getElementById("digestion").value,
    body_temp: document.getElementById("body_temp").value,
    stress: document.getElementById("stress").value,
    diet: document.getElementById("diet").value,
  };

  // Show loading state
  formSection.innerHTML = `<p class="loading">Analyzing your constitution...</p>`;

  try {
    const response = await fetch("https://YOUR_BACKEND_URL/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Server Error: ${response.status}`);
    }

    const result = await response.json();

    // ================= SHOW RESULTS =================
    formSection.style.display = "none";
    resultsSection.classList.remove("hidden");

    // Animate progress bars
    setTimeout(() => {
      vataProgress.style.width = result.vata + "%";
      pittaProgress.style.width = result.pitta + "%";
      kaphaProgress.style.width = result.kapha + "%";
    }, 100);

    // Set percentages
    vataText.innerText = result.vata + "%";
    pittaText.innerText = result.pitta + "%";
    kaphaText.innerText = result.kapha + "%";

    // Dominant dosha
    constitutionType.innerText = result.dominant;

    // Explanation
    explanationText.innerText = result.explanation;

    // Recommendations (supports array or string)
    recommendationsList.innerHTML = "";

    if (Array.isArray(result.recommendation)) {
      result.recommendation.forEach((item) => {
        const div = document.createElement("div");
        div.className = "recommendation-item";
        div.innerText = item;
        recommendationsList.appendChild(div);
      });
    } else {
      const div = document.createElement("div");
      div.className = "recommendation-item";
      div.innerText = result.recommendation;
      recommendationsList.appendChild(div);
    }

  } catch (error) {
    console.error("Error:", error);

    formSection.innerHTML = `
      <p style="color:red; text-align:center;">
        Failed to fetch results. Please try again.
      </p>
      <button onclick="location.reload()" class="btn btn-primary">
        Retry
      </button>
    `;
  }
});

// ================= RESET FUNCTION =================
function resetForm() {
  form.reset();

  // Reset progress bars
  vataProgress.style.width = "0%";
  pittaProgress.style.width = "0%";
  kaphaProgress.style.width = "0%";

  // Reset text
  vataText.innerText = "0%";
  pittaText.innerText = "0%";
  kaphaText.innerText = "0%";

  constitutionType.innerText = "";
  explanationText.innerText = "";
  recommendationsList.innerHTML = "";

  // Show form again
  formSection.style.display = "block";
  resultsSection.classList.add("hidden");
}
