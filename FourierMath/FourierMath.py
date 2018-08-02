import math
import cmath
import re


def bezier(t,a,b,c,d):
    return (-a+3*b-3*c+d)*t*t*t+3*(a-2*b+c)*t*t+3*(-a+b)*t+a

def linear(x,a,b,c,d):
    return (x-a)/(b-a)*(d-c)+c

def equation(bt,t,m,bV):
    return bezier(bt,bV[0],bV[1],bV[2],bV[3])*cmath.exp(-m*1j*t)
oneOver2PI = 1/(math.pi*2)



def prSolve(m,cs,ce,n):
    if m == 0 :
        return (ce-cs)*oneOver2PI/(n+1)
    if n==0 :
        return 1j*oneOver2PI/m*(cmath.exp(-m*1j*ce)-cmath.exp(-m*1j*cs))
    elif n>0 :
        return 1j*oneOver2PI/m*cmath.exp(-m*1j*ce)-n*1j/((ce-cs)*m)*prSolve(m,cs,ce,n-1)
    else : 
        return 0
def numSolve(m,cs,ce,pts):
    return (-pts[0]+3*pts[1]-3*pts[2]+pts[3])*prSolve(m,cs,ce,3)+3*(pts[0]-2*pts[1]+pts[2])*prSolve(m,cs,ce,2)+3*(-pts[0]+pts[1])*prSolve(m,cs,ce,1)+pts[0]*prSolve(m,cs,ce,0)



steps = 500
points = []
out = []
center = [500,500]
curWeight = []

def cpToList(cp):
    return [cp.real,cp.imag]

def detectUpper(str):
    flags = []

    return flags

trDatas = []
with open('rawvertexes.txt', 'r') as f:
    rawdata = f.readlines()
    curve = re.sub(r'\s','',"".join(rawdata))
    cells = re.findall(r'\w[\d\,\-\.]+',curve)
    for cell in cells:
        trcdata = []
        formatString = re.sub(r'-',',-',cell)
        trcdata.append(re.match(r'[A-Za-z]',formatString).group(0))
        rawvers = re.sub(r'[A-Za-z]\,?','',formatString).split(',')
        for st in range(len(rawvers)):
            rawvers[st] = float(rawvers[st])
        vergroup = []
        vercurgrp = []
        for st in range(len(rawvers)):
            vercurgrp.append(rawvers[st])
            if len(vercurgrp)>=2:
                vergroup.append(vercurgrp[0]+vercurgrp[1]*1j)
                vercurgrp.clear()
        if len(vercurgrp)>0:
            if re.match(r'v',trcdata[0],re.I):
                vergroup.append(0+vercurgrp[0]*1j)
            elif re.match(r'h',trcdata[0],re.I):
                vergroup.append(vercurgrp[0]+0j)
        trcdata.append(vergroup)
        trDatas.append(trcdata)
    print('Vertexes data have been read.')

for i in range(1,len(trDatas)):
    if re.match(r'[a-z]',trDatas[i][0]):
        for j in range(len(trDatas[i][1])):
            trDatas[i][1][j]+=trDatas[i-1][1][-1]
for i in range(len(trDatas)):
    flag = trDatas[i][0]
    if re.match(r'm',flag,re.I):continue
    trDatas[i][1].insert(0,trDatas[i-1][1][-1])
    if re.match(r's',flag,re.I):
        trDatas[i][1].insert(1,2*trDatas[i-1][1][-1]-trDatas[i-1][1][-2])
    if re.match(r'[lvh]',flag,re.I):
        trDatas[i][1].insert(1,trDatas[i][1][0]/3+trDatas[i][1][-1]*2/3)
        trDatas[i][1].insert(1,trDatas[i][1][0]*2/3+trDatas[i][1][-1]/3)

for i in range(len(trDatas)):
    flag = trDatas[i][0]
    if re.match(r'm',flag,re.I):continue
    points.append(trDatas[i][1])
for i in range(len(points)):
    for j in range(len(points[i])):
        points[i][j] -= center[0]+1j*center[1]

print("Weight process start.")
wsum = 0
for curve in points:#Calculate weight
    wst = 10 #steps
    sum = 0
    for i in range(1,wst):
        sum+=abs(bezier(linear(i,0,wst,0,1),curve[0],curve[1],curve[2],curve[3])-
        bezier(linear(i-1,0,wst,0,1),curve[0],curve[1],curve[2],curve[3]))
    curWeight.append(sum)
    wsum+=sum
for i in range(len(curWeight)):
    curWeight[i] /= wsum
for i in range(1,len(curWeight)):
    curWeight[i] += curWeight[i-1]
curWeight.insert(0,0)
curWeight[-1] = 1
print("Weight process finished.")
#print(curWeight)
print("Main calculation start.")
for s in range(0,steps):
    m = 0
    if s>0: 
        m = ((s+1)//2)*(-1 if (s%2 == 0) else 1)
    print("Now working on orbit {0},m = {1}".format(s,m))
    sum = 0+0j
    for i in range(len(points)):
        #print("Processing bezier id : {0} ".format(i))
        cs = linear(curWeight[i],0,1,0,math.pi*2)
        ce = linear(curWeight[i+1],0,1,0,math.pi*2)
        #sum += calCompute(cs,ce,m,points[i])
        sum += numSolve(m,cs,ce,points[i])
    clst = cpToList(sum)
    #print("Result : {0}".format(clst))
    out.append(clst)
print("Main calculation finished.")

File = open("datas.txt", "w")
for dc in out:
    File.write("{0}".format(dc))
    File.write("\n")
File.close()

print("Data saved.\n\nWork finished.\n")
