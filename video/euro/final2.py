import os
import re

def replace_url_in_html_files():
    # Get the directory where the script file is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Path to the url.txt file
    url_file_path = os.path.join(script_dir, 'url.txt')
    
    # Read the desired URL from the url.txt file
    with open(url_file_path, 'r', encoding='utf-8') as file:
        desired_url = file.read().strip()

    # Regex pattern to find the top.location.href=".*?" line
    pattern = re.compile(r'top\.location\.href=".*?"')

    # Process each HTML file in the script directory
    for filename in os.listdir(script_dir):
        if filename.endswith('.html'):
            filepath = os.path.join(script_dir, filename)
            with open(filepath, 'r', encoding='utf-8') as file:
                content = file.read()

            # Replace the URL in the matched pattern with the desired URL
            new_content = pattern.sub(f'top.location.href="{desired_url}"', content)

            # Write the updated content back to the file
            with open(filepath, 'w', encoding='utf-8') as file:
                file.write(new_content)

            print(f"Updated URL in file: {filename}")

# Run the function to replace URLs
replace_url_in_html_files()
