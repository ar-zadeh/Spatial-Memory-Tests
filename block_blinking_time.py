import os
import pandas as pd
import datetime

# Set the base directory path
base_dir = r"C:\Users\abb6024\OneDrive - The Pennsylvania State University\CTF+HCAI+ICDS\Introduction\Participants"

# Iterate through the participant folders
for participant_folder in os.listdir(base_dir):
    if participant_folder[0].isdigit():

        folder_path = os.path.join(base_dir, participant_folder)
        
        # Check if the current item is a directory
        if os.path.isdir(folder_path):
            # Find the "all_sequences" file
            all_sequences_file = None
            for file in os.listdir(folder_path):
                if file.startswith("all_sequences") and file.endswith(".csv"):
                    all_sequences_file = file
                    break
            
            if all_sequences_file:
                all_sequences_path = os.path.join(folder_path, all_sequences_file)
                
                # Read the "all_sequences" CSV file into a DataFrame
                df_all_sequences = pd.read_csv(all_sequences_path)
                
                # Get the last modification date of the "keyboard_data.csv" file
                keyboard_data_path = os.path.join(folder_path, "gaze_pos.csv")
                if os.path.exists(keyboard_data_path):
                    keyboard_data_mtime = os.path.getctime(keyboard_data_path)
                    
                    df_all_sequences["timestamp"] = (df_all_sequences["timestamp"])
                    df_all_sequences["time_diff"] = (df_all_sequences["timestamp"] *0.001- keyboard_data_mtime)
                    # Convert the "timestamp" column back to string format
                    
                    # Save the updated DataFrame back to the CSV file
                    df_all_sequences.to_csv(all_sequences_path, index=False)
                    
                    print(f"Updated {all_sequences_file} in {participant_folder}")
                else:
                    print(f"keyboard_data.csv not found in {participant_folder}")
            else:
                print(f"all_sequences file not found in {participant_folder}")