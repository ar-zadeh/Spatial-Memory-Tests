import webbrowser
import csv
import time
import pyautogui
import os
from opengaze import *
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import base64
import traceback
import threading

keyboard_data = []
mouse_data = []
gaze_data = []

# Keyboard listener
def on_keyboard_press(key):
    global ctime
    keyboard_data.append(['Keyboard Press', time.time()-ctime, str(key)])
    if str(key) == "Key.esc":
        return False

def on_keyboard_release(key):
    global ctime
    keyboard_data.append(['Keyboard Release', time.time()-ctime, str(key)])

def write_to_files():
    global keyboard_data, mouse_data, gaze_data
    with open('keyboard_data.csv', 'a', newline='') as file:
        writer = csv.writer(file) 
        writer.writerows(keyboard_data)
    keyboard_data.clear()

    with open('mouse_data.csv', 'a', newline='') as file:
        writer = csv.writer(file)
        writer.writerows(mouse_data)
    mouse_data.clear()

    with open('gaze_pos.csv', 'a', newline='') as file:
        writer = csv.writer(file)
        writer.writerows(gaze_data)
    gaze_data.clear()

app = Flask(__name__)
CORS(app)

@app.route('/upload', methods=['POST'])
def upload():
    global ctime
    try:
        image_data = request.form.get('image')
        if not image_data:
            return jsonify({'status': 'failed', 'error': 'No image data'}), 400

        image_data = base64.b64decode(image_data.split(',')[1])

        timestamp = time.time()
        filename = f'screenshots/screenshot_{timestamp-ctime}.png'

        with open(filename, 'wb') as f:
            f.write(image_data)

        return jsonify({'status': 'success'})

    except Exception as e:
        print("Exception:", e)
        traceback.print_exc()
        return jsonify({'status': 'failed', 'error': 'An error occurred'}), 500
@app.route('/save_results', methods=['POST'])
def save_results():
    # Get the string data from the POST request
    data_str = request.data.decode("utf-8")
    
    # Save the string data to a text file
    with open('results.txt', 'w') as file:
        file.write(data_str)
    
    return jsonify({'status': 'success'})

def run_flask_app():
    app.run(port=5000)

def data_collection():
    global ctime ,cctime
    new = 2
    name = input("Enter participant's ID: ")
    url = f"file:\\{os.getcwd()}\\index.html"
    webbrowser.open(url, new=new)
if __name__ == "__main__":
    ctime = time.time()
    cctime = time.time()
    flask_thread = threading.Thread(target=run_flask_app)
    data_collection_thread = threading.Thread(target=data_collection)
    flask_thread.start()
    data_collection_thread.start()