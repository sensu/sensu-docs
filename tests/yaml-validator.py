import argparse
import fnmatch
import yaml
import os
import re
import sys


def preprocess(yaml_block):
    return re.sub(r"{{.*?}}", "dummy_value", yaml_block)


parser = argparse.ArgumentParser(description='Find text between markdown YAML tags')
parser.add_argument('--extension', help='Extension of files to validate')
parser.add_argument('--directory', help='Path of directory to recursively go through')
args = parser.parse_args()

exit_status = 0

for root, dirs, files in os.walk(args.directory):
    for filename in fnmatch.filter(files, '*' + args.extension):
        with open(os.path.join(root, filename), "r") as validation_file:

            validation_data = validation_file.read()
            x = re.findall(r'{{< code yaml >}}\s*\n(.*?)\n\s*{{< /code >}}',
               validation_data, re.DOTALL)

            for yaml_block in x:
                yaml_block = preprocess(yaml_block)  # preprocess the YAML block
                try:
                    yaml_docs = yaml.safe_load_all(yaml_block)
                    for doc in yaml_docs:
                        pass  # We just need to consume the generator to validate all documents
                except yaml.YAMLError as exception:
                    print(f"In file {validation_file.name} the following YAML is invalid\n{str(exception)}\n{yaml_block}\n")
                    exit_status = 2
sys.exit(exit_status)
