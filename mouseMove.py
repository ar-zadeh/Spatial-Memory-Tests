from opengaze import *
import pyautogui

# Screen resolution
screen_width = 1920
screen_height = 1080

gazetracker = GazePoint()
# gazetracker.tracker.calibrate()
gazetracker.tracker.enable_send_data(True)

for i in range(1000):
    x_norm, y_norm = gazetracker.get_gaze_position()
    print(x_norm,y_norm)
    try:
        # Ensure x and y are within [0, 1] 
        x_norm = max(0, min(1, x_norm))
        y_norm = max(0, min(1, y_norm))
        
        # Convert normalized coordinates to pixel coordinates
        x_pixel = int(x_norm * screen_width)
        y_pixel = int(y_norm * screen_height)
        
        # Ensure x and y are within screen boundaries
        x_pixel = max(0, min(screen_width, x_pixel))
        y_pixel = max(0, min(screen_height, y_pixel))

        # Move the cursor
        pyautogui.moveTo(x_pixel, y_pixel)
    except:
        continue