import PSL.helper.db_helper as dbh
import PSL.helper.helperFunc as helper
import PSL.helper.move as move
import PSL.helper.scale as scale
import PSL.helper.plot as plot
import PSL.retrain as retrain
import PSL.helper.mediapipe_helper as mediapipe_helper

import cv2
import math
import os
import json
from matplotlib import pyplot as plt
import time
from datetime import datetime

import errno, stat, shutil
from distutils.dir_util import copy_tree
import sys, signal

import eel


def signal_handler(signal, frame):
    mediapipe_helper.stop_capture()
    shutil.rmtree("Keypoints", ignore_errors=True, onerror=handleRemoveReadonly)
    shutil.rmtree("gui\\captured_images", ignore_errors=True, onerror=handleRemoveReadonly)
    shutil.rmtree("gui\\temp_images", ignore_errors=True, onerror=handleRemoveReadonly)
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



def plotPose(posePoints, handRightPoints, handLeftPoints):
    POSE_PAIRS = [[1, 0], [1, 2], [1, 5], [2, 3], [3, 4], [5, 6], [6, 7],
                  [1, 8], [0, 15], [15, 17], [0, 16], [16, 18]]

    HAND_PAIRS = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [0, 9], [9, 10],
                  [10, 11], [11, 12], [0, 13], [13, 14], [14, 15], [15, 16], [0, 17], [17, 18],
                  [18, 19], [19, 20]]

    colors = [[0, 0, 130], [0, 0, 175], [0, 0, 210], [0, 0, 250],
              [0, 200, 160], [0, 180, 150], [0, 230, 186], [0, 255, 255],
              [82, 201, 8], [82, 204, 0], [92, 230, 0], [102, 252, 6],
              [197, 88, 17], [204, 82, 0], [179, 71, 0], [227, 94, 5],
              [204, 0, 163], [200, 0, 163], [196, 0, 163], [230, 0, 184]]

    background = "PSL\\BLACK_background.jpg"

    frame = cv2.imread(background)

    count = 0
    for pair in POSE_PAIRS:
        partA = pair[0]
        partB = pair[1]

        if posePoints[partA] and posePoints[partB] and posePoints[partA][0] != 0 and posePoints[partA][1] != 0 and \
                posePoints[partB][0] != 0 and posePoints[partB][1] != 0:
            cv2.line(frame, posePoints[partA], posePoints[partB], colors[count], 10)
            cv2.circle(frame, posePoints[partA], 5, (0, 0, 255), thickness=10, lineType=cv2.FILLED)
            cv2.circle(frame, posePoints[partB], 5, (255, 255, 255), thickness=15, lineType=cv2.FILLED)
        count += 1

    count = 0
    for pair in HAND_PAIRS:
        partA = pair[0]
        partB = pair[1]

        if handRightPoints[partA] and handRightPoints[partB]:
            cv2.line(frame, handRightPoints[partA], handRightPoints[partB], colors[count], 10)
            cv2.circle(frame, handRightPoints[partA], 5, (0, 0, 255), thickness=3, lineType=cv2.FILLED)
            cv2.circle(frame, handRightPoints[partB], 5, (255, 255, 255), thickness=4, lineType=cv2.FILLED)
        count += 1

    count = 0
    for pair in HAND_PAIRS:
        partA = pair[0]
        partB = pair[1]

        if handLeftPoints[partA] and handLeftPoints[partB]:
            cv2.line(frame, handLeftPoints[partA], handLeftPoints[partB], colors[count], 10)
            cv2.circle(frame, handLeftPoints[partA], 5, (0, 0, 255), thickness=3, lineType=cv2.FILLED)
            cv2.circle(frame, handLeftPoints[partB], 5, (255, 255, 255), thickness=4, lineType=cv2.FILLED)
        count += 1

    return frame


remfileNames = []
capture_mode = 0

@eel.expose
def capture_alphabet_dataset(sec):

    global remfileNames, capture_mode
    capture_mode = 0

    dirName = 'Keypoints'
    init_file = 'PSL\\000000000000_keypoints.json'

    try:
        os.mkdir(dirName)
        os.mkdir("gui\\captured_images")
        os.mkdir("gui\\temp_images")
        shutil.copy(init_file, dirName)
        print("Directory " , dirName ,  " Created ")
    except FileExistsError:
        print("Directory " , dirName ,  " already exists")

    mediapipe_helper.start_capture(output_dir=dirName)

    t = time.time() + sec
    while time.time() <= t:
        eel.sleep(0.05)

    mediapipe_helper.stop_capture()

    conf_thershold = 10
    fileNames = []
    for entry in os.scandir('Keypoints'):
        if entry.is_file():
            if os.path.splitext(entry)[1] == ".json":
                fileNames.append(entry.name)

    for x in range(len(fileNames)):
        js = json.loads(open('Keypoints\\' + fileNames[x]).read())
        for items in js['people']:
            handRight = items["hand_right_keypoints_2d"]

        confPoints = helper.confidencePoints(handRight)
        confidence = helper.confidence(confPoints)
        print(confidence)
        if confidence < conf_thershold:
            os.remove('Keypoints\\' + fileNames[x])

    background = 'big_background.png'
    fileNames = []
    for entry in os.scandir('Keypoints'):
        if entry.is_file():
            if os.path.splitext(entry)[1] == ".json":
                fileNames.append(entry.name)

    frame = cv2.imread(background)

    i=1;

    for x in range(len(fileNames)):
        js = json.loads(open('Keypoints\\' + fileNames[x]).read())
        for items in js['people']:
            handRight = items["hand_right_keypoints_2d"]

        handPoints = helper.removePoints(handRight)

        p1 = [handPoints[0], handPoints[1]]
        p2 = [handPoints[18], handPoints[19]]
        distance = math.sqrt( ((p1[0]-p2[0])**2)+((p1[1]-p2[1])**2) )

        Result,Points = scale.dummy_scalePoints(handPoints,distance)

        handRightResults,handRightPoints = move.dummy_centerPoints(Result)

        frame = plot.plot_dataset(handRightPoints,'black')

        cv2.imwrite('gui\\captured_images\\' + str(i) + '.jpg', frame)
        i+=1

        for entry in os.scandir('Keypoints'):
            if entry.is_file():
                if os.path.splitext(entry)[1] == ".json":
                    remfileNames.append(entry.name)


