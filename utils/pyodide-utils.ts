declare global {
  interface Window {
    loadPyodide: any;
  }
}

let pyodide: any = null;

export async function initializePyodide() {
  if (!pyodide) {
    // Load Pyodide script
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
    document.head.appendChild(script);

    // Wait for script to load
    await new Promise(resolve => script.onload = resolve);

    // Initialize Pyodide
    pyodide = await window.loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/"
    });
    
    // Install sympy and initialize helper functions
    await pyodide.loadPackage('sympy');
    await pyodide.runPythonAsync(`
      import sympy
      
      def is_fibonacci_sequence(numbers):
          if len(numbers) < 3:
              return False
              
          if any(n <= 0 for n in numbers):
              return False
              
          for i in range(2, len(numbers)):
              if numbers[i] != numbers[i-1] + numbers[i-2]:
                  return False
                  
          return True
    `);
  }
  return pyodide;
}

export async function checkFibonacciSequence(numbers: number[]): Promise<boolean> {
  if (!pyodide) {
    throw new Error('Pyodide not initialized');
  }
  
  return await pyodide.runPythonAsync(`
    is_fibonacci_sequence(${JSON.stringify(numbers)})
  `);
} 