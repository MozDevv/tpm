// test.jsx

// Function to log progress to the console
function logProgress(message) {
  console.log(message);
}

// Extremely heavy function with very high time and space complexity
function heavyFunction(size) {
  logProgress(`Starting heavy function with size ${size}`);

  // Create a large 2D matrix of size x size
  const matrix = new Array(size);
  for (let i = 0; i < size; i++) {
    matrix[i] = new Array(size);
    for (let j = 0; j < size; j++) {
      matrix[i][j] = Math.random(); // Fill with random values
    }
  }

  // Perform matrix multiplication (O(n³) time complexity)
  const result = new Array(size);
  for (let i = 0; i < size; i++) {
    result[i] = new Array(size);
    for (let j = 0; j < size; j++) {
      result[i][j] = 0;
      for (let k = 0; k < size; k++) {
        result[i][j] += matrix[i][k] * matrix[k][j];
      }
    }
    logProgress(`Matrix multiplication: Row ${i + 1} of ${size} completed`);
  }

  // Calculate the determinant of the matrix (O(n!) time complexity)
  function calculateDeterminant(mat, n) {
    if (n === 1) return mat[0][0];
    if (n === 2) return mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0];

    let determinant = 0;
    for (let col = 0; col < n; col++) {
      const subMatrix = new Array(n - 1);
      for (let i = 0; i < n - 1; i++) {
        subMatrix[i] = new Array(n - 1);
      }

      for (let i = 1; i < n; i++) {
        let subCol = 0;
        for (let j = 0; j < n; j++) {
          if (j === col) continue;
          subMatrix[i - 1][subCol] = mat[i][j];
          subCol++;
        }
      }

      const subDet = calculateDeterminant(subMatrix, n - 1);
      determinant += (col % 2 === 0 ? 1 : -1) * mat[0][col] * subDet;
    }
    return determinant;
  }

  logProgress('Calculating determinant...');
  const determinant = calculateDeterminant(matrix, size);
  logProgress(`Determinant of the matrix: ${determinant}`);

  logProgress(`Heavy function completed with size ${size}`);
  return result;
}

// Simulate an asynchronous task
function asyncTask(name, duration) {
  return new Promise((resolve) => {
    setTimeout(() => {
      logProgress(`Async task ${name} completed`);
      resolve();
    }, duration);
  });
}

// Main function to demonstrate the event loop and call stack
async function main() {
  logProgress('Starting the program');

  // Push an extremely heavy synchronous task to the stack
  heavyFunction(30); // This will block the stack for a very long time

  // Push an asynchronous task
  asyncTask('A', 1000).then(() => {
    logProgress('Async task A resolved');
  });

  // Push another heavy synchronous task
  heavyFunction(5); // This will block the stack again

  // Use await to handle an asynchronous task
  logProgress('Before await');
  await asyncTask('B', 500); // Waits for 0.5 seconds without blocking the stack
  logProgress('After await');

  // Push a final heavy synchronous task
  heavyFunction(3); // This will block the stack

  logProgress('End of the program');
}

// Run the main function
main();
