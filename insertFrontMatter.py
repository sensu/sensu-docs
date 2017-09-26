#!/usr/bin/python
import sys, os, frontmatter

def main(argv):
  folder = argv[1]
  project = argv[2]

  print "folder: " + folder
  print "project: " + project

  executingDir = os.getcwd()
  os.chdir(folder)

  for filename in os.listdir(folder):
    print "Starting file: " + filename
    oldFile = frontmatter.load(folder + "/" + filename)

    os.chdir(executingDir)
    hugoPath = "content/" + project + "/" + str(oldFile["version"]) + createHugoPath(project, folder, filename, str(oldFile["version"]))
    hugoFile = open(hugoPath, "w+")

    hugoFile.write("---\n")
    hugoFile.write("title: \"" + oldFile["title"] + "\"\n")
    hugoFile.write("description: \"" + oldFile["description"] + "\"\n")
    hugoFile.write("product: \"" + project + "\"\n")
    hugoFile.write("version: \"" + str(oldFile["version"]) + "\"\n")
    hugoFile.write("weight: " + str(oldFile["weight"]) + "\n")
    hugoFile.write("menu: \"" + project + "-" + str(oldFile["version"]) + "\"\n")
    hugoFile.write("---\n")

    hugoFile.write(oldFile.content.encode('utf-8'))

    hugoFile.close()

def createHugoPath(project, folder, filename, version):
  hugoPath = ""
  newPath = folder + filename
  newPath2 = newPath.split("/")
  log = False
  for segment in newPath2:
    if (segment == version.rstrip()):
      log = True
    elif (log):
      hugoPath = hugoPath + "/" + segment

  return hugoPath

if __name__ == "__main__":
  if (len(sys.argv) == 3):
    main(sys.argv)
  else:
    print "Please supply the following arg(s):"
    print "1: The folder which you'd like to migrate"
    print "2: The name of the project it belongs to, eg. 'sensu-core'"
    sys.stdout.flush()

