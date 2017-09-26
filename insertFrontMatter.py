#!/usr/bin/python
import sys, os, frontmatter, errno

def main(folder, project):
  executingDir = os.getcwd()
  os.chdir(folder)

  projectReadable = project
  project = project.lower()
  project = project.replace(" ", "-")

  # get only the files and not sub-directories
  files = (file for file in os.listdir(folder)
         if os.path.isfile(os.path.join(folder, file)))

  for filename in files:
    print "Converting file: " + filename

    # load the old file
    oldFile = frontmatter.load(folder + "/" + filename)

    # make the containing directory if it doesn't already exist
    os.chdir(executingDir)
    folderPath = getEndOfPath(project, folder, str(oldFile["version"]))
    if not os.path.exists("content/" + project + "/" + str(oldFile["version"]) + getEndOfPath(project, folder, str(oldFile["version"]))):
      os.mkdir("content/" + project + "/" + str(oldFile["version"]) + getEndOfPath(project, folder, str(oldFile["version"])))

    # create the file in Hugo
    hugoPath = "content/" + project + "/" + str(oldFile["version"]) + folderPath + "/" + filename
    hugoFile = open(hugoPath, "w+")

    # write the front matter
    # print "Writing front matter..."
    hugoFile.write("---\n")
    hugoFile.write("title: \"" + oldFile["title"] + "\"\n")
    hugoFile.write("description: \"" + oldFile["description"] + "\"\n")
    hugoFile.write("product: \"" + projectReadable + "\"\n")
    hugoFile.write("version: \"" + str(oldFile["version"]) + "\"\n")
    hugoFile.write("weight: " + str(oldFile["weight"]) + "\n")
    hugoFile.write("menu: \"" + project + "-" + str(oldFile["version"]) + "\"\n")
    hugoFile.write("---\n")

    # write the content of the old file to the Hugo file
    # print "Writing content..."
    hugoFile.write(oldFile.content.encode('utf-8'))

    # close our file
    hugoFile.close()
    # print "Completed " + filename

# get the path after version number so we can map it properly in Hugo
def getEndOfPath(project, folder, version):
  hugoPath = ""
  splitDirs = folder.split("/")
  log = False
  # only append to hugoPath if we're past the unrelevant dirs
  for directory in splitDirs:
    if (directory == version):
      log = True
    elif (log):
      hugoPath = hugoPath + "/" + directory
  return hugoPath

if __name__ == "__main__":
  print "Play nice and supply valid args."
  print "This program does not parse sub-directories.\n"
  print "Please enter the absolute path to the folder you'd like to migrate:"
  folder = raw_input()
  print "Please enter the name of the project it belongs to, eg. \"Sensu Core\":"
  project = raw_input()
  main(folder, project)

