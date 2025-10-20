# Fraud Model — FraudGraph AI

This folder contains the **core fraud detection model** for our project *FraudGraph AI*.

## 📘 Overview
The model uses **LightGBM** to predict whether a transaction or account is fraudulent based on user and transaction features.

## 🧩 Files Included
- `data/sample_users.csv` → sample user dataset
- `data/sample_transactions.csv` → sample transaction dataset
- `train_model.py` → trains and saves the fraud detection model
- `test_model.py` → tests predictions on new transactions
- `requirements.txt` → dependencies list

## ⚙️ How to Run
1. Install dependencies  
   ```bash
   pip install -r requirements.txt
