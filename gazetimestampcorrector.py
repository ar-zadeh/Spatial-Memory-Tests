import os
import pandas as pd
import numpy as np

# Set the path to the folder containing the participant folders
folder_path = "C:\\Users\\abb6024\\OneDrive - The Pennsylvania State University\\CTF+HCAI+ICDS\\Introduction\\Participants"

# Iterate over each participant folder
for participant_folder in os.listdir(folder_path):
    # Create the path to the gaze_pos.csv file
    input_file = os.path.join(folder_path, participant_folder, "gaze_pos.csv")
    output_file = os.path.join(folder_path, participant_folder, "gaze_position.csv")

    # Check if the gaze_pos.csv file exists

# Specify the input and output file paths

    # Specify the mean and standard deviation for the normal distribution
    mean = 0.206437645
    std = 0.029048356

    # Read the input CSV file
    df = pd.read_csv(input_file, header=None, names=["timestamp", "x", "y"])

    # Generate random normal samples for each row
    num_rows = len(df)
    normal_samples = np.random.normal(mean, std, size=num_rows)

    # Calculate the cumulative sum of normal samples
    cumulative_sum = np.cumsum(normal_samples)

    # Add the new column to the DataFrame
    df['cumulative_normal_sample'] = cumulative_sum

    # Write the updated DataFrame to the output CSV file
    df.to_csv(output_file, index=False)

    print(f"CSV file updated with the new column. Output saved to: {output_file}")