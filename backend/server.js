const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Load rules
const rules = JSON.parse(fs.readFileSync("./rules.json", "utf-8"));

// ================= API =================
app.post("/api", (req, res) => {
  const { age, sleep, digestion, body_temp, stress, diet } = req.body;

  let scores = {
    Vata: 0,
    Pitta: 0,
    Kapha: 0,
  };

  let explanations = [];
  let recommendations = [];

  // ================= APPLY RULES =================
  rules.forEach((rule) => {
    let match = true;

    for (let key in rule.conditions) {
      if (req.body[key] !== rule.conditions[key]) {
        match = false;
        break;
      }
    }

    if (match) {
      // Apply effects (IMPORTANT FIX)
      for (let dosha in rule.effect) {
        scores[dosha] += rule.effect[dosha];
      }

      // Collect explanation
      if (rule.explanation) {
        explanations.push(rule.explanation);
      }
    }
  });

  // ================= NORMALIZE =================
  const total = scores.Vata + scores.Pitta + scores.Kapha;

  let result = {
    vata: 0,
    pitta: 0,
    kapha: 0,
  };

  if (total === 0) {
    result = { vata: 33, pitta: 33, kapha: 34 };
  } else {
    result.vata = Math.round((scores.Vata / total) * 100);
    result.pitta = Math.round((scores.Pitta / total) * 100);
    result.kapha = Math.round((scores.Kapha / total) * 100);
  }

  // Fix rounding
  let sum = result.vata + result.pitta + result.kapha;
  if (sum !== 100) {
    result.kapha += 100 - sum;
  }

  // ================= DOMINANT =================
  let dominant = "Vata";
  if (result.pitta > result.vata && result.pitta > result.kapha) {
    dominant = "Pitta";
  } else if (result.kapha > result.vata && result.kapha > result.pitta) {
    dominant = "Kapha";
  }

  // ================= SMART RECOMMENDATIONS =================
  // (Auto-generate based on dominant dosha)
  let recommendation = [];

  if (dominant === "Vata") {
    recommendation = [
      "Maintain a regular routine",
      "Eat warm, nourishing foods",
      "Reduce stress and get proper sleep",
    ];
  } else if (dominant === "Pitta") {
    recommendation = [
      "Avoid spicy and oily foods",
      "Stay cool and hydrated",
      "Practice relaxation techniques",
    ];
  } else {
    recommendation = [
      "Stay active and exercise regularly",
      "Avoid heavy and oily foods",
      "Keep your routine dynamic",
    ];
  }

  // ================= RESPONSE =================
  res.json({
    vata: result.vata,
    pitta: result.pitta,
    kapha: result.kapha,
    dominant,
    explanation:
      explanations.join(" | ") ||
      "Your body shows a balanced or unclear dosha pattern.",
    recommendation,
  });
});

// ================= START =================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
