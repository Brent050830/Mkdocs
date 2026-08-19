## 任务
**要求**：在⻋辆到达充电桩时，温度达标的前提下（通常 20~25℃），使得后续充电到⽬标 SOC（如 80%）的时间最短，且最⼩化整个预热过程中总的预热能耗。

### 参数
#### 恒定物理参数
![](png/Pasted%20image%2020260818131116.png)

#### 目标参数
![](png/Pasted%20image%2020260818131141.png)

#### map 图
- 电池的内阻随着电池的 SOC 以及温度的变化：  
	![](png/Pasted%20image%2020260818131233.png)
- 电池的开路电压随着 SOC 以及温度的变化  
	![](png/Pasted%20image%2020260818131327.png)
- 充电功率的 map 图：  
	![](png/Pasted%20image%2020260818131349.png)

### 物理模型
#### 电池热模型：

$$
\begin{aligned}&M_{bat}\cdot c_{p,bat}\cdot\frac{dT_{bat}}{dt}=\dot{Q}_{gen}+\dot{Q}_{heat}-\dot{Q}_{loss}\\&\dot{Q}_{bat}=I_{bat}{}^{2}R_{bat}(SoC_{bat},T_{bat})\\&\mathrm{I}\\&\dot{Q}_{heat}=\eta_{heat}\cdot P_{heat}\cdot u_{on}\end{aligned}
$$

- 当 $u_on=0$ 时，加热关闭；$u_on=1$ 时，加热开启。
- $\eta_{heat}$ : 加热效率，通常取 0.9~0.95

---

$$
\dot{Q}_{loss}=k_{env}\cdot(T_{bat}-T_{env})\quad k_{env}=h_{0}+k_{v}\cdot V_{veh}\quad
$$

通过电池的产热，加热以及散热的计算得到在**单位时间**内**电池温度的变化量** $dT$ ,需要知道初始电池温度，环境温度，电池 SOC（得到电池电阻），加热状态；以及当前的功率，电压（计算得到电流）

## SOA 设计原则
- 以下是 SOA 设计原则的简要解释：

| 原则 | 含义 |
|------|------|
| **松耦合** | 服务之间依赖最小化，一个服务的变更不影响其他服务 |
| **标准契约** | 服务通过标准化的接口（如 WSDL、REST）对外暴露，消费者只需遵循契约即可调用 |
| **服务重用** | 服务设计为可复用的业务功能，避免重复开发 |
| **服务抽象** | 服务隐藏内部实现细节，只暴露必要的接口信息 |
| **可组合** | 多个服务可以灵活组合，形成更复杂的业务流程 |
| **服务自洽** | 服务独立部署、独立管理，不依赖其他服务的运行时状态 |
| **无状态性** | 服务不保存客户端的状态信息，每次请求独立处理，便于水平扩展 |
| **服务可实现** | 服务必须能被实际实现和部署，设计需考虑可行性和成本 |

---

**结合你的 USP 场景**：这些原则可以指导你将 " 电池预热优化 " 拆分为独立服务（如温度采集服务、预热策略服务、充电控制服务），各服务松耦合、无状态、通过标准接口通信，并可组合成完整的充电优化流程。

通用的服务组件——特定的业务目标——价值创造

### SOA 潜力
#### SOA 分层
**应用功能**：  
基础服务：（组合原子服务，提供接口；比如座椅有多个轴，基础服务就是将座椅多个轴进行总和）（优先级的逻辑也在基础服务中）  
原子服务：（具体的对象，出风口的温度等）  
设备抽象：（电机等等抽象设备）

在之后的大作业中要学会找接口和使用接口

## AI 部分
### 落地的四道门槛
#### 只有少量数据
少量数据——物理结构与系统约束（将人工的观念加入）

数据的可解释性重要

#### 性能更好，但是不能直接控制
AI 寻找增量优势，确定性逻辑负责限制权限（输出受约束的控制增量）

#### 训练目标没有按照预期工作

#### 训练好的怎么接入控制器
简化神经网络

1. 为什么这个问题值得解决，为什么需要 AI
2. 现有基线是什么，AI 的增量优势是什么
3. 数据为什么足以支撑你的结论

## AI 部署
### AI 部署工具链
#### OPT 优化方案
车载 AI 部署的全流程：

