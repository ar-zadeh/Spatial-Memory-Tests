import os
import shutil

source_path = r'C:\Users\abb6024\OneDrive - The Pennsylvania State University\CTF+HCAI+ICDS\Introduction\Participants'
destination_path = r'C:\Users\abb6024\OneDrive - The Pennsylvania State University\HCAI\CorsiMemoryTest'

# Create the destination folder if it doesn't exist
os.makedirs(destination_path, exist_ok=True)

# Get the list of participant folders in the source path
participant_folders = [folder for folder in os.listdir(source_path) if os.path.isdir(os.path.join(source_path, folder))]

# Create a dictionary to store the iteration count for each participant
iteration_count = {}

# Iterate over each participant folder
for folder_name in participant_folders:
    # Extract the participant number from the folder name
    participant_number = ''.join(filter(str.isdigit, folder_name))
    
    # Increment the iteration count for the participant
    if participant_number in iteration_count:
        iteration_count[participant_number] += 1
    else:
        iteration_count[participant_number] = 1
    
    # Create the new folder name using the format S{number}_{iteration}
    new_folder_name = f"S{participant_number}_{iteration_count[participant_number]}"
    
    # Create the destination folder path
    destination_folder_path = os.path.join(destination_path, new_folder_name)
    
    # Copy the participant folder to the destination folder with the new name
    shutil.copytree(os.path.join(source_path, folder_name), destination_folder_path)

print("Participant folders copied and renamed successfully.")