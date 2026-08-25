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

![](png/Pasted%20image%2020260825102656.png)  
使用这种方式进行执行

使用定时器的概念：  
![](png/Pasted%20image%2020260825102728.png)

create timer

---

#### 整体的流程：
![](png/Pasted%20image%2020260825102855.png)

写完新的代码之后要先编译和构建（编译操作），之后在运行之前，要先刷新环境，才能运行我们新的节点

### 架构进阶

> 帮我实现一个小乌龟控制节点：turtle\_gui\_ctrl\_node，参考 src/turtle\_pkg/turtle\_pkg/turtle\_ctrl\_node.py,结合图形化进行实现（图像如图，要求采用 pyqt 进行实现

新创建的是：

```python
import sys

import rclpy
from geometry_msgs.msg import Twist
from PyQt5.QtCore import QTimer
from PyQt5.QtGui import QDoubleValidator
from PyQt5.QtWidgets import (
    QApplication,
    QFormLayout,
    QLineEdit,
    QMessageBox,
    QPushButton,
    QVBoxLayout,
    QWidget,
)
from rclpy.node import Node


class TurtleGuiCtrlNode(Node):
    """接收图形界面中的速度值，并发布给 turtlesim。"""

    def __init__(self):
        super().__init__('turtle_gui_ctrl_node')

        # 创建速度指令发布者，控制 turtlesim 中默认的 turtle1。
        self.publisher = self.create_publisher(
            Twist,
            '/turtle1/cmd_vel',
            10,
        )
        self.get_logger().info('小乌龟图形化控制节点已启动')

    def publish_velocity(self, linear_velocity, angular_velocity):
        """发布由图形界面输入的线速度和角速度。"""
        message = Twist()
        message.linear.x = linear_velocity
        message.angular.z = angular_velocity
        self.publisher.publish(message)

        self.get_logger().info(
            f'发送速度：线速度={linear_velocity:.2f} m/s，'
            f'角速度={angular_velocity:.2f} rad/s'
        )

    def stop_turtle(self):
        """发布零速度，使小乌龟停止运动。"""
        self.publish_velocity(0.0, 0.0)


class TurtleControlWindow(QWidget):
    """小乌龟速度控制窗口。"""

    def __init__(self, node):
        super().__init__()
        self.node = node
        self.setWindowTitle('小乌龟控制器')
        self.setMinimumWidth(400)

        # 限制输入内容为 -1000.0 到 1000.0 之间的小数。
        validator = QDoubleValidator(-1000.0, 1000.0, 3, self)

        self.linear_input = QLineEdit('0.0')
        self.linear_input.setValidator(validator)
        self.linear_input.setPlaceholderText('请输入线速度')

        self.angular_input = QLineEdit('0.0')
        self.angular_input.setValidator(validator)
        self.angular_input.setPlaceholderText('请输入角速度')

        # 使用表单布局排列速度标签和输入框。
        form_layout = QFormLayout()
        form_layout.addRow('线速度', self.linear_input)
        form_layout.addRow('角速度', self.angular_input)

        self.send_button = QPushButton('发送')
        self.send_button.clicked.connect(self.send_velocity)

        main_layout = QVBoxLayout()
        main_layout.addLayout(form_layout)
        main_layout.addWidget(self.send_button)
        self.setLayout(main_layout)

    def send_velocity(self):
        """读取输入框并调用 ROS 2 节点发布速度指令。"""
        try:
            linear_velocity = float(self.linear_input.text())
            angular_velocity = float(self.angular_input.text())
        except ValueError:
            QMessageBox.warning(self, '输入错误', '请输入有效的速度数值。')
            return

        self.node.publish_velocity(linear_velocity, angular_velocity)

    def closeEvent(self, event):
        """关闭窗口前发送零速度，避免小乌龟继续运动。"""
        self.node.stop_turtle()
        event.accept()


def main(args=None):
    # 分别初始化 ROS 2 和 PyQt5。
    rclpy.init(args=args)
    app = QApplication(sys.argv)
    node = TurtleGuiCtrlNode()
    window = TurtleControlWindow(node)

    # 通过 Qt 定时器处理 ROS 2 回调，避免阻塞图形界面。
    ros_timer = QTimer()
    ros_timer.timeout.connect(lambda: rclpy.spin_once(node, timeout_sec=0.0))
    ros_timer.start(10)

    window.show()

    try:
        exit_code = app.exec_()
    finally:
        ros_timer.stop()
        node.destroy_node()
        if rclpy.ok():
            rclpy.shutdown()

    sys.exit(exit_code)


if __name__ == '__main__':
    main()

```

