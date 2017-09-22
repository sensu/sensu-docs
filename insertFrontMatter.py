#!/usr/bin/python
import sys, os

# TODO: TEST THIS BEAST
# TODO: test for file existence, etc.

def main(argv):
  folder = argv[1]
  project = argv[2]

  # for each file in specified directory
  for filename in os.listdir(folder):
    # open a file and create a temp file to hold our alternation 
    oldFile = open(filename)

    print "Starting file: " + filename

    # allow us to keep track of the old front matter we don't want to copy
    startFrontMatter = false;
    endFrontMatter = false;

    # saves relevant font matter from the old file to be used in the new file
    # title is generally the filename, this key is not being used but may be implemented for use later
    frontMatter = {"title": "", "description": "", "version": "", "weight": ""}

    # for each line in the old file
    for line in oldFile:
      # we have established we're past the front matter 
      if (startFrontMatter and endFrontMatter):
        print "Finished front matter"
        break;
      # save the old front matter to a dictionary
      elif (startFrontMatter):
        if (line == "---"):
          endFrontMatter = true
        for attribute in frontMatter:
          if (line.find(attribute + ": ")):
            tmp = line.split(": ")
            print "Saving attribute: " + attribute + " with value: " + tmp[1]
            frontMatter[attribute] = tmp[1]
      # check the first line of the file
      elif (line == "---"):
        print "Starting front matter"
        startFrontMatter = true

    # reset this to use in our hugo file
    startFrontMatter = false

    # TODO: /filename won't suffice, need to keep track of subdirectories as well
    # may need some splitting or a loop to append the full new path
    newPath = folder + "/" + filename
    newPath = hugopath.split(frontMatter["version"] + "/")
    hugoPath = hugoPath[1]

    os.system("hugo new " + project + "/" + frontMatter["version"] + "/" + hugoPath + "/" + filename)
    hugoFile = open(content + "/" + frontMatter["version"] + "/" + "/" + hugoPath + "/" + filename, "r+b")

    print "Created hugo file"

    for line in hugoFile:
      if (startFrontMatter):
        # break if we've reached the end of the front matter
        if (line == "---"):
          break
        for attribute in frontMatter:
          if (line.find("menu:")):
            print "Writing attribute: " + attribute
            menu = " \"" + project + "-" + frontMatter["version"] + "\""
            line = line + menu
          elif (line.find(attribute + ":")):
            print "Writing attribute: " + attribute
            line = line + " \"" + frontMatter[attribute] + "\""
      if (line == "---"):
        startFrontMatter = true

    # close our hugo file since we're done editing the front matter
    hugoFile.close()
    oldFile.close()

    # append our temp file to this new hugo file
    os.system("cat " + filename + " >> content/" + project + "/" + frontMatter["version"] + "/" + hugoPath + "/" + filename)

    print "Appended to hugo file"

if __name__ == "__main__":
  if (len(sys.argv) == 3):
    main(sys.argv)
  else:
    print "Please supply the following arg(s):"
    print "1: The folder which you'd like to migrate"
    print "2: The name of the project it belongs to, eg. 'sensu-core'"
    sys.stdout.flush()

