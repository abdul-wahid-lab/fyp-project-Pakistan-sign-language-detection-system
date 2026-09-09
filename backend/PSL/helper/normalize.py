def move_to_wrist(handRight,wristX,wristY):
    refX = wristX
    refY= wristY

    handRightResults = []
    handRightPoints = []
    handRightX = []
    handRightY = []

    for x in range(0,len(handRight),2):
        handRightX.append(handRight[x])
    for x in range(1,len(handRight),2):
        handRightY.append(handRight[x])

    p1 = [handRightX[0], handRightY[0]]
    p2 = [refX, refY]
    distanceX = p1[0]-p2[0]
    distanceY = p1[1]-p2[1]

    for x in range(len(handRightX)):
        handRightX[x] -= distanceX

    for x in range(len(handRightY)):
        handRightY[x] -= distanceY

    for x in range(len(handRightX)):
        handRightPoints.append((int(handRightX[x]) , int(handRightY[x])))
        handRightResults.append(handRightX[x])
        handRightResults.append(handRightY[x])

    return handRightResults,handRightPoints



def scaleBody(handRight,distance):

    ref = 200

    handRightResults = []
    handRightPoints = []
    handRightX = []
    handRightY = []

    for x in range(0,len(handRight),2):
        handRightX.append(handRight[x])
    for x in range(1,len(handRight),2):
        handRightY.append(handRight[x])

    scale = ref/distance

    for x in range(len(handRightX)):
        handRightX[x] *=scale

    for x in range(len(handRightY)):
        handRightY[x] *=scale

    for x in range(len(handRightX)):
            handRightPoints.append((int(handRightX[x]) , int(handRightY[x])))
            handRightResults.append(handRightX[x])
            handRightResults.append(handRightY[x])

    return handRightResults,handRightPoints

def moveBody(handRight):

    refX = 1000
    refY=400

    handRightResults = []
    handRightPoints = []
    handRightX = []
    handRightY = []

    for x in range(0,len(handRight),2):
        handRightX.append(handRight[x])
    for x in range(1,len(handRight),2):
        handRightY.append(handRight[x])

    p1 = [handRightX[1], handRightY[1]]
    p2 = [refX, refY]
    distanceX = p1[0]-p2[0]
    distanceY = p1[1]-p2[1]

    for x in range(len(handRightX)):
        if handRightX[x] != 0:
            handRightX[x] -= distanceX

    for x in range(len(handRightY)):
        if handRightY[x] != 0:
            handRightY[x] -= distanceY

    for x in range(len(handRightX)):
        handRightPoints.append((int(handRightX[x]) , int(handRightY[x])))
        handRightResults.append(handRightX[x])
        handRightResults.append(handRightY[x])

    return handRightResults,handRightPoints

def dummyMoveBody(handRight):

    refX = 400
    refY=200

    handRightResults = []
    handRightPoints = []
    handRightX = []
    handRightY = []

    for x in range(0,len(handRight),2):
        handRightX.append(handRight[x])
    for x in range(1,len(handRight),2):
        handRightY.append(handRight[x])

    p1 = [handRightX[1], handRightY[1]]
    p2 = [refX, refY]
    distanceX = p1[0]-p2[0]
    distanceY = p1[1]-p2[1]

    for x in range(len(handRightX)):
        if handRightX[x] != 0:
            handRightX[x] -= distanceX

    for x in range(len(handRightY)):
        if handRightY[x] != 0:
            handRightY[x] -= distanceY

    for x in range(len(handRightX)):
        handRightPoints.append((int(handRightX[x]) , int(handRightY[x])))
        handRightResults.append(handRightX[x])
        handRightResults.append(handRightY[x])

    return handRightResults,handRightPoints


def dummyScaleBody(handRight,distance):

    ref = 500

    handRightResults = []
    handRightPoints = []
    handRightX = []
    handRightY = []

    for x in range(0,len(handRight),2):
        handRightX.append(handRight[x])
    for x in range(1,len(handRight),2):
        handRightY.append(handRight[x])

    scale = ref/distance

    for x in range(len(handRightX)):
        handRightX[x] *=scale

    for x in range(len(handRightY)):
        handRightY[x] *=scale


    for x in range(len(handRightY)):
        handRightX[x] *=2
        handRightY[x] *=2

    for x in range(len(handRightX)):
            handRightPoints.append((int(handRightX[x]) , int(handRightY[x])))
            handRightResults.append(handRightX[x])
            handRightResults.append(handRightY[x])

    return handRightResults,handRightPoints