```cmd
cd /home/chenbo/dev_ws
source /opt/ros/jazzy/setup.bash
source install/setup.bash
ros2 run turtle_pkg turtle_gui_ctrl_node
```

最后的运行成果：  
![](png/Pasted%20image%2020260825104000.png)

### 小乌龟发布位置信息

```cmd
chenbo@chenbo-VMware-Virtual-Platform:~/dev_ws$ ros2 topic list 
/parameter_events
/rosout
/turtle1/cmd_vel
/turtle1/color_sensor
/turtle1/pose
chenbo@chenbo-VMware-Virtual-Platform:~/dev_ws$ ros2 topic info /turtle1/pose
Type: turtlesim/msg/Pose
Publisher count: 1
Subscription count: 0
chenbo@chenbo-VMware-Virtual-Platform:~/dev_ws$ ros2 node list
/turtlesim

```

可见，/turtle 1/pose 这个 topic（专栏或者说通道）只有一个发布者（就是我们小乌龟这个节点），但是没有订阅者/节点

我们可以手动观测一折发布的这个专栏里面的消息：`ros2 topic echo /turtle1/pose`

```text
ros2 topic echo /turtle1/pose
x: 5.211894989013672
y: 9.775237083435059
theta: 2.8510582447052
linear_velocity: 0.0
angular_velocity: 0.0
---
x: 5.211894989013672
y: 9.775237083435059
theta: 2.8510582447052
linear_velocity: 0.0
angular_velocity: 0.0

```

这个就是数据的流向

#### 我们让实现坐标显示

> 帮我创建一个节点，取名为 turtle\_advce\_ctrl\_node 节点，同样参考上一个节点，并且额外增加小乌龟的 pose 的订阅，要求实现的 GUI 为图片

