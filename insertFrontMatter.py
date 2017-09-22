#!/usr/bin/python
import sys, os

def main(argv):
  folder = argv[1]
  project = argv[2]

  # for each file in specified directory
  for filename in os.listdir(folder):
    # open a file and create a temp file to hold our alternation 
    oldfile = open(filename)
    tmpFile = open("conversionFile.tmp","w+")

    # allow us to keep track of the old front matter we don't want to copy
    startFrontMatter = false;
    endFrontMatter = false;

    # saves relevant font matter from the old file to be used in the new file
    fontMatter = {"title" = "", "description" = "", "version" = "", "weight" = ""}

    # for each line in the old file
    for line in oldFile:
      # only write if we have established we're past the front matter 
      if (startFrontMatter && endFrontMatter):
        tmpFile.write(line)
      # save the previous front matter to a dictionary
      elif (startFrontMatter):
        if (line == "---"):
          endFrontMatter = true
          if (line.find("title: ")):
            tmp = line.split(": ")
            frontMatter["title"] = tmp[1]
          elif (line.find("description: "):
            tmp = line.split(": ")
            frontMatter["description"] = tmp[1]
          elif (line.find("version: "):
            tmp = line.split(": ")
            frontMatter["version"] = tmp[1]
          elif (line.find("weight: "):
            tmp = line.split(": ")
            frontMatter["weight"] = tmp[1]
      # check the first line of the file
      elif (line == "---"):
        startFrontMatter = true

    # close the old file since we're done copying the content
    oldFile.close()

    # TODO:
    # os.system("hugo new " + project + 
    # hugo new stuff
    # os.system("cat " + oldFile + " >> " + newFile)
    # fill in any blanks in the new hugo file front matter

if __name__ == "__main__":
  if (len(sys.argv) == 3):
    main(sys.argv)
  else:
    print "Please supply the following arg(s):"
    print "1: The folder which you'd like to migrate"
    print "2: The name of the project it belongs to"
    sys.stdout.flush()

