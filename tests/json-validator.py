import argparse
import fnmatch
import json
import os
import re
import sys


parser = argparse.ArgumentParser(description='Find text between markdown JSON tags')
parser.add_argument('--extension', help='Extension of files to validate')
parser.add_argument('--directory', help='Path of directory to recursively go through')
args = parser.parse_args()

exit_status = 0

for root, dirs, files in os.walk(args.directory):
    for filename in fnmatch.filter(files, '*' + args.extension):
        with open(os.path.join(root, filename), "r") as validation_file:

            validation_data = validation_file.read()
            x = re.findall(r'{{< highlight json >}}(.*?){{< /highlight >}}',
                           validation_data, re.DOTALL)

            for json_block in x:
                try:
                    json.loads(json_block)
                except ValueError as exception:
                    print "In file " + validation_file.name + " the following JSON is invalid\n" + \
                    str(exception) + "\n" + json_block + "\n"
                    exit_status = 2
sys.exit(exit_status)
