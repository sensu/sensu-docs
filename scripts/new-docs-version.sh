#!/usr/bin/env sh

REQUIRED_ARGS=8
PROVIDED_ARGS=$#
OLD_SENSU_VERSION=$1
OLD_SENSU_PRODUCT=$2
OLD_SENSU_MENU=$3
OLD_DOCS_VERSION=$4
NEW_SENSU_VERSION=$5
NEW_SENSU_PRODUCT=$6
NEW_SENSU_MENU=$7
NEW_DOCS_VERSION=$8


check_args() {
  if [ "$REQUIRED_ARGS" != "$PROVIDED_ARGS" ];
  then
    echo "\nERROR: too few arguments. Please provide exactly seven arguments:\n"
    echo "  - The old docs version information (the version information you wish to replace)"
    echo "  - The old Sensu product information (the product information you wish to replace)"
    echo "  - The old Sensu menu information (the menu information you wish to replace)"
    echo "  - The old docs version number (the version of the docs to copy for the new docs version"
    echo "  - The new docs version information"
    echo "  - The new Sensu product information"
    echo "  - The new Sensu menu information"
    echo "  - The new docs version number\n"
    exit 1
  fi
  return 0
}

find_and_replace() {

  case $(uname) in
  "Linux")
    find "content/sensu-go/${NEW_DOCS_VERSION}" -type f -iname '*.md' -print0 | xargs -0 sed -i "s/${OLD_SENSU_VERSION}/${NEW_SENSU_VERSION}/g"
    find "content/sensu-go/${NEW_DOCS_VERSION}" -type f -iname '*.md' -print0 | xargs -0 sed -i "s/${OLD_SENSU_PRODUCT}/${NEW_SENSU_PRODUCT}/g"
    find "content/sensu-go/${NEW_DOCS_VERSION}" -type f -iname '*.md' -print0 | xargs -0 sed -i "s/${OLD_SENSU_MENU}/${NEW_SENSU_MENU}/g"
    ;;
  "Darwin")
    find "content/sensu-go/${NEW_DOCS_VERSION}" -type f -iname '*.md' -print0 | xargs -0 sed -i '' "s/${OLD_SENSU_VERSION}/${NEW_SENSU_VERSION}/g"
    find "content/sensu-go/${NEW_DOCS_VERSION}" -type f -iname '*.md' -print0 | xargs -0 sed -i '' "s/${OLD_SENSU_PRODUCT}/${NEW_SENSU_PRODUCT}/g"
    find "content/sensu-go/${NEW_DOCS_VERSION}" -type f -iname '*.md' -print0 | xargs -0 sed -i '' "s/${OLD_SENSU_MENU}/${NEW_SENSU_MENU}/g"
    ;;
  *)
    echo "Unsupported platform"
  esac
}

check_args
echo "Updating information in new Sensu docs version content for ${NEW_DOCS_VERSION}"
find_and_replace
