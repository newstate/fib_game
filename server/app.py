from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, 
     methods=["GET", "POST", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"])

def is_fibonacci(numbers):
    return len(numbers) >= 3 and all(numbers[i] == numbers[i-1] + numbers[i-2] for i in range(2, len(numbers)))

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

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5001) 