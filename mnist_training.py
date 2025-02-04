import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms

# Define the model class
class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        self.fc1 = nn.Linear(784, 64)
        self.fc2 = nn.Linear(64, 10)

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        return torch.log_softmax(self.fc2(x), dim=1)

# Instantiate the model and other components
model = Net()
optimizer = optim.Adam(model.parameters())
transform = transforms.Compose([transforms.ToTensor(), transforms.Normalize((0.5,), (0.5,))])

# Load the training data
trainset = datasets.MNIST('data', download=True, train=True, transform=transform)
trainloader = torch.utils.data.DataLoader(trainset, batch_size=32, shuffle=True)

criterion = nn.NLLLoss()

# Train the model
for epoch in range(5):
    for images, labels in trainloader:
        images = images.view(images.shape[0], -1)
        optimizer.zero_grad()
        output = model(images)
        loss = criterion(output, labels)
        loss.backward()
        optimizer.step()

# Save the trained model
torch.save(model.state_dict(), 'mnist_model.pth')
