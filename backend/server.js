const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Load rules
const rules = JSON.parse(fs.readFileSync("./rules.json", "utf-8"));

// ================= API =================
app.post("/api", (req, res) => {
  const { age, sleep, digestion, body_temp, stress, diet } = req.body;

  let scores = {
    vata: 0,
    pitta: 0,
    kapha: 0,
  };

  let explanations = [];
  let recommendations = [];

  // Apply rules
  rules.forEach((rule) => {
    let match = true;

    for (let key in rule.conditions) {
      if (rule.conditions[key] !== req.body[key]) {
        match = false;
        break;
      }
    }

    if (match) {
      // Add scores
      scores.vata += rule.scores.vata || 0;
      scores.pitta += rule.scores.pitta || 0;
      scores.kapha += rule.scores.kapha || 0;

      // Collect explanation + recommendation
      if (rule.explanation) explanations.push(rule.explanation);
      if (rule.recommendation) recommendations.push(rule.recommendation);
    }
  });

  // ================= NORMALIZE =================
  const total = scores.vata + scores.pitta + scores.kapha;

  let result = {
    vata: 0,
    pitta: 0,
    kapha: 0,
  };

  if (total === 0) {
    // fallback
    result = { vata: 33, pitta: 33, kapha: 34 };
  } else {
    result.vata = Math.round((scores.vata / total) * 100);
    result.pitta = Math.round((scores.pitta / total) * 100);
    result.kapha = Math.round((scores.kapha / total) * 100);
  }

  // Fix rounding to 100
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

  // ================= RESPONSE =================
  res.json({
    vata: result.vata,
    pitta: result.pitta,
    kapha: result.kapha,
    dominant,
    explanation: explanations.join(" | ") || "General balanced constitution.",
    recommendation:
      recommendations.length > 0
        ? recommendations
        : ["Maintain a balanced lifestyle."],
  });
});

// ================= START =================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
