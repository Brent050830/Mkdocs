## 概念
### 典型自主控制系统

```text
           激光雷达 / 相机 / IMU / 编码器
                       │
                       ↓
                  ROS 2 驱动
                       │
        ┌──────────────┴──────────────┐
        ↓                             ↓
   里程计 / IMU                  LiDAR / Camera
        │                             │
        └───────────┬─────────────────┘
                    ↓
              Localization / SLAM
             定位 + 建图 + TF
                    │
                    ↓
                  Map
                    │
              ┌─────┴─────┐
              ↓           ↓
          Global Map   Local Map
              │           │
              ↓           ↓
       Global Planner   障碍物
        A*/Dijkstra       │
              │           │
              └─────┬─────┘
                    ↓
             Local Planner
            / Controller
       DWB / MPPI / MPC...
                    │
                    ↓
               cmd_vel
                    │
                    ↓
              底盘控制器
                    │
                    ↓
                电机
```

> 之前做的 CARLA 路径规划 + MPC 轨迹跟踪非常接近，只不过 ROS 把感知、定位、地图、规划、控制等模块用**统一通信框架**连接起来。

### ROS
机器人控制系统，不是传统意义上的操作系统，而是：机器人软件的通信框架 + 工具集 + 软件生态

```text
激光雷达程序
      ↓
SLAM程序
      ↓
路径规划程序
      ↓
MPC控制程序
      ↓
电机驱动程序
```

这些程序可以分别作为 ROS 的 Node（节点）

节点之间通过：

```text
Topic
Service
Action
Parameter
TF
```

等等进行通信

现在学习的一般是 ROS 2

---

### SLAM
Simultaneous Localization And Mapping：同时定位与建图

机器人进入未知环境中：不知道地图 + 不知道自己在哪里

通过：

```text
LiDAR
Camera
IMU
Wheel Odometry
```

不断估计机器人的 x,y, $\theta$，同时建立 map

### Planning
SLAM 告诉机器人：

> “你在这里，地图长这样。”

Planning 则回答：

> “那我要怎样从 A 走到 B？“”

就是轨迹规划  
经典算法：

```text
Dijkstra
A*
Theta*
Hybrid A*
RRT
RRT*
```

### control
由给出的跟踪轨迹的坐标，计算出所需的控制量，让机器人真正跟踪轨迹

常见的为 PID 控制  
再往后为：

```text
Pure Pursuit
Stanley
LQR
MPC
MPPI
```