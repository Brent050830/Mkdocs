## 环境搭建
### 虚拟机
- 文件——新建新的虚拟机
- 自定义——下一步

> 地址为 `D:\17871\UbuntuISO\ubuntu-24.04.4-desktop-amd64.iso`

然后一直下一步就行，创建新的磁盘，大小选择 wield 40 G，然后一直到完成：  
![](png/Pasted%20image%2020260823170031.png)  
这样就进入我们的系统了

### 修改源
我们选择软件和更新，选择其他中的阿里云服务器，然后重新载入

### 安装必备的软件
有着如下的命令行：  
![](png/Pasted%20image%2020260823171019.png)  
点击我们的终端：`sudo apt update`：进行软件的更新，然后 `reboot` 以下进行更新

安装 Openssh  
之后验证状态：`sudo service ssh status`  
![](png/Pasted%20image%2020260823174614.png)

按 q 可以继续  
之后服务就开启了，但是需要做开机启动的服务 `sudo systemctl enable ssh`

### ROS 2 的环境搭建
![](png/Pasted%20image%2020260823174751.png)

之后安装必备仓库：  
![](png/Pasted%20image%2020260823174840.png)

### ROS 必备环境
![](png/Pasted%20image%2020260823180003.png)

之后进行安装的验证：  
`ros2 run turtlesim turtlesim_node`  
![](png/Pasted%20image%2020260823211732.png)  
这个界面，安装成功

## 开发入门
### 基础概念
![](png/Pasted%20image%2020260823211906.png)

开发流程：

1. 创建工作空间
2. 在工作空间中创建包
3. 在包中创建节点
4. 为节点提供通讯能力
5. 为节点提供业务能力  
	![](png/Pasted%20image%2020260824152510.png)

### 创建空间

在虚拟机中文件夹中新建文件  
使用 tree 显示整个树状结构：  
![](png/Pasted%20image%2020260824153006.png)

我们重点关心的是 src 目录（这就是我们的工作空间了）

### 包的创建
这个工具都是 ROS 提供的  
![](png/Pasted%20image%2020260824153103.png)

`cd src`：进入工作空间  
![](png/Pasted%20image%2020260824153203.png)  
输入 ROS 2(tap tap) 显示工具链

`ros2 pkg create --build-type ament_python --node-name my_node my_package`  
通过上述的命名创建 `my_package` 的包和 `my_node` 的节点

![](png/Pasted%20image%2020260824154109.png)

我们可以看见节点在 my_package 中的 my_node.py 的节点：  
外部还有 setup.py 的文件

```python
from setuptools import find_packages, setup

package_name = 'my_package'

setup(
    name=package_name,
    version='0.0.0',
    packages=find_packages(exclude=['test']),
    data_files=[
        ('share/ament_index/resource_index/packages',
            ['resource/' + package_name]),
        ('share/' + package_name, ['package.xml']),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    maintainer='chenbo',
    maintainer_email='chenbo@todo.todo',
    description='TODO: Package description',
    license='TODO: License declaration',
    extras_require={
        'test': [
            'pytest',
        ],
    },
    entry_points={
        'console_scripts': [
            'my_node = my_package.my_node:main'
        ],
    },
)
```

重点关注：

```python
    entry_points={
        'console_scripts': [
            'my_node = my_package.my_node:main'
        ],
```

说明了节点存在的位置为 my_package.my_node，找的时候找:main，启动这个节点

### 编译流程
- 在 ws 工作目录下 `colcon build` 进行**编译**
- 然后使用 source，最后运行这个节点
- 修改之后需要重复上面的操作  
	![](png/Pasted%20image%2020260824154731.png)  
	使用上下键可以直接到之前的语句

这里怎么使用 AI 呢

### AI 使用加入
我的虚拟系统的名称为 chenbo  
虚拟机的 ip 地址：`192.168.163.128`  
`ssh CHENBO@192.168.163.128`，再回车即可  
等待打开主机以及配置完成

然后就打开远程了  
（并且现在我们的两者就完全同步了）

## 通讯部分
### 直觉与工具
机器人是一个团队，不是一个人——由武术独立的“小人”(node) 组成团队

![](png/Pasted%20image%2020260824192344.png)

这些小人之间是如何进行交流的：发布/订阅的模式  
为什么使用这种方式：  
![](png/Pasted%20image%2020260824192521.png)

异步和解耦

- node（节点）：工人
- topic（话题）：传送带
- message(消息)：传送带的包裹

