# test_model.py
import pandas as pd
import joblib

# ---- Load the trained model ----
model = joblib.load("model.joblib")
print("Model loaded successfully\n")

# ---- Create new incoming transaction data ----
new_data = pd.DataFrame([
    {"amount": 1200, "hour": 22, "country": "IN", "device": "mobile"},     # suspicious (high amount)
    {"amount": 80, "hour": 10, "country": "IN", "device": "mobile"},       # normal
    {"amount": 650, "hour": 21, "country": "NG", "device": "desktop"},     # high risk (night + NG)
    {"amount": 50, "hour": 15, "country": "US", "device": "tablet"},       # normal
    {"amount": 900, "hour": 23, "country": "GB", "device": "desktop"}      # risky
])

# ---- One-hot encode features (same as training) ----
encoded_data = pd.get_dummies(new_data, drop_first=True)

# Get the model’s training feature names and align columns
model_features = model.feature_name_
for col in model_features:
    if col not in encoded_data.columns:
        encoded_data[col] = 0
encoded_data = encoded_data[model_features]

# ---- Predict fraud probabilities ----
probs = model.predict_proba(encoded_data)[:, 1]
predictions = ["Fraud" if p > 0.5 else "Legit" for p in probs]

# ---- Display Results ----
results = new_data.copy()
results["Fraud Probability"] = probs.round(3)
results["Prediction"] = predictions

print("Fraud Detection Results:\n")
print(results)
