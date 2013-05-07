import sys
import os
import shutil
from datetime import datetime

def main():
    
    rootDir = "../obj/orig"
    backupDir = "scriptBackup"
    findStr = "XNATImageViewerGlobals"
    replaceStr = "Globals"

    
    for root, dirs, files in os.walk(rootDir):
       for f in files:
           
           
           src = os.path.join(root, f)
           # read the file line by line, store it.
           lines = [line for line in open(src)]
           newLines = []
           
           i = 0
           for l in lines:
               l = l.strip()
               appendStr = l
               if (l.startswith("v ") or l.startswith("vn ")):
                   strNums = l.split(" ")
                   for s in strNums:
                       if len(s) == 0:
                           strNums.remove(s)
                  
                   nums = [float(n) for n in strNums[1:]]
                   nums[0]*=-1
                   nums[2]*=-1
                   appendStr = ("%s %s %s %s"%(strNums[0], nums[0], nums[1], nums[2]))
                   i+=1
               newLines.append(appendStr)
               #print l
           #print newLines
           
           fl = open(f.split(".")[0] + "_xy_flip2" + ".obj", 'w')
           for item in newLines:
               fl.write("%s\n" % item)
           fl.close()

    


if __name__ == "__main__":
    main()