# Lung Cancer Detection using ML

This repository contains a lung cancer detection project with a Flask backend and a React frontend.

## Project structure

- `backend/` - Flask application serving model predictions and handling uploads
- `frontend/` - React/Vite frontend for the web UI
- `dataset/` - dataset folders used for training and evaluation (not included in GitHub)
- `train_model.py` - training script for the lung cancer classification model
- `.gitignore` - ignores dataset, model artifacts, uploads, and local environment files

## Features

- Flask backend loads a Keras model from `backend/model/lung_cancer_model.h5`
- Predicts lung cancer patterns from uploaded CT scan images
- Provides predicted class, confidence, risk level, and user suggestion
- React frontend uses Axios to interact with the backend API
- Training script builds and saves a MobileNetV2-based classifier

## Setup

### Backend

1. Create and activate a Python virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Install backend dependencies:

```powershell
pip install flask flask-cors python-dotenv pymongo pillow tensorflow matplotlib
```

3. Create a `.env` file in `backend/` with your MongoDB settings:

```text
MONGO_URI=<your_mongodb_uri>
DB_NAME=<your_database_name>
COLLECTION_NAME=<your_collection_name>
```

4. Run the backend:

```powershell
cd backend
python app.py
```

### Frontend

1. Install dependencies:

```powershell
cd frontend
npm install
```

2. Start the development server:

```powershell
npm run dev
```

## Training the model

The `train_model.py` script builds the model using the dataset in `dataset/` and saves the trained model to `backend/model/lung_cancer_model.h5`.

> Note: The dataset is intentionally ignored in the repository because it contains large image files.

## Important notes

- `dataset/` is excluded from the repo for size reasons
- `backend/model/*.h5` files are ignored, so the model weights are not stored in GitHub
- `backend/uploads/` and local environment files are also ignored

## Repository URL

https://github.com/yashwant123-45/Lung-cancer-detection-using-ML