### 实操
小乌龟：(这是一个乌龟的节点)：不断广播自己的位置，同时接收外界的速度的消息（`ros2 run turtlesim turtlesim_node`）

![](png/Pasted%20image%2020260824192943.png)

- ros 2 topic list：查出有哪些广播（topics）
- ros 2 topic echo：听诊器（数据流），海龟在实时上传它的坐标

首先我们需要启动新的窗口，然后输入我们的查询广播话题的命令：

```cmd
/parameter_events
/rosout
/turtle1/cmd_vel
/turtle1/color_sensor
/turtle1/pose
```

### 我们主动发出一些数据

```cmd
ros2 topic pub /turtle1/cmd_vel geometry_msgs/msg/Twist 'linear:r:
  x: 1.0
  y: 0.0
  z: 0.0
angular:
  x: 0.0
  y: 0.0
  z: 3.1415926
' 

```

通过这种方式给小乌龟输入速度和角度的输入量，控制运行  

---

目前有的**节点**为：

```cmd
chenbo@chenbo-VMware-Virtual-Platform:~$ ros2 node list
/rqt_gui_py_node_12740
/teleop_turtle
/turtlesim
```

现在有的 topic(这个就是通信的通道，也就是传送带，在节点之间传送信息) 为：

```cmd
chenbo@chenbo-VMware-Virtual-Platform:~$ ros2 topic list
/parameter_events
/rosout
/turtle1/cmd_vel
/turtle1/color_sensor
/turtle1/pose
```

![](png/Pasted%20image%2020260824195302.png)  
这个就是两个节点之间的通讯（椭圆形的表示的是节点）（左边给到右边的是控制的数据），右边通过通道给到左边的是此时位置的数据

---
我们还可以通过 `ros2 run rqt_publisher rqt_publisher` 帮助我们发送消息

在这里选择我们的 `/turtle1/cmd_vel` 的 topic 传递信息如下：  
![](png/Pasted%20image%2020260824205510.png)

### 标准开发实践
![](png/Pasted%20image%2020260824205729.png)

我们创建一下我们的包以及节点：

```cmd
chenbo@chenbo-VMware-Virtual-Platform:~/dev_ws/src$ ros2 pkg create --build-type ament_python --node-name turtle_ctrl_node turtle_pkg
```

我们现在内部有着一个空的节点，现在编写这个节点：  
![](png/Pasted%20image%2020260824210410.png)

好像是注册一个专栏，准备广播（或者说是工人和运输带）

初始的为：

```python
def main():
    print('Hi from turtle_pkg.')


if __name__ == '__main__':
    main()

```

> 帮我为 src/turtle\_pkg/turtle\_pkg/turtle\_ctrl\_node.py 创建节点，并且实现为节点提供 publisher 的功能——给小乌龟发送速度控制指令

改变之后的代码为：

```python
import rclpy
from geometry_msgs.msg import Twist
from rclpy.node import Node


class TurtleCtrlNode(Node):
    """定时向 turtlesim 发布速度控制指令的节点。"""

    def __init__(self):
        super().__init__('turtle_ctrl_node')

        # 创建速度指令发布者，话题名称与 turtlesim 默认订阅话题一致。
        self.publisher = self.create_publisher(
            Twist,
            '/turtle1/cmd_vel',
            10,
        )

        # 每隔 0.5 秒调用一次 publish_velocity 方法。
        self.timer = self.create_timer(0.5, self.publish_velocity)
        self.get_logger().info(
            'Publishing velocity commands to /turtle1/cmd_vel'
        )

    def publish_velocity(self):
        """创建并发布一条速度控制指令。"""
        message = Twist()

        # 设置前进线速度，单位为米每秒。
        message.linear.x = 2.0

        # 设置绕 Z 轴旋转的角速度，单位为弧度每秒。
        # 同时设置线速度和角速度，可以让小乌龟沿圆形轨迹运动。
        message.angular.z = 1.0

        # 将速度指令发送到 /turtle1/cmd_vel 话题。
        self.publisher.publish(message)
        self.get_logger().info(
            f'linear.x={message.linear.x:.1f}, '
            f'angular.z={message.angular.z:.1f}'
        )


def main(args=None):
    # 初始化 ROS 2 Python 客户端。
    rclpy.init(args=args)
    node = TurtleCtrlNode()

    try:
        # 持续处理定时器等 ROS 2 回调，直到节点被终止。
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        # 退出前销毁节点并安全关闭 ROS 2。
        node.destroy_node()
        if rclpy.ok():
            rclpy.shutdown()


if __name__ == '__main__':
    main()

```