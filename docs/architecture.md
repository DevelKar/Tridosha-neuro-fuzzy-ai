System Architecture: Hybrid Neuro-Fuzzy Tridosha Prediction System

The proposed system combines fuzzy logic and basic neural learning concepts to predict an individual’s Tridosha composition (Vata, Pitta, Kapha) based on lifestyle and physiological inputs.

1. Input Layer

The system takes user inputs related to health and lifestyle, including:

Age
Sleep quality
Digestion
Body temperature
Stress level
Diet

These inputs represent key Ayurvedic factors influencing dosha balance.

2. Preprocessing

In this stage:

Inputs are cleaned and validated
Categorical values (e.g., sleep: poor/good) are standardized
Data is converted into a structured format suitable for processing

This ensures consistency before applying rules and learning models.

3. Fuzzy Logic Engine
A set of predefined rules (from rules.json) is applied
Each rule matches input conditions and assigns scores to:
Vata
Pitta
Kapha
Scores are combined and normalized to generate percentage values

This layer provides interpretability and mimics Ayurvedic reasoning.

4. Neural Concept (Learning Layer)
A simple machine learning model is trained on synthetic dataset
It learns patterns between inputs and dosha outputs
Helps in:
Improving prediction accuracy
Handling unseen combinations
Reducing dependency on rigid rules

This layer adds adaptability and learning capability to the system.

5. Output Layer

The system produces:

Vata, Pitta, Kapha percentages
Dominant dosha
Explanation (based on triggered rules)
Health recommendations

Results are displayed to the user in a clear and visual format.
