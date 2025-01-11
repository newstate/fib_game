from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, 
     methods=["GET", "POST", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"])

def is_fibonacci(numbers):
    return len(numbers) >= 3 and all(numbers[i] == numbers[i-1] + numbers[i-2] for i in range(2, len(numbers)))

def count_five_length_sequences(grid, row_idx, col_idx):
    # Create a copy of the grid with incremented row and column
    test_grid = [row[:] for row in grid]
    for i in range(len(grid)):
        if test_grid[row_idx][i] >= 0:  # Skip cleared cells
            test_grid[row_idx][i] += 1
        if i != row_idx and test_grid[i][col_idx] >= 0:  # Skip cleared cells
            test_grid[i][col_idx] += 1
    
    sequences = []
    # Check rows
    for r_idx, row in enumerate(test_grid):
        for start in range(len(row)-4):
            window = row[start:start + 5]
            if all(n > 0 for n in window) and is_fibonacci(window):
                sequences.append({
                    'type': 'row',
                    'index': r_idx,
                    'start': start,
                    'length': 5
                })
    
    # Check columns
    for c_idx in range(len(test_grid[0])):
        column = [row[c_idx] for row in test_grid]
        for start in range(len(column)-4):
            window = column[start:start + 5]
            if all(n > 0 for n in window) and is_fibonacci(window):
                sequences.append({
                    'type': 'column',
                    'index': c_idx,
                    'start': start,
                    'length': 5
                })
    
    return len(sequences)

@app.route('/')
def home():
    return "Flask server is running on port 5001!", 200

@app.route('/analyze-grid', methods=['POST'])
def analyze_grid():
    try:
        grid = request.get_json()['grid']
        sequences = []
        
        # Check rows
        for row_idx, row in enumerate(grid):
            for start in range(len(row)-2):
                for length in range(3, 6):
                    if start + length <= len(row):
                        window = row[start:start + length]
                        if all(n > 0 for n in window) and is_fibonacci(window):
                            sequences.append({
                                'type': 'row',
                                'index': row_idx,
                                'start': start,
                                'length': length,
                                'values': window
                            })
        
        # Check columns
        for col_idx in range(len(grid[0])):
            column = [row[col_idx] for row in grid]
            for start in range(len(column)-2):
                for length in range(3, 6):
                    if start + length <= len(column):
                        window = column[start:start + length]
                        if all(n > 0 for n in window) and is_fibonacci(window):
                            sequences.append({
                                'type': 'column',
                                'index': col_idx,
                                'start': start,
                                'length': length,
                                'values': window
                            })
        
        return jsonify({'sequences': sequences})
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 400

@app.route('/analyze-potential', methods=['POST'])
def analyze_potential():
    try:
        grid = request.get_json()['grid']
        potential_map = []
        
        for row_idx in range(len(grid)):
            row_potentials = []
            for col_idx in range(len(grid[row_idx])):
                if grid[row_idx][col_idx] >= 0:  # Only analyze non-cleared cells
                    count = count_five_length_sequences(grid, row_idx, col_idx)
                    row_potentials.append(count)
                else:
                    row_potentials.append(-1)  # Mark cleared cells
            potential_map.append(row_potentials)
        
        return jsonify({'potentialMap': potential_map})
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5001) 