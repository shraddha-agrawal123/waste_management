import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

# Load soil dataset
soil_data = pd.read_csv(r"C:\Users\shrad\mini_project\ai-waste-project\backend\datasets\soil_nutrient.csv")

# Features and target
X = soil_data.drop('best_nutrient', axis=1)
y = soil_data['best_nutrient']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Random Forest model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate the model
y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))

# Save the model
joblib.dump(model, 'backend/models/soil_model.pkl')