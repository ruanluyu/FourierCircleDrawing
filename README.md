# FourierCircleDrawing
网页端预览程序：http://fcd.milai.tech/    
网页端程序：将滑竿拖到最下面，点击run，待计算完后，点击play
> 注意：网页端不支持自定义路径，如果你想绘制自己的图形，需要参照下面的步骤



## 1.工程加载到本地（Windows）：

1. 科学上网 （不会科学上网的同学直接戳这里：链接：https://pan.baidu.com/s/13vXObnFeqmr1pXzR1eykHg 密码：y5ai）

1. [下载安装git bash](https://gitforwindows.org/) 

1. 打开控制台，随便进入一个文件夹执行下面的指令
```cmd
git clone https://github.com/ruanluyu/FourierCircleDrawing.git
```

## 2.接下来你需要保证电脑安装了如下软件：

计算工程的运行软件：[Visual studio Community 的 Python3](https://visualstudio.microsoft.com/zh-hans/vs/)

绘图工程的运行软件：[Processing](https://processing.org/download/)

路径绘制和输出工具：[Adobe Illustrator](https://www.adobe.com/products/illustrator.html)

## 3.最后，按照下面的视频操作即可

[使用教程](https://www.bilibili.com/video/av28374720?t=2m17s)

## 其它注意事项

- python源码里面的steps是控制圆圈的数量的变量。可以调节这个变量来控制最终轨道的数量  
```python3
end = 1000 # 圆圈数量
center = [500,500] # 中心点位置，例如这里的[500,500]会让1000x1000的矢量图在坐标轴中居中显示。
```
> 根目录下的“Report.pdf”是计算思路概述,也可以通过进入[我们的论坛](https://pw.yuelili.com/study/cg/proof-1000-circle-miku.html)来查看。

- 本工程的计算思路和程序设计均由中梓星音独立完成。请注意我们的工程支持贝塞尔曲线的解析计算（非近似解），与各大主流媒体公开的傅立叶级数计算的技术（多项式近似）不同。最近由于3B1B公开了科普视频导致本工程备受关注，但请注意：因为FCD工程是早在3B1B对傅立叶级数的科普视频发布之前创立并开发的，所以有可能这个工程与3B1B的视频介绍的计算思路大相径庭，在骇入程序的时候还请注意。
- 本工程使用MIT证书公开，允许未经许可的商业使用和个人修改使用，但不保证工程的稳健性。

点击图片查看效果视频  
[![Watch the video](https://raw.githubusercontent.com/ruanluyu/FourierCircleDrawing/master/Resource/miku.jpg)](https://www.bilibili.com/video/av28374720)
