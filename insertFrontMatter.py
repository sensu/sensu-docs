#!/usr/bin/python
import sys, os

# TODO: TEST THIS BEAST

def main(argv):
  folder = argv[1]
  project = argv[2]

  # for each file in specified directory
  for filename in os.listdir(folder):
    # open a file and create a temp file to hold our alternation 
    oldFile = open(filename)
    tmpFile = open("conversionFile.tmp","w+")

    # allow us to keep track of the old front matter we don't want to copy
    startFrontMatter = false;
    endFrontMatter = false;

    # saves relevant font matter from the old file to be used in the new file
    # title is generally the filename, this key is not being used but may be implemented for use later
    frontMatter = {"title" = "", "description" = "", "version" = "", "weight" = ""}

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

    # close the files since we're done copying the content
    oldFile.close()
    tmpFile.close()

    # reset this to use in our hugo file
    startFrontMatter = false

    # TODO: /filename won't suffice, need to keep track of subdirectories as well
    # may need some splitting or a loop to append the full new path
    os.system("hugo new " + project + "/" frontMatter["version"] + "/" + filename)
    hugoFile = open(content + "/" + frontMatter["version"] + "/" + filename, "r+b")

    for line in hugoFile:
      if (startFrontMatter)
        # break if we've reached the end of the front matter
        if (line == "---"):
          break
        elif (line.find("description: ")):
          line = line + "\"" + frontMatter["description"] + "\""
        elif (line.find("version: ")):
          line = line + "\"" + frontMatter["version"] + "\""
        elif (line.find("weight: ")):
          line = line + "\"" + frontMatter["weight"] + "\""
        elif (line.find("menu: ")):
          menu = project + "-" + frontMatter["version"]
          line = line + menu

    # close our hugo file since we're done editing the front matter
    hugoFile.close()

    # append our temp file to this new hugo file
    os.system("cat conversionFile.tmp >> " + "content/" + project + "/" fontMatter["version"] + filename)

    # delete temp file and close files
    os.system("rm conversionFile.tmp")

if __name__ == "__main__":
  if (len(sys.argv) == 3):
    main(sys.argv)
  else:
    print "Please supply the following arg(s):"
    print "1: The folder which you'd like to migrate"
    print "2: The name of the project it belongs to"
    sys.stdout.flush()

