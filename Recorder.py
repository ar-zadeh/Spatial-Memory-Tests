import webbrowser
import csv
import time
import pyautogui
from pynput import keyboard, mouse
import os
from opengaze import *

flag = True
keyboard_data = []
mouse_data = []
gaze_data = []

# Keyboard listener
def on_keyboard_press(key):
    global flag
    keyboard_data.append(['Keyboard Press', time.time(), str(key)])
    
    if key == keyboard.Key.esc:
        # Terminate the code
        return False

def on_keyboard_release(key):
    keyboard_data.append(['Keyboard Release', time.time(), str(key)])

# Mouse listener
def on_mouse_move(x, y):
    mouse_data.append(['Mouse Move', x, y])

def on_mouse_click(x, y, button, pressed):
    mouse_data.append(['Mouse Click' if pressed else 'Mouse Release', x, y, button])
    
    if pressed:
        # Capture screenshot
        timestamp = time.strftime("%Y-%m-%d_%H-%M-%S")
        screenshot_file = f'screenshot_{timestamp}.png'
        pyautogui.screenshot(screenshot_file)

def write_to_files():
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

# Create listeners
gazetracker = GazePoint()
new = 2 # open in a new tab, if possible

# open an HTML file on my own (Windows) computer
url = f"file:\\{os.getcwd()}\\index.html"
webbrowser.open(url, new=new)

keyboard_listener = keyboard.Listener(on_press=on_keyboard_press, on_release=on_keyboard_release)
mouse_listener = mouse.Listener(on_move=on_mouse_move, on_click=on_mouse_click)

# Start listeners
keyboard_listener.start()
mouse_listener.start()

print("done")

start = time.time()

while True:
    ctime = time.time() - start
    x, y = gazetracker.get_gaze_position()
    gaze_data.append([ctime, x, y])

    # Write data to files in batches (e.g., every 10 seconds)
    print(ctime % 10)
    if ctime % 10 < 0.1:
        write_to_files()