@eel.expose
def getFileCount():
    Names = []
    if not os.path.exists('gui\\captured_images'):
        return '0'
    for entry in os.scandir('gui\\captured_images'):
        Names.append(entry.name)
    return str(len(Names))


@eel.expose
def delete_Image(i):
    global remfileNames

    print(remfileNames)

    try:
        os.remove('Keypoints\\' + remfileNames[i-1])
        os.remove('gui\\captured_images\\'+ str(i) + '.jpg')
    except:
        print("file not found")
        pass


@eel.expose
def capture_word_dataset(sec):

    global remfileNames, capture_mode
    capture_mode = 1

    dirName = 'Keypoints'
    init_file = 'PSL\\000000000000_keypoints.json'

    try:
        os.mkdir(dirName)
        os.mkdir("gui\\captured_images")
        os.mkdir("gui\\temp_images")
        shutil.copy(init_file, dirName)
        print("Directory", dirName, "Created")
    except FileExistsError:
        print("Directory", dirName, "already exists")

    mediapipe_helper.start_capture(output_dir=dirName)

    t = time.time() + sec
    while time.time() <= t:
        eel.sleep(0.05)

    mediapipe_helper.stop_capture()

    conf_thershold = 10
    fileNames = []
    for entry in os.scandir('Keypoints'):
        if entry.is_file():
            if os.path.splitext(entry)[1] == ".json":
                fileNames.append(entry.name)

    for x in range(len(fileNames)):
        js = json.loads(open('Keypoints\\' + fileNames[x]).read())
        for items in js['people']:
            handRight = items["hand_right_keypoints_2d"]
        confPoints = helper.confidencePoints(handRight)
        confidence = helper.confidence(confPoints)
        print(confidence)
        if confidence < conf_thershold:
            os.remove('Keypoints\\' + fileNames[x])

    background = 'big_background.png'
    fileNames = []
    for entry in os.scandir('Keypoints'):
        if entry.is_file():
            if os.path.splitext(entry)[1] == ".json":
                fileNames.append(entry.name)

    frame = cv2.imread(background)
    i = 1

    for x in range(len(fileNames)):
        js = json.loads(open('Keypoints\\' + fileNames[x]).read())
        for items in js['people']:
            pose = items["pose_keypoints_2d"]
            handRight = items["hand_right_keypoints_2d"]
            handLeft = items["hand_left_keypoints_2d"]

        pose_points = helper.removePoints(pose)
        posePoints = helper.join_points(pose_points)

        hand_right_points = helper.removePoints(handRight)
        handRightPoints = helper.join_points(hand_right_points)

        hand_left_points = helper.removePoints(handLeft)
        handLeftPoints = helper.join_points(hand_left_points)

        frame = plotPose(posePoints, handRightPoints, handLeftPoints)
        cv2.imwrite('gui\\captured_images\\' + str(i) + '.jpg', frame)
        i += 1

        for entry in os.scandir('Keypoints'):
            if entry.is_file():
                if os.path.splitext(entry)[1] == ".json":
                    remfileNames.append(entry.name)


@eel.expose
def getlabel(a):

    global capture_mode
    label = a.strip()
    print(label)

    if capture_mode == 0:
        dataset_path = 'data\\datasets\\alphabets_dataset'
    else:
        dataset_path = 'data\\datasets\\words_dataset'

    for entry in os.scandir(dataset_path):
        if entry.name == label:
            now = datetime.now()
            timestamp = str(datetime.timestamp(now))
            dir_name = dataset_path + "\\" + entry.name + "\\" + timestamp
            try:
                os.mkdir(dir_name)
                print("Directory", dir_name, "Created")
            except FileExistsError:
                print("Directory", dir_name, "already exists")
            copy_tree("Keypoints", dataset_path + "\\" + entry.name + "\\" + timestamp)

    try:
        shutil.rmtree("Keypoints", ignore_errors=True, onerror=handleRemoveReadonly)
        shutil.rmtree("gui\\captured_images", ignore_errors=True, onerror=handleRemoveReadonly)
        shutil.rmtree("gui\\temp_images", ignore_errors=True, onerror=handleRemoveReadonly)
        print('Keypoints_temp folder removed')
    except:
        print("not removed")
        pass


@eel.expose
def db_train():
    retrain.re_train(0)


@eel.expose
def db_word_train():
    retrain.re_train(1)