```text
PC训练模型
PyTorch / TensorFlow
       ↓
模型导出
ONNX / TFLite
       ↓
模型简化
剪枝 / 算子替换 / BN融合
       ↓
量化
FP32 → FP16 / INT16 / INT8
       ↓
芯片厂商工具链
       ↓
生成芯片可执行模型/代码
       ↓
嵌入 ECU 软件
       ↓
传感器输入
       ↓
预处理
       ↓
AI inference
       ↓
后处理
       ↓
车辆控制/感知结果
```

企业，使用专用的 agent 做专业的事情，最后用主控的控制不同的 agent

个人 demo 允许 80% 成功率、偶尔出错重试；企业里 agent 一旦接入生产流程，**一个错误可能造成资金、合规、生产事故**。所以所有设计都围绕一个问题：**怎么让 agent 的行为可预测、可追溯、可兜底。**

| 优先级 | 维度 | 具体含义 |
|--------|------|---------|
| **①** | **可靠性 / 确定性** | 同样输入 → 可预期输出，禁止 " 惊喜 " |
| **②** | **权限与安全** | 最小权限原则，身份、PII、数据隔离 |
| **③** | **可观测 / 可审计** | 每一步决策留痕，能回溯 " 为什么这么做 " |
| **④** | **可评估 (Eval)** | 用回归测试集度量，而不是 " 感觉挺好 " |
| **⑤** | **护栏 (Guardrails)** | 高风险动作必须人确认（Human-in-the-loop） |
| **⑥** | **成本 / ROI** | token 成本、延迟，能否算清这笔账 |

> **企业做 agent，最注重的不是 " 它多聪明 "，而是 " 它能不能被信任 "——可靠、可控、可审计、可评估、可兜底。** 能力是入场券，可靠性才是企业愿意上生产的前提。

RAG 的问题在于 " **只认字面相似，不懂领域结构** "（找字面的相似，不懂概念之间的关系）；本体提供的是**显式的概念关系网**（概念的逻辑关系网），让检索从 " 猜 " 变成 " 查 "，还能做推理和约束校验。 专业领域（汽车、医疗、法律、工业）里，纯 RAG 天花板低，本体 + RAG 的混合方案才够用。

## USP 2
使用 Ulystudio 工具进行开发即可  
![](png/Pasted%20image%2020260818135036.png)

新建一个应用，使用左侧的 ai 生成 `雨天上车，当主驾驶车门关闭时，检测到钥匙在车内，开启前雨刷，开启近光灯，车门内部落锁。当打开主驾车门，则关闭雨刷，车内内部解锁`

- 状态通知接口：主驾门状态，钥匙状态
- 控制接口：雨刮控制，近光灯控制，整车门控制  
	整个使用的流程就是先用 ai 生成需求，之后点击实现，自动使用 ai 生成相应的代码部分

```c
#include "UaesAPI.h"



void algo_initialize()
{
    /* Algo initialize function */
    // std::cout << "algorithm initialized."<<std::endl;
}

void algo_terminate()
{
    /* Algo terminate function */
    // std::cout << "algorithm terminated."<<std::endl;
}

void algo_step() {
    // 检查前置条件
    bool engineRunning = EMS_Engine_getEngStrtStatus() != 0;  // 发动机是否启动
    bool rainExceedsThreshold = BO_Atm_RainSnsr_ntfRainSnsrSys() > RAIN_THRESHOLD;  // 雨量是否超标
    bool lightInsufficient = TMS_EnvMonitor_getLightIntensity() < LIGHT_THRESHOLD;  // 光照是否不足
    bool keyInCar = BO_Atm_FobKey_ntfKey1Info().keyInCar;  // 钥匙是否在车内
    bool systemFault = checkSystemFault();  // 系统是否有故障

    // 检查主驾驶车门状态
    bool driverDoorOpen = BO_Bs_VehDoor_ntfAny4DoorOpenFlg();
    bool driverDoorClosed = !driverDoorOpen;

    // 检查车速
    float vehicleSpeed = VCS_Atm_VehSpd_ntfVehSpdAbslt().speed;

    // 当主驾驶车门由开启转为关闭时
    if (driverDoorClosed && !engineRunning && rainExceedsThreshold && lightInsufficient && keyInCar && !systemFault) {
        // 自动执行前雨刷刮刷
        BO_Bs_WiprFrnt_wiprCtrl(WIPR_CMD_START);
        // 强制开启近光灯
        BO_Bs_LoBeam_liCtrl(LIGHT_CMD_ON);
        // 全车电子落锁
        BO_Bs_DoorLock_lockCtrl(LOCK_CMD_LOCK, ALL_DOORS, PRIORITY_HIGH);
    }

    // 当主驾驶车门再次打开且车速为0时
    if (driverDoorOpen && vehicleSpeed == 0) {
        // 雨刷复位停放
        BO_Bs_WiprFrnt_wiprCtrl(WIPR_CMD_STOP);
        // 门锁解锁
        BO_Bs_DoorLock_lockCtrl(LOCK_CMD_UNLOCK, ALL_DOORS, PRIORITY_HIGH);
        // 近光灯保持开启
        BO_Bs_LoBeam_liCtrl(LIGHT_CMD_ON);
    }
}
```

