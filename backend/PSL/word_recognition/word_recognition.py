# -*- coding: utf-8 -*-
"""
Created on Wed Jul 10 16:22:06 2019

"""

import PSL.helper.helperFunc as helper
import PSL.helper.scale as scale
import PSL.helper.normalize as norm

import json
import math
import pickle
import numpy as np

from tensorflow.keras.models import load_model


model = load_model("data\\models\\word_model.h5")
scaler = pickle.load(open("data\\models\\word_scaler.pkl", "rb"))
le     = pickle.load(open("data\\models\\word_label_encoder.pkl", "rb"))
print("word model loaded")

def match_ann(fileName):
    js = json.loads(open(fileName).read())
    for items in js['people']:
        pose = items["pose_keypoints_2d"]
        handRight = items["hand_right_keypoints_2d"]
        handLeft = items["hand_left_keypoints_2d"]

    RightConfPoints = helper.confidencePoints(handRight)
    LeftConfPoints = helper.confidencePoints(handLeft)

    # add all confidence points
    RightConfidence = helper.confidence(RightConfPoints)
    LeftConfidence = helper.confidence(LeftConfPoints)
 
    # remove file if confidence is less than threshold
    if RightConfidence > 12:
        if LeftConfidence > 12 or LeftConfidence < 2:
         
            # normalizing bodyKeyPoints
            pose_points = helper.removePoints(pose)
            p1 = [pose_points[0], pose_points[1]]
            p2 = [pose_points[2], pose_points[3]]
            distance = math.sqrt(((p1[0]-p2[0])**2)+((p1[1]-p2[1])**2))
            scaled_results, scaled_points = norm.scaleBody(pose_points, distance)
            poseResults, posePoints = norm.moveBody(scaled_results)

            # normalizing RightHandKeyPoints
            hand_right_points = helper.removePoints(handRight)
            p1 = [hand_right_points[0], hand_right_points[1]]
            p2 = [hand_right_points[18], hand_right_points[19]]
            distance = math.sqrt(((p1[0]-p2[0])**2)+((p1[1]-p2[1])**2))
            if distance == 0:
                return "no confidence"
            RightResult, Points = scale.scalePoints(hand_right_points, distance)
            handRightResults, handRightPoints = norm.move_to_wrist(RightResult, poseResults[8], poseResults[9])

            # normalizing LeftHandKeyPoints
            if LeftConfidence > 3:
                hand_left_points = helper.removePoints(handLeft)
                p1 = [hand_left_points[0], hand_left_points[1]]
                p2 = [hand_left_points[18], hand_left_points[19]]
                distance = math.sqrt(((p1[0]-p2[0])**2)+((p1[1]-p2[1])**2))
                if distance != 0:
                    LeftResult, Points = scale.scalePoints(hand_left_points, distance)
                    handLeftResults, handLeftPoints = norm.move_to_wrist(LeftResult, poseResults[14], poseResults[15])
                else:
                    handLeftResults, handLeftPoints = norm.move_to_wrist(hand_left_points, poseResults[14], poseResults[15])

            else:
                handLeftResults = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]

            # combining points
            posePoints = []
            for x in range(18):
                posePoints.append(poseResults[x])
            for x in range(30, 38):
                posePoints.append(poseResults[x])

            results = handRightResults + handLeftResults + posePoints

            y_pred = model.predict(scaler.transform(np.array([results])), verbose=0)

            C = np.argmax(y_pred)

            result = le.inverse_transform([C])

            return result[0]
        else:
            return "no confidence"
    else:
        return "no confidence"
