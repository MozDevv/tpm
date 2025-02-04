import torch
import torch.nn as nn
from torchvision import datasets, transforms

# Define the same model structure as before
class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        self.fc1 = nn.Linear(784, 64)
        self.fc2 = nn.Linear(64, 10)

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        return torch.log_softmax(self.fc2(x), dim=1)

# Load the model
model = Net()
model.load_state_dict(torch.load('mnist_model.pth'))  # Load the saved model
model.eval()  # Set the model to evaluation mode

# Define the transform to apply to the input data (must match training transform)
transform = transforms.Compose([transforms.ToTensor(), transforms.Normalize((0.5,), (0.5,))])

# Load the test data
testset = datasets.MNIST('data', download=True, train=False, transform=transform)
testloader = torch.utils.data.DataLoader(testset, batch_size=1, shuffle=True)

# Get a sample image and label
dataiter = iter(testloader)
images, labels = next(dataiter)

# Preprocess the image
images = images.view(images.shape[0], -1)  # Flatten the image (1x28x28 -> 1x784)

# Make a prediction
with torch.no_grad():  # Disable gradient calculation (not needed for inference)
    output = model(images)

# Get the predicted class
_, predicted = torch.max(output, 1)

# Print the result
print(f'Predicted Label: {predicted.item()}')
print(f'Actual Label: {labels.item()}')

# Optionally, you can also visualize the image:
import matplotlib.pyplot as plt
plt.imshow(images.view(28, 28).numpy(), cmap='gray')
plt.show()