![](png/Pasted%20image%2020260818140724.png)

在服务——文档中有很多的接口

```text
读取 CSV
   ↓
调用 anti_pinch_detector_init() 一次
   ↓
每隔 2 ms 注入一行传感器数据
   ↓
调用 anti_pinch_detector_step()
   ↓
读取防夹输出
   ↓
生成 eval_output.csv 和时序图
```

|          项目          |      `test.csv`      |    `validate.csv`     |
| :------------------: | :------------------: | :-------------------: |
|         数据行数         |       24349 行        |        2996 行         |
|         时间范围         |  0.1062s 到 48.8022s  |  0.0413s 到 29.9912s   |
|         采样间隔         |        固定 2ms        |     约 10ms，有轻微抖动      |
|        电机电流范围        |      0 到 10636       |       0 到 3019        |
| 位置原始范围 `ntfAxisPosn` |       0 到 101        |        3 到 94         |
|         电机状态         |      停止/正转/反转都有      |     主要正转，少量停止和反转      |
|         电压范围         | 有开头 0，运行时约 13.5V ADC | 约 13.85V 到 13.91V ADC |
|        防夹参考点         |          有           |    按绘图脚本逻辑没有明显参考点     |

| CSV 列名                               | 含义                         | 算法里对应接口                                    |
| :----------------------------------- | :------------------------- | :----------------------------------------- |
| `time`                               | 当前样本时间，单位秒                 | runner 用来按序喂数据                             |
| `ntfMotCurr`                         | 电机电流，夹住时通常会升高              | `SeatBackRclnMotDD_u16MotCur()`            |
| `ntfAxisPosn`                        | 座椅靠背位置原始值                  | SDK 会映射后给 `BO_Atm_SeatBackRcln_ntfPosn()`  |
| `ntfHallWidth`                       | 霍尔脉冲宽度，可反映速度变化；变大通常代表变慢/受阻 | `SeatBackRclnHallDD_u32CurrHallPlsWidth()` |
| `Atm_SeatAxisAdjBackIncln_ntfMotSts` | 电机状态：0 停止，1 正转，2 反转        | `BO_Atm_SeatBackRcln_ntfOperSt()`          |
| `ntfBattVol`                         | 供电电压 ADC 值                 | `SeatBackRclnMotDD_u16MotPwrVolt()`        |
| `ntfRealPosn_Hall`                   | 霍尔位置计数                     | `BO_Atm_SeatBackRcln_ntfHallPosn()`        |

```text
程序启动
  ↓
anti_pinch_detector_init()        只调用 1 次，初始化内部状态
  ↓
读取第 1 行数据
anti_pinch_detector_step()        调用 1 次，输出一次 0/1
  ↓
读取第 2 行数据
anti_pinch_detector_step()        再调用 1 次，输出一次 0/1
  ↓
...
  ↓
读取完 CSV
程序结束
```

就是不断读取数据，然后放入缓冲区（只放正常运行的数据进去）（放一定量的，定时覆盖），使用缓冲区中的计算基线，偏离太多为异常值，计入 CUSUM 分数，这个分数太高认定为防夹触发（正常的话会减少这个，连续正常这个会清零）

现在使用的是电流和霍尔脉宽作为基线

---

1. 参考代码里有一个小逻辑问题  
   在 [student_solution_ref.c](</C:/Users/17871/Desktop/防夹/sdk/antipinch/student_solution_ref.c:234>) 先把 `g_det.prev_oper_st = oper_st_val;` 更新了，后面 [student_solution_ref.c](</C:/Users/17871/Desktop/防夹/sdk/antipinch/student_solution_ref.c:236>) 再判断：

   ```c
   if (!motor_running && g_det.prev_oper_st != OPERMOTST_NO_RUNNING)
   ```

   这个条件基本进不去，因为停车时 `prev_oper_st` 已经被改成停车了。应该把 `prev_oper_st` 的更新放到这段逻辑之后，或者先保存旧状态。

