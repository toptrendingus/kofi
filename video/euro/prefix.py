import os

def rename_files(directory, prefixes_file):
    # Get a list of all HTML files in the directory
    html_files = [f for f in os.listdir(directory) if f.endswith('.html')]

    # Sort the files to ensure they are renamed in order
    html_files.sort()

    # Read prefixes from the specified file
    with open(prefixes_file, 'r') as file:
        prefixes = [line.strip() for line in file.readlines()]

    # Calculate the number of files to rename for each prefix
    num_files_per_prefix = len(html_files) // len(prefixes)

    # Rename the files for each prefix
    for prefix in prefixes:
        for i, old_name in enumerate(html_files[:num_files_per_prefix], start=1):
            new_name = f'{prefix}{i:02d}.html'  # Adjust the format as needed
            old_path = os.path.join(directory, old_name)
            new_path = os.path.join(directory, new_name)
            os.rename(old_path, new_path)

        print(f'First {num_files_per_prefix} files with prefix {prefix} successfully renamed!')

        # Remove the processed files from the list
        html_files = html_files[num_files_per_prefix:]

    print(f'Prefixes from {prefixes_file} applied.')

# Specify the directory where your HTML files are located
directory = os.path.dirname(os.path.abspath(__file__))

# Specify the .txt file containing the prefixes
prefixes_file = os.path.join(directory, 'prefix.txt')

# Rename files for each prefix based on the prefixes from the .txt file
rename_files(directory, prefixes_file)