```python
import sys

import rclpy
from geometry_msgs.msg import Twist
from PyQt5.QtCore import QTimer
from PyQt5.QtGui import QDoubleValidator
from PyQt5.QtWidgets import (
    QApplication,
    QFormLayout,
    QLabel,
    QLineEdit,
    QMessageBox,
    QPushButton,
    QVBoxLayout,
    QWidget,
)
from rclpy.node import Node
from turtlesim.msg import Pose


class TurtleAdvceCtrlNode(Node):
    """发布速度指令并订阅小乌龟位姿的 ROS 2 节点。"""

    def __init__(self):
        super().__init__('turtle_advce_ctrl_node')

        # 向 turtlesim 发布速度控制指令。
        self.velocity_publisher = self.create_publisher(
            Twist,
            '/turtle1/cmd_vel',
            10,
        )

        # 订阅 turtle1 的实时位置、角度和速度信息。
        self.pose_subscription = self.create_subscription(
            Pose,
            '/turtle1/pose',
            self.pose_callback,
            10,
        )

        # GUI 创建后会把界面更新函数保存到这里。
        self.pose_update_handler = None
        self.get_logger().info('小乌龟高级图形化控制节点已启动')

    def publish_velocity(self, linear_velocity, angular_velocity):
        """发布图形界面中设置的线速度和角速度。"""
        message = Twist()
        message.linear.x = linear_velocity
        message.angular.z = angular_velocity
        self.velocity_publisher.publish(message)

        self.get_logger().info(
            f'发送速度：线速度={linear_velocity:.2f} m/s，'
            f'角速度={angular_velocity:.2f} rad/s'
        )

    def pose_callback(self, message):
        """收到 Pose 消息后通知 GUI 更新显示内容。"""
        if self.pose_update_handler is not None:
            self.pose_update_handler(message)

    def stop_turtle(self):
        """发布零速度，使小乌龟停止运动。"""
        self.publish_velocity(0.0, 0.0)


class TurtleAdvceControlWindow(QWidget):
    """可以控制速度并实时显示小乌龟位姿的窗口。"""

    def __init__(self, node):
        super().__init__()
        self.node = node
        self.node.pose_update_handler = self.update_pose

        self.setWindowTitle('小乌龟控制器')
        self.setMinimumWidth(420)

        # 限制输入框只能输入有效的小数。
        validator = QDoubleValidator(-1000.0, 1000.0, 3, self)

        self.linear_input = QLineEdit('0.0')
        self.linear_input.setValidator(validator)
        self.linear_input.setPlaceholderText('请输入线速度')

        self.angular_input = QLineEdit('0.0')
        self.angular_input.setValidator(validator)
        self.angular_input.setPlaceholderText('请输入角速度')

        # 创建用于显示 Pose 消息各字段的标签。
        self.x_value = QLabel('0.000000')
        self.y_value = QLabel('0.000000')
        self.linear_velocity_value = QLabel('0.000000')
        self.angular_velocity_value = QLabel('0.000000')
        self.theta_value = QLabel('0.000000')

        form_layout = QFormLayout()
        form_layout.addRow('线速度', self.linear_input)
        form_layout.addRow('角速度', self.angular_input)
        form_layout.addRow('当前X坐标', self.x_value)
        form_layout.addRow('当前Y坐标', self.y_value)
        form_layout.addRow('当前线速度', self.linear_velocity_value)
        form_layout.addRow('当前角速度', self.angular_velocity_value)
        form_layout.addRow('当前角度', self.theta_value)

        self.send_button = QPushButton('发送')
        self.send_button.clicked.connect(self.send_velocity)

        main_layout = QVBoxLayout()
        main_layout.addLayout(form_layout)
        main_layout.addWidget(self.send_button)
        self.setLayout(main_layout)

    def send_velocity(self):
        """读取用户输入，并通过 ROS 2 节点发送速度指令。"""
        try:
            linear_velocity = float(self.linear_input.text())
            angular_velocity = float(self.angular_input.text())
        except ValueError:
            QMessageBox.warning(self, '输入错误', '请输入有效的速度数值。')
            return

        self.node.publish_velocity(linear_velocity, angular_velocity)

    def update_pose(self, message):
        """把最新的 Pose 消息显示到界面标签中。"""
        self.x_value.setText(f'{message.x:.6f}')
        self.y_value.setText(f'{message.y:.6f}')
        self.linear_velocity_value.setText(f'{message.linear_velocity:.6f}')
        self.angular_velocity_value.setText(f'{message.angular_velocity:.6f}')
        self.theta_value.setText(f'{message.theta:.6f}')

    def closeEvent(self, event):
        """关闭窗口前停止小乌龟。"""
        self.node.stop_turtle()
        self.node.pose_update_handler = None
        event.accept()


def main(args=None):
    # 初始化 ROS 2 和 PyQt5。
    rclpy.init(args=args)
    app = QApplication(sys.argv)
    node = TurtleAdvceCtrlNode()
    window = TurtleAdvceControlWindow(node)

    # 定时处理发布和订阅回调，同时保持 GUI 响应。
    ros_timer = QTimer()
    ros_timer.timeout.connect(lambda: rclpy.spin_once(node, timeout_sec=0.0))
    ros_timer.start(10)

    window.show()

    try:
        exit_code = app.exec_()
    finally:
        ros_timer.stop()
        node.destroy_node()
        if rclpy.ok():
            rclpy.shutdown()

    sys.exit(exit_code)


if __name__ == '__main__':
    main()

```

终端运行为：

```python
cd /home/chenbo/dev_ws
source /opt/ros/jazzy/setup.bash
source install/setup.bash
ros2 run turtle_pkg turtle_advce_ctrl_node
```

可见，运行节点的时候，节点前面要加上包的名字（实际上就是定位）

![](png/Pasted%20image%2020260825110441.png)  
现在就可以了

## ROS 2 视觉与控制
### OPENCV 的写法
首先安装 OpenCV：`pip install opencv-python`

#### 数字图像的本质
