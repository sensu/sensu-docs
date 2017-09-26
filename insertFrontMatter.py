#!/usr/bin/python
import sys, os

# TODO: TEST THIS BEAST
# TODO: test for file existence, etc.

def main(argv):
  folder = argv[1]
  project = argv[2]

  print "folder: " + folder
  print "project: " + project

  # save our working directory then change directory
  executingDir = os.getcwd()
  os.chdir(folder)

  # for each file in specified directory
  for filename in os.listdir(folder):
    # open a file and create a temp file to hold our alternation 
    oldFile = open(folder + "/" + filename)

    print "Starting file: " + filename

    # allow us to keep track of the old front matter we don't want to copy
    startFrontMatter = False;
    endFrontMatter = False;

    # save relevant font matter from the old file to be used in the new file
    frontMatter = {"title": "", "description": "", "version": "", "weight": ""}
    hugoLineStart = 0

    # for each line in the old file
    for line in oldFile:
      # we have established we're past the front matter 
      if (startFrontMatter and endFrontMatter):
        print "Finished saving front matter"

        # go back to our executing directory
        os.chdir(executingDir)

        # create the Hugo file, returns the path for the file
        hugoPath = createHugoFile(project, folder, filename, frontMatter)
        print "Created hugo file"

        # insert our saved front matter, returns the final line of front matter
        hugoFile = open("content/" + project + "/" + frontMatter["version"].rstrip() + hugoPath, "r+b")
        #hugoLineStart = insertFrontMatter(project, hugoPath, frontMatter) + 1
        #print "Finished inserting front matter"

        startFrontMatter = False
        endFrontMatter = False
      # save the old front matter to a dictionary
      elif (startFrontMatter):
        print line
        if (line.rstrip() == "---"):
          endFrontMatter = True
        for attribute in frontMatter:
          if ((attribute + ": ") in line):
            tmp = line.split(": ")
            print "Saving attribute: " + attribute + " with value: " + tmp[1]
            frontMatter[attribute] = tmp[1]
      # check the first line of the file
      elif (line.rstrip() == "---"):
        print "Starting front matter"
        startFrontMatter = True
      #else:
        # open hugo file again, append lines from old doc
        # hugoFile = open("content/" + project + "/" + frontMatter["version"].rstrip() + hugoPath, "r+b")
        #hugoFile.seek(hugoLineStart, 0)
        #hugoFile.write(line)
        #print "Appending :" + line + " to line " + str(hugoLineStart) + " of hugo file"
        #hugoLineStart = hugoLineStart + 1

    # close our hugo file since we're done editing the front matter
    hugoFile.close()
    oldFile.close()

    # append the old file to Hugo file
    hugoLineStart = hugoLineStart + 1
    #os.system("sed '" + str(hugoLineStart) + "r " + folder + "/" + filename + "' " + "content/" + project + "/" + frontMatter["version"].rstrip() + hugoPath)
    # os.system("cat " + folder + "/" + filename + " >> content/" + project + "/" + frontMatter["version"].rstrip() + hugoPath)
    print "Appended to hugo file"
    break

def createHugoFile(project, folder, filename, frontMatter):
  # generate the proper path for Hugo
  hugoPath = ""
  newPath = folder + filename
  print newPath
  newPath2 = newPath.split("/")
  print newPath2
  log = False
  for segment in newPath2:
    if (segment == frontMatter["version"].rstrip()):
      log = True
    elif (log):
      hugoPath = hugoPath + "/" + segment

  # create the Hugo File
  # os.system("hugo new " + project + "/" + frontMatter["version"].rstrip() + "/" + hugoPath)

  return hugoPath

def insertFrontMatter(project, hugoPath, frontMatter):
  hugoFile = open("content/" + project + "/" + frontMatter["version"].rstrip() + hugoPath, "r+b")
  startFrontMatter = False
  endFrontMatter = True

  print "Front Matter: "
  print frontMatter

  for i, line in enumerate(hugoFile, 1):
    if (startFrontMatter):
      print line
      # break if we've reached the end of the front matter and return finish line
      if (line.rstrip() == "---"):
        return i
      frontMatterKeys = frontMatter.keys()
      frontMatterKeys.append("menu")
      for attribute in frontMatterKeys:
          if (line.startswith(attribute + ":")):
            if (attribute == "menu"):
              print "Writing attribute: " + attribute
              menu = " \"" + project + "-" + frontMatter["version"].rstrip() + "\""
              line = line.rstrip() + menu + "\n"
            else:
              print "Writing attribute: " + attribute
              line = line.rstrip() + " "  + frontMatter[attribute]
    if (line.rstrip() == "---"):
      startFrontMatter = True
  hugoFile.close()

if __name__ == "__main__":
  if (len(sys.argv) == 3):
    main(sys.argv)
  else:
    print "Please supply the following arg(s):"
    print "1: The folder which you'd like to migrate"
    print "2: The name of the project it belongs to, eg. 'sensu-core'"
    sys.stdout.flush()

