# train_model.py
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from lightgbm import LGBMClassifier
from sklearn.metrics import roc_auc_score, classification_report
import joblib

# ---- Step 1: Create synthetic fraud data ----
np.random.seed(42)
n = 2000

data = {
    "amount": np.random.exponential(scale=100, size=n),
    "hour": np.random.randint(0, 24, n),
    "country": np.random.choice(["IN", "US", "GB", "NG", "RU"], n),
    "device": np.random.choice(["mobile", "desktop", "tablet"], n),
}

df = pd.DataFrame(data)

# Basic fraud pattern simulation
df["label"] = (
    (df["amount"] > 500) |
    ((df["country"] == "NG") & (df["hour"] > 20)) |
    ((df["device"] == "desktop") & (df["amount"] > 400))
).astype(int)

# ---- Step 2: Feature encoding ----
X = pd.get_dummies(df[["amount", "hour", "country", "device"]], drop_first=True)
y = df["label"]

# ---- Step 3: Split data ----
X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

# ---- Step 4: Train model ----
model = LGBMClassifier(
    n_estimators=300,
    learning_rate=0.05,
    max_depth=6,
    random_state=42
)
model.fit(X_train, y_train)

# ---- Step 5: Evaluate ----
preds = model.predict_proba(X_val)[:, 1]
auc = roc_auc_score(y_val, preds)
print(f"AUC Score: {auc:.3f}")
print(classification_report(y_val, (preds > 0.5).astype(int)))

# ---- Step 6: Save model ----
joblib.dump(model, "model.joblib")
print("Model saved successfully as model.joblib")
