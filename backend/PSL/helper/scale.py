

def scalePoints(handRight,distance):

    ref = 50

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


def dummy_scalePoints(handRight,distance):

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


    for x in range(len(handRightY)):
        handRightX[x] *=2
        handRightY[x] *=2

    for x in range(len(handRightX)):
            handRightPoints.append((int(handRightX[x]) , int(handRightY[x])))
            handRightResults.append(handRightX[x])
            handRightResults.append(handRightY[x])

    return handRightResults,handRightPoints
