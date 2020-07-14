#!/usr/bin/env sh

REQUIRED_ARGS=2
PROVIDED_ARGS=$#
OLD_SENSU_VERSION=$1
NEW_SENSU_VERSION=$2
DOCS_ROOT=$3

check_args() {
  if [ "$REQUIRED_ARGS" -gt "$PROVIDED_ARGS" ];
  then
    echo "\nERROR: Too few arguments. Please provide at least two arguments:\n"
    echo "  - The source Sensu version number"
    echo "  - The destination Sensu version number"
    echo "  - The directory path for sensu-docs repository. Defaults to current working directory (${PWD})."
    exit 1
  fi

  if [ -z "$DOCS_ROOT" ];
  then
    echo "Docs root directory not provided. Defaulting to ${PWD}."
    DOCS_ROOT=$PWD
  fi

  if [ ! -d "$DOCS_ROOT/content/sensu-go/$OLD_SENSU_VERSION" ];
  then
    echo "\nERROR: The version you specified does not exist. Please provide an existing Sensu version to use as the source.\n"
    exit 1
  fi
  return 0
}

find_and_replace() {
  case $(uname) in
  "Linux")
    echo "Updating version attribute in front matter"
    find "$DOCS_ROOT/content/sensu-go/$NEW_SENSU_VERSION" -iname '*.md' -exec sed -i "s/version: \"${OLD_SENSU_VERSION}\"/version: \"${NEW_SENSU_VERSION}\"/g" {} +
    echo "Renaming menu attribute in front matter"
    find "$DOCS_ROOT/content/sensu-go/$NEW_SENSU_VERSION" -iname '*.md' -exec sed -i "s/  sensu-go-${OLD_SENSU_VERSION}\:/  sensu-go-${NEW_SENSU_VERSION}\:/g" {} +
    find "$DOCS_ROOT/content/sensu-go/$NEW_SENSU_VERSION" -iname '*.md' -exec sed -i "s/menu: \"sensu-go-${OLD_SENSU_VERSION}\"/menu: \"sensu-go-${NEW_SENSU_VERSION}\"/g" {} +
    return 0
    ;;
  "Darwin")
    echo "Updating version attribute in front matter"
    find "$DOCS_ROOT/content/sensu-go/$NEW_SENSU_VERSION" -iname '*.md' -exec sed -i '' "s/version: \"${OLD_SENSU_VERSION}\"/version: \"${NEW_SENSU_VERSION}\"/g" {} +
    echo "Renaming menu attribute in front matter"
    find "$DOCS_ROOT/content/sensu-go/$NEW_SENSU_VERSION" -iname '*.md' -exec sed -i '' "s/  sensu-go-${OLD_SENSU_VERSION}\:/  sensu-go-${NEW_SENSU_VERSION}\:/g" {} +
    find "$DOCS_ROOT/content/sensu-go/$NEW_SENSU_VERSION" -iname '*.md' -exec sed -i '' "s/menu: \"sensu-go-${OLD_SENSU_VERSION}\"/menu: \"sensu-go-${NEW_SENSU_VERSION}\"/g" {} +
    return 0
    ;;
  *)
    echo "Unsupported platform"
    return 1
  esac
}

clone_directory() {
  echo "Copying Sensu docs from ${OLD_SENSU_VERSION} to ${NEW_SENSU_VERSION}"
  cp -R "$DOCS_ROOT/content/sensu-go/$OLD_SENSU_VERSION" "$DOCS_ROOT/content/sensu-go/$NEW_SENSU_VERSION"
}

check_args
clone_directory
find_and_replace
echo "Job done. Update config.toml to include the new version ${NEW_SENSU_VERSION} and run 'yarn run server' to test your changes."
