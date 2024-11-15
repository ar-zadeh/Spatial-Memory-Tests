import os
import shutil
from datetime import datetime

participants_path = r'C:\Users\abb6024\OneDrive - The Pennsylvania State University\CTF+HCAI+ICDS\Introduction\Participants'
participants = os.listdir(participants_path)
for participant in participants:
    print(f"We are in {participant} folder")
    try:
        folder_path = os.path.join(participants_path,participant)
        csv_path = os.path.join(folder_path,"gaze_pos.csv")
        first_timestamp = os.path.getctime(csv_path)
        folder_path = os.path.join(folder_path,"screenshots")
        screenshot_folder = 'screenshots'
    except:
        print('no screenshots in ',participant)
        pass
    # Create the screenshots folder if it doesn't exist
    screenshots_path = os.path.join(folder_path, screenshot_folder)
    os.makedirs(screenshots_path, exist_ok=True)

    # Get the list of files in the folder
    files = os.listdir(folder_path)

    # Copy and rename the screenshot files to the screenshots folder
    for file_name in files:
        if file_name.endswith('.png'):
            file_path = os.path.join(folder_path, file_name)
            if os.path.isfile(file_path):
                # Get the last modified time of the file
                last_modified_time = os.path.getmtime(file_path)
                
                timestamp = datetime.fromtimestamp(last_modified_time).strftime('%Y%m%d_%H%M%S')
                # Create the new file name with the timestamp
                new_file_name = f'screenshot_{last_modified_time-first_timestamp}.png'
                
                # Copy the file to the screenshots folder with the new name
                destination_path = os.path.join(screenshots_path, new_file_name)
                shutil.copy2(file_path, destination_path)

    # Get the list of screenshot files in the screenshots folder
    screenshot_files = os.listdir(screenshots_path)

    # Create a list of tuples containing the file name and last modified time
    file_info = []
    for file_name in screenshot_files:
        file_path = os.path.join(screenshots_path, file_name)
        if os.path.isfile(file_path):
            last_modified_time = os.path.getmtime(file_path)
            file_info.append((file_name, last_modified_time))

    # Sort the screenshot files based on their last modified time
    sorted_files = sorted(file_info, key=lambda x: x[1])

    # Print the sorted screenshot files
    print("Screenshot files sorted by last modified time:")
    for file_name, last_modified_time in sorted_files:
        last_modified_time_readable = datetime.fromtimestamp(last_modified_time)
        print(f"{file_name}: {last_modified_time_readable}")