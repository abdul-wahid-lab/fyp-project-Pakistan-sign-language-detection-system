import helper.helperFunc as helper
import helper.scale as scale
import helper.db_helper as dbh
import helper.normalize as norm
import helper.plot_body as plot_body

import cv2
import math
import os
import subprocess
import json
from matplotlib import pyplot as plt
import time
from datetime import datetime

import errno, stat, shutil
from distutils.dir_util import copy_tree
import sys, signal


def signal_handler(signal, frame):
    shutil.rmtree("Keypoints", ignore_errors=True, onerror=handleRemoveReadonly)
    print( 'All done')
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)

def handleRemoveReadonly(func, path, exc):
  excvalue = exc[1]
  if func in (os.rmdir, os.remove) and excvalue.errno == errno.EACCES:
      os.chmod(path, stat.S_IRWXU| stat.S_IRWXG| stat.S_IRWXO)
      func(path)
  else:
      raise Exception


shutil.rmtree("Keypoints_temp", ignore_errors=True, onerror=handleRemoveReadonly)

sec = int(input('Enter Seconds OpenPose should run for : '))
os.chdir('..\\bin\\openpose')
print('Starting OpenPose')
output = subprocess.Popen('bin\\OpenPoseDemo.exe --hand  --write_json ..\\..\\PSL\\Keypoints_temp  --net_resolution 128x128  --number_people_max 1', shell=True)
os.chdir('..\\..\\PSL')


dirName = 'Keypoints_temp'
init_file = '000000000000_keypoints.json'

try:
    os.mkdir(dirName)
    shutil.copy(init_file, dirName)
    print("Directory " , dirName ,  " Created ")
except FileExistsError:
    print("Directory " , dirName ,  " already exists")

time.sleep(5)
time.sleep(sec)
os.system("taskkill /f /im  OpenPoseDemo.exe")


conf_thershold = 10
fileNames = []
for entry in os.scandir('Keypoints_temp'):
    if entry.is_file():
        if os.path.splitext(entry)[1] == ".json":
            fileNames.append(entry.name)

for x in range(len(fileNames)):
    js = json.loads(open('Keypoints_temp\\' + fileNames[x]).read())
    for items in js['people']:
        handRight = items["hand_right_keypoints_2d"]
        handLeft = items["hand_left_keypoints_2d"]

    RightConfPoints = helper.confidencePoints(handRight)
    LeftConfPoints = helper.confidencePoints(handLeft)
    RightConfidence = helper.confidence(RightConfPoints)
    LeftConfidence = helper.confidence(LeftConfPoints)
    if RightConfidence < 10:
        os.remove('Keypoints_temp\\' + fileNames[x])

    elif LeftConfidence < conf_thershold and LeftConfidence > 2 :
        os.remove('Keypoints_temp\\' + fileNames[x])


POSE_PAIRS = [ [0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[0,9],[9,10],[10,11],[11,12],[0,13],[13,14],[14,15],[15,16],[0,17],[17,18],[18,19],[19,20] ]
background = 'big_background.png'
fileNames = []
for entry in os.scandir('Keypoints_temp'):
    if entry.is_file():
        if os.path.splitext(entry)[1] == ".json":
            fileNames.append(entry.name)

frame = cv2.imread(background)
for x in range(len(fileNames)):
    js = json.loads(open('Keypoints_temp\\' + fileNames[x]).read())
    for items in js['people']:
        pose = items["pose_keypoints_2d"]
        handRight = items["hand_right_keypoints_2d"]
        handLeft = items["hand_left_keypoints_2d"]

    pose_points = helper.removePoints(pose)
    p1 = [pose_points[0], pose_points[1]]
    p2 = [pose_points[2], pose_points[3]]
    distance = math.sqrt( ((p1[0]-p2[0])**2)+((p1[1]-p2[1])**2) )
    scaled_results,scaled_points = norm.scaleBody(pose_points,distance)
    poseResults,posePoints = norm.moveBody(scaled_results)

    hand_right_points = helper.removePoints(handRight)
    p1 = [hand_right_points[0], hand_right_points[1]]
    p2 = [hand_right_points[18], hand_right_points[19]]
    distance = math.sqrt( ((p1[0]-p2[0])**2)+((p1[1]-p2[1])**2) )
    RightResult,Points = scale.scalePoints(hand_right_points,distance)
    handRightResults,handRightPoints = norm.move_to_wrist(RightResult,poseResults[8],poseResults[9])

    if LeftConfidence > 3:
        hand_left_points = helper.removePoints(handLeft)
        p1 = [hand_left_points[0], hand_left_points[1]]
        p2 = [hand_left_points[18], hand_left_points[19]]
        distance = math.sqrt( ((p1[0]-p2[0])**2)+((p1[1]-p2[1])**2) )
        if distance != 0:
            LeftResult,Points = scale.scalePoints(hand_left_points,distance)
            handLeftResults,handLeftPoints = norm.move_to_wrist(LeftResult,poseResults[14],poseResults[15])
        else:
            handLeftResults,handLeftPoints = norm.move_to_wrist(hand_left_points,poseResults[14],poseResults[15])

    else:
        handLeftPoints = [(0, 0),(0, 0),(0, 0),(0, 0),(0, 0),(0, 0),(0, 0),(0, 0),(0, 0),(0, 0),(0, 0),(0, 0),(0, 0),(0, 0),(0, 0),(0, 0),(0, 0),(0, 0),(0, 0),(0, 0),(0, 0)]
        handLeftResults = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,]

    frame = plot_body.plotPose(posePoints,handRightPoints,handLeftPoints)

    fig2 = plt.figure(figsize = (15,15))
    ax3 = fig2.add_subplot(111)
    ax3.imshow(frame, interpolation='none')

    plt.imshow(frame)
    plt.show()

    choice = input('do you want to keep it? Y/N: ')
    if choice == 'N' or choice == 'n':
        os.remove('Keypoints_temp\\' + fileNames[x])
        print("File Removed")

label = input('Enter label for these files: ')
label = label.strip()

choice = input('do you want to put label = '+label+' ? Y/N: ')
if choice == 'N' or choice == 'n':
    label = input('Enter label for these files: ')
    label = label.strip()
elif choice == 'Y' or choice == 'y':
    for entry in os.scandir('..\\data\\datasets\\words_dataset'):
        if entry.name == label:
            now = datetime.now()

            timestamp =  str(datetime.timestamp(now))
            dir_name = "..\\data\\datasets\\words_dataset\\" + entry.name +"\\"+ timestamp
            try:
                os.mkdir(dir_name)
                print("Directory " , dir_name ,  " Created ")
            except FileExistsError:
                print("Directory " , dir_name ,  " already exists")

            copy_tree("Keypoints_temp", "..\\data\\datasets\\words_dataset\\" + entry.name + "\\" + timestamp )

    dbh.create_pose_table()
    dbh.populate_words()


shutil.rmtree("Keypoints_temp", ignore_errors=True, onerror=handleRemoveReadonly)
print( 'Keypoints_temp folder removed')
