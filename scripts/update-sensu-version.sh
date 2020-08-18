#!/usr/bin/env sh

REQUIRED_ARGS=5
PROVIDED_ARGS=$#
OLD_SENSU_VERSION=$1
OLD_SENSU_BUILD=$2
NEW_SENSU_VERSION=$3
NEW_SENSU_BUILD=$4
DOCS_VERSION=$5


check_args() {
  if [ "$REQUIRED_ARGS" != "$PROVIDED_ARGS" ];
  then
    echo "\nERROR: too few arguments. Please provide exactly four arguments:\n"
    echo "  - The old Sensu version number (the version you wish to replace)"
    echo "  - The old Sensu build number (the build you wish to replace)"
    echo "  - The new Sensu version number"
    echo "  - The new Sensu build number"
    echo "  - The docs version number\n"
    exit 1
  fi
  return 0
}

find_and_replace() {

  case $(uname) in
  "Linux")
    sed -i "s/${OLD_SENSU_VERSION}/${NEW_SENSU_VERSION}/g" content/sensu-go/${DOCS_VERSION}/operations/deploy-sensu/install-sensu.md content/sensu-go/${DOCS_VERSION}/platforms.md
    sed -i "s/${OLD_SENSU_BUILD}/${NEW_SENSU_BUILD}/g" content/sensu-go/${DOCS_VERSION}/operations/deploy-sensu/install-sensu.md content/sensu-go/${DOCS_VERSION}/platforms.md
    ;;
  "Darwin")
    sed -i '' "s/${OLD_SENSU_VERSION}/${NEW_SENSU_VERSION}/g" content/sensu-go/${DOCS_VERSION}/operations/deploy-sensu/install-sensu.md content/sensu-go/${DOCS_VERSION}/platforms.md
    sed -i '' "s/${OLD_SENSU_BUILD}/${NEW_SENSU_BUILD}/g" content/sensu-go/${DOCS_VERSION}/operations/deploy-sensu/install-sensu.md content/sensu-go/${DOCS_VERSION}/platforms.md
    ;;
  *)
    echo "Unsupported platform"
  esac
}

check_args
echo "Updating Sensu version from ${OLD_SENSU_VERSION} (build ${OLD_SENSU_BUILD}) to ${NEW_SENSU_VERSION} (build ${NEW_SENSU_BUILD}) for docs version ${DOCS_VERSION}"
find_and_replace
