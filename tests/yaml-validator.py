import argparse
import fnmatch
import yaml
import os
import re
import sys


def preprocess(yaml_block):
    # replace Go template substitutions with a dummy value
    yaml_block = re.sub(r"{{.*?}}", "dummy_value", yaml_block)
    # replace ... with # ...
    yaml_block = yaml_block.replace("...", "# ...")
    return yaml_block


parser = argparse.ArgumentParser(description='Find text between markdown YAML tags')
parser.add_argument('--extension', help='Extension of files to validate')
parser.add_argument('--directory', help='Path of directory to recursively go through')
args = parser.parse_args()

exit_status = 0

for root, dirs, files in os.walk(args.directory):
    for filename in fnmatch.filter(files, '*' + args.extension):
        with open(os.path.join(root, filename), "r") as validation_file:

            validation_data = validation_file.read()
            x = re.findall(r'{{< code yml >}}(.*?){{< /code >}}',
                           validation_data, re.DOTALL)

            for yaml_block in x:
                try:
                    yaml_block = preprocess(yaml_block)
                    yaml.safe_load(yaml_block)
                except yaml.scanner.ScannerError as exception:
                    if "while scanning a quoted scalar" not in str(exception):
                        print(f"In file {validation_file.name} the following YAML is invalid\n{str(exception)}\n{yaml_block}\n")
                        exit_status = 2

sys.exit(exit_status)
