from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import base64
import traceback

app = Flask(__name__)
CORS(app)

@app.route('/upload', methods=['POST'])
def upload():
    try:
        image_data = request.form.get('image')
        print(image_data)
        if not image_data:
            return jsonify({'status': 'failed', 'error': 'No image data'}), 400

        image_data = base64.b64decode(image_data.split(',')[1])

        timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
        filename = f'screenshot_{timestamp}.png'

        with open(filename, 'wb') as f:
            f.write(image_data)

        return jsonify({'status': 'success'})

    except Exception as e:
        print("Exception:", e)
        traceback.print_exc()  # This will print the stack trace
        return jsonify({'status': 'failed', 'error': 'An error occurred'}), 500

if __name__ == '__main__':
    app.run(port=5000)