2. `stall_counter` 算了但没参与判断  
   [student_solution_ref.c](</C:/Users/17871/Desktop/防夹/sdk/antipinch/student_solution_ref.c:276>) 统计了位置停滞，但后续没用。可以把它作为第三个辅助条件：电流异常 + 霍尔脉宽异常 + 位置短时间不变化，更稳。

3. `fabs()` 可能会带来误判  
   现在电流和霍尔脉宽都用绝对偏差：

   ```c
   fabs(g_det.curr_dev) > curr_thresh
   fabs(g_det.hw_dev) > hw_thresh
   ```

   但防夹通常更像“电流升高、速度变慢、霍尔脉宽变大”。可以考虑改成方向性判断：

   ```c
   g_det.curr_dev > curr_thresh
   g_det.hw_dev > hw_thresh
   ```

   这样对突然下降类噪声不敏感。

4. 采样周期要注意  
   代码里的 `STARTUP_DELAY_SAMPLES`、`CUSUM_MIN_FRAMES` 都默认 2ms 一帧。但我看 `validate.csv` 实际大约是 10ms 一行。官方如果就是按 SDK 的 2ms 调用，那没问题；如果本地 runner 是每行调用一次，那这些“帧数阈值”的实际时间会变长。

5. 性能优化不是当前瓶颈  
   每帧都对 200 个点算均值和方差，数据量很小时完全够用。真要追速度，可以在环形缓冲区里维护 `sum` 和 `sum_sq`，把基线计算从每帧 O(200) 变成 O(1)，但代码复杂度会上来。

我的判断：现在参考算法在这两个数据集上的结果是正常的。优先优化第 1 点和第 3 点，收益最大；性能优化可以先不急。

## 实践
### 问题
1. 怎么保证不穷举的话是全局最优解，而不是局部最优解（因为有两个冲突的指标，而且 cost 计算随着候选变化而变化）（现在使用的是保留 Pareto 候选）  
	也就是粗筛之后不直接淘汰并没有处于被支配地位的（两个指标都差）
2. 最后的充电计算好像不对（现在对了）
3. 功率、图中最低 SOC 两个边界问题
4. 每轮 16 个（这个解决了）
5. 还有就是一个符合的粗筛都没有（解决了）

现在的流程伪代码：

```python
执行全路线粗搜;
所有粗搜结果加入 coarse_pool 和 all_pool;

for (;;) {
    对 all_pool 全局重评分;
    重新计算 Pareto;

    if (存在尚未细搜的晋级粗搜候选) {
        对缺失区间执行 0.05 km 细搜;
        结果加入 fine_pool 和 all_pool;
        continue;
    }

    if (存在尚未精修的晋级细搜候选) {
        对缺失区间执行 0.005 km 精修;
        结果加入 final_pool 和 all_pool;
        continue;
    }

    break;
}

对 all_pool 最终全局评分;
选择可行候选中 cost 最小者；
```

### 现在的筛选
首先满足约束条件：

```python
20.0 <= T_end <= 25.0
SOC_end >= 10%
```

满足硬约束之后，满足以下的任意一个条件就进入下一层搜索：

```python
cand->cost <= best_cost + 0.03f      // 接近当前最优
||
cand->heat_kWh <= min_energy + eps   // 当前最小能耗
||
cand->charge_s <= min_charge + eps   // 当前最小充电时间
||
cand->pareto                          // Pareto候选
||
cand->local_min                       // score局部最小值
```

也就是：

```text
接近最优候选
+ 最小能耗候选
+ 最小充电时间候选
+ Pareto候选
+ score局部最小值
```

```text
1. 使用1 s时间步快速找到t20、t25、tSOC的大致位置；
2. 在每个边界前后至少±1 s范围内，用0.2 s重新搜索；
3. 得到0.2 s精度的可行时间区间；
4. 使用0.2 s边界重新计算min_heat和max_heat；
5. 在可行区间内粗搜、细搜；
6. 对最佳score、充电时间最大/最小、局部极值等区域做0.2 s精修；
7. 使用最终0.2 s候选全局重评分；
8. 把最佳启动时刻换算为剩余距离输出。
```

现在在向着求解逐步转变