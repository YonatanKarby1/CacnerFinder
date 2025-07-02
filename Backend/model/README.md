# Model Directory

Place your trained classification model (`.pth` file) in this directory.

## File Naming
The API expects the model file to be named `model.pth`

## Model Architecture
The API is configured for a DenseNet201-based binary classifier with the following architecture:

- **Base Model**: DenseNet201 (pretrained on ImageNet, frozen)
- **Global Average Pooling**: AdaptiveAvgPool2d
- **Batch Normalization**: BatchNorm1d(1920)
- **Dense Layer 1**: Linear(1920, 128) + ReLU
- **Dropout**: 0.5
- **Dense Layer 2**: Linear(128, 16) + ReLU
- **Output Layer**: Linear(16, 1) + Sigmoid

## Converting from TensorFlow to PyTorch

Your original TensorFlow model used:
```python
base_model = DenseNet201(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
model = Sequential([
    base_model,
    GlobalAveragePooling2D(),
    BatchNormalization(),
    Dense(128, activation='relu'),
    Dropout(0.5),
    Dense(16, activation='relu'),
    Dense(1, activation='sigmoid')
])
```

### Steps to Convert:

1. **Run the conversion script**:
   ```bash
   cd Backend
   python convert_model.py
   ```

2. **If conversion fails**, the script will create a new PyTorch model architecture that you can train from scratch.

3. **Train the PyTorch model** with your data and save it as `model.pth`.

### Manual Conversion (if needed):

If the automatic conversion doesn't work, you can:

1. **Create the PyTorch model** using the `create_model()` function in `app.py`
2. **Train it from scratch** with your dataset
3. **Save the trained weights** to `model/model.pth`

## Model Requirements
- The model should be saved in PyTorch format (`.pth` file)
- It should be a binary classification model with sigmoid output
- The input shape should be compatible with the preprocessing (default: 3x224x224)
- Use ImageNet normalization: mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]

## Training the PyTorch Model

Example training script:
```python
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
# Import your data loading functions

# Create model
model = create_model()  # Use the function from app.py

# Define loss and optimizer
criterion = nn.BCELoss()
optimizer = optim.Adam(model.parameters(), lr=1e-4, weight_decay=1e-2)

# Training loop
for epoch in range(num_epochs):
    for batch in train_loader:
        optimizer.zero_grad()
        outputs = model(batch['images'])
        loss = criterion(outputs, batch['labels'])
        loss.backward()
        optimizer.step()

# Save the model
torch.save(model.state_dict(), 'model/model.pth')
```

## Customization
If your model has different requirements, you can modify:
1. The `target_size` parameter in the API calls
2. The `class_labels` list in `app.py` (currently ['benign', 'malignant'])
3. The `create_model()` function to match your actual model architecture 