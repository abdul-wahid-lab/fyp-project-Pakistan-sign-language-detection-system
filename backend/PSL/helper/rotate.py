from math import sin, cos, radians
import math
import json
import PSL.helper.helperFunc as helper

POSE_PAIRS = [ [0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[0,9],[9,10],[10,11],[11,12],[0,13],[13,14],[14,15],[15,16],[0,17],[17,18],[18,19],[19,20] ]
background = 'big_background.png'

def rotate(point, angle, center_point=(0, 0)):
    angle_rad = radians(angle % 360)
    new_point = (point[0] - center_point[0], point[1] - center_point[1])
    new_point = (new_point[0] * cos(angle_rad) - new_point[1] * sin(angle_rad),
                 new_point[0] * sin(angle_rad) + new_point[1] * cos(angle_rad))
    new_point = (int(new_point[0] + center_point[0]), int(new_point[1] + center_point[1]))
    return new_point


def rotate_file(fileName):
    js = json.loads(open(fileName).read())
    for items in js['people']:
        handRight = items["hand_right_keypoints_2d"]

    handPoints = helper.removePoints(handRight)

    p1 = [handPoints[0], handPoints[1]]
    p2 = [handPoints[18], handPoints[19]]
    distance = math.sqrt( ((p1[0]-p2[0])**2)+((p1[1]-p2[1])**2) )

    Result,Points = scale.scalePoints(handPoints,distance)

    handRightResults,handRightPoints = move.centerPoints(Result)

    newPoints = [handRightPoints[0]]
    for x in range(1,len(handRightPoints)):
        newPoints.append( rotate(handRightPoints[x],-60,handRightPoints[0]) )

    newPoints = helper.seperate_points(newPoints)
    return newPoints

def rotate_points(points,angle):
    coordPoints = helper.join_points(points)
    newPoints = [coordPoints[0]]
    for x in range(1,len(coordPoints)):
        newPoints.append( rotate(coordPoints[x],angle,coordPoints[0]) )

    return newPoints


def rotate_line(origin, point, angle):
    ox, oy = origin
    px, py = point

    qx = ox + math.cos(angle) * (px - ox) - math.sin(angle) * (py - oy)
    qy = oy + math.sin(angle) * (px - ox) + math.cos(angle) * (py - oy)
    return qx, qy
