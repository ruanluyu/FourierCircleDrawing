# FourierCircleDrawing
网页端预览程序：http://fcd.milai.tech/    
网页端程序：将滑竿拖到最下面，点击run，待计算完后，点击play

工程加载到本地（Windows）：

1. 科学上网 （不会科学上网的同学直接戳这里：链接：https://pan.baidu.com/s/13vXObnFeqmr1pXzR1eykHg 密码：y5ai）

1. [下载安装git bash](https://gitforwindows.org/) 

1. 打开控制台，随便进入一个文件夹执行下面的指令
```cmd
git clone https://github.com/ruanluyu/FourierCircleDrawing.git
```

计算工程的运行软件：[Visual studio Community 的 Python3](https://visualstudio.microsoft.com/zh-hans/vs/)

绘图工程的运行软件：[Processing](https://processing.org/download/)

[使用教程](https://www.bilibili.com/video/av28374720?t=2m17s)

python源码里面的steps是控制圆圈的数量的变量。可以调节这个变量来控制最终轨道的数量  
```python3
end = 1000 # 圆圈数量
center = [500,500] # 中心点位置，例如这里的[500,500]会让1000x1000的矢量图在坐标轴中居中显示。
```
> 根目录下的“Report.pdf”是计算思路概述,也可以通过进入[我们的论坛](https://world.milai.tech/study/cg/proof-1000-circle-miku.html)来查看。

点击图片查看效果视频  
[![Watch the video](https://raw.githubusercontent.com/ruanluyu/FourierCircleDrawing/master/Resource/miku.jpg)](https://www.bilibili.com/video/av28374720)
