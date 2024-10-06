import os

destination_path = r'C:\Users\abb6024\OneDrive - The Pennsylvania State University\HCAI\CorsiMemoryTest_Data'

# Get the list of participant folders in the destination path
participant_folders = [folder for folder in os.listdir(destination_path) if os.path.isdir(os.path.join(destination_path, folder))]

# Iterate over each participant folder
for folder_name in participant_folders:
    # Get the path to the participant folder
    participant_folder_path = os.path.join(destination_path, folder_name)
    
    # Get the path to the keyboard_data.csv file
    keyboard_data_path = os.path.join(participant_folder_path, 'keyboard_data.csv')
    
    # Get the last modification timestamp of the keyboard_data.csv file
    keyboard_data_timestamp = int(os.path.getmtime(keyboard_data_path))
    
    # Get the path to the screenshots folder
    screenshots_folder_path = os.path.join(participant_folder_path, 'screenshots', 'screenshots')
    
    # Iterate over each screenshot file in the screenshots folder
    for screenshot_file in os.listdir(screenshots_folder_path):
        if screenshot_file.endswith('.png'):
            # Get the timestamp from the screenshot file name
            screenshot_timestamp = int(screenshot_file.split('_')[1].split('.')[0])
            print(screenshot_timestamp,keyboard_data_timestamp)
            # Calculate the timestamp difference between the screenshot and keyboard_data.csv
            timestamp_diff =  keyboard_data_timestamp - screenshot_timestamp
            
            # Create the new screenshot file name with the timestamp difference
            new_screenshot_name = f"screenshot_{timestamp_diff}.png"
            
            # Rename the screenshot file with the new name
            os.rename(os.path.join(screenshots_folder_path, screenshot_file),
                      os.path.join(screenshots_folder_path, new_screenshot_name))

print("Screenshot names updated successfully.")