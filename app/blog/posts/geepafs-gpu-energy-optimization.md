---
title: "GEEPAFS：GPU 能效优化的论文复现与实践"
date: "2025-11-18"
tags: ["GPU", "DVFS", "能效优化", "CUDA", "系统优化"]
description: "从论文到代码：深入理解 GEEPAFS 如何通过动态频率调节实现 GPU 能效优化，以及在 RTX 4070 上的复现经验"
---

# GEEPAFS：GPU 能效优化的论文复现与实践

在 GPU 功耗不断攀升的今天（V100: 300W → A100: 400W → H100: 700W），如何在保证性能的前提下降低能耗，成为了数据中心和 HPC 系统的关键挑战。本文将深入解析 GEEPAFS 论文的核心思想，并分享在 RTX 4070 上的复现经验。

**项目地址**：[GitHub - GEEPAFS](https://github.com/zyjopensource/geepafs)

**论文链接**：
- [GEEPAFS: GPU Energy Efficiency with Performance Assurance using Frequency Scaling](https://dl.acm.org/doi/10.1145/3577193.3593704) - ACM e-Energy 2023
- [论文 PDF](https://dl.acm.org/doi/pdf/10.1145/3627703.3629584) - EuroSys '24 版本

---

## 一、论文要解决什么问题

### 1.1 GPU 功耗成为扩容硬约束

随着 GPU 算力需求的增长，功耗问题日益突出：
- 单卡 TDP 从 V100 的 300W 提升到 H100 的 700W
- 同一机柜中 GPU 数量不断增加，供电/散热成本激增
- 运营方需要在不中断业务的情况下即时削减功耗

### 1.2 主流 DVFS 手段难以落地

现有的动态电压频率调节（DVFS）策略存在以下问题：

| 问题 | 影响 |
|------|------|
| **性能不可控** | 按 GPU 利用率或固定频率调整，引入不可预测的性能回退 |
| **需要离线 profiling** | 要求对每个应用做多次预运行、插桩或模型训练 |
| **需要代码改动** | 运维门槛高，不适合多租户云平台 |
| **适用范围窄** | 只对单机/单工作集有效，缺乏普适性验证 |

### 1.3 线上性能行为难以预估

数据中心作业呈现阶段性特征，同一张 GPU 可能被不同租户以不同 batch、数据集反复使用。离线模型无法覆盖所有运行态，也无法确保"无代码修改、无需重复运行"情况下仍满足性能约束。

### 1.4 GEEPAFS 的目标

**应用透明 + 性能保底**：
- 运行中仅依赖 NVML/DCGM 的硬件计数器进行建模
- 自动给出满足性能阈值的最低频率
- 在 V100/A100 上平均能效提升 20%–27%，平均性能损失 5.8%，最差 12.5%

---

## 二、GEEPAFS 的核心思路

### 2.1 在线探测 + 折线模型

GEEPAFS 采用迭代式的在线建模策略：

1. **Probing（探测）**：在多个代表频点执行短时采样
2. **Sampling（采样）**：收集 GPUbwUt（带宽利用率）、GPU 利用率、功耗等指标
3. **Modeling（建模）**：拟合"频率-性能"折线模型，区分 memory-bound 和 compute-bound 两段
4. **Selection（选择）**：计算满足性能约束 δ 的最低频率，再结合能效曲线挑选最终频点
5. **Application（应用）**：通过 NVML 下发频率命令

### 2.2 关键发现：GPUbwUt 与性能的线性关系

论文验证了一个重要观察：**GPUbwUt（GPU 内存带宽利用率）与应用性能直接成正比**。

这使得我们可以：
- 通过 GPUbwUt 估算性能，无需运行完整应用
- 在不同频率下快速探测性能变化
- 实现在线性能建模

### 2.3 折线模型（Fold-line Model）

频率与 GPUbwUt 的关系是**非线性**的，GEEPAFS 用**两段折线**近似：

```
GPUbwUt = {
  k1 * freq + b1,  freq < turning_point  (memory-bound)
  k2 * freq + b2,  freq ≥ turning_point  (compute-bound)
}
```

转折点（turning point）分隔了两个阶段：
- **低频段**：内存带宽是瓶颈，提升频率能显著提升性能
- **高频段**：计算是瓶颈，提升频率对性能影响较小

### 2.4 性能保障机制

GEEPAFS 确保性能 ≥ (1 − δ) × MaxFreq 性能：

1. 基于折线模型计算满足性能约束的最低频率
2. 在该频率以上寻找能效最优点
3. 如果检测到性能下滑，退回高频区间重新探测

---

## 三、代码架构与实现

### 3.1 核心文件说明

| 文件 | 功能 | 对应论文部分 |
|------|------|--------------|
| `dvfs.c` | C/NVML 版守护进程 | 在线调频策略与性能保证算法 |
| `dvfsPython.py` | Python/DCGM 版本 | 采样用 DCGM，调频用 NVML |
| `runExp.py` | 实验编排脚本 | 自动化运行基准测试 |
| `postprocessing.py` | 数据后处理 | 解析日志，计算能效指标 |
| `cuda_samples/` | CUDA 基准测试 | 模拟真实工作负载 |

### 3.2 两条实现线

**C 版**：采样 + 调频都走 NVML
- 优点：无额外依赖，部署简单
- 缺点：采样精度受限于 NVML

**Python 版**：采样改用 DCGM，调频仍用 NVML
- 优点：采样速度/准确性更高
- 缺点：需要安装 DCGM

### 3.3 支持的 DVFS 策略

| 策略 | 说明 | 启动命令 |
|------|------|----------|
| **Assure** | 论文主方法，性能保障 | `sudo ./dvfs mod Assure p90` |
| **MaxFreq** | 对照基线，始终最高频 | `sudo ./dvfs mod MaxFreq` |
| **EfficientFix** | 固定最高能效频点 | `sudo ./dvfs mod EfficientFix` |
| **UtilizScale** | 基于利用率的启发式 | `sudo ./dvfs mod UtilizScale` |
| **NVboost** | NVIDIA 默认策略 | `sudo ./dvfs mod NVboost` |

**性能保障阈值**：`p90` 表示保证性能不少于 MaxFreq 基线的 90%。

**策略对比图**：

```
频率调整策略对比：
MaxFreq:      ████████████████████ (始终最高频)
EfficientFix: ██████████░░░░░░░░░░ (固定能效最优点)
UtilizScale:  ████░░██████░░░████░ (随利用率波动)
GEEPAFS:      ████████░░░░████████ (动态调整，性能保障)
              ↑       ↑       ↑
           启动阶段  稳定期  收尾阶段
```

### 3.4 核心算法实现

#### Assure 策略的工作流程

```
循环（每 T1 秒）：
  1. Probing 阶段（探测）
     for freq in [2475, 2100, 1800, 1500, 1200]:
       设置 GPU 频率为 freq
       采样 M 次（每次间隔 T2）
       记录 GPUbwUt, GPU利用率, 功耗

  2. 建模阶段
     拟合折线模型：GPUbwUt = f(freq)
     找到转折点（memory-bound vs compute-bound）

  3. 性能保障计算
     计算满足 (1-δ) × MaxPerf 的最低频率 f_min

  4. 能效优化
     在 [f_min, MAX_FREQ] 范围内选择能效最优频率

  5. 应用频率
     通过 nvmlDeviceSetApplicationsClocks 设置频率
```

#### 关键代码片段（C 版）

```c
// 采样 GPUbwUt
nvmlDeviceGetUtilizationRates(device, &utilization);
unsigned int bwUt = utilization.memory;  // 内存带宽利用率

// 设置频率
nvmlDeviceSetApplicationsClocks(device, memFreq, smFreq);

// 折线模型拟合
double k1, b1, k2, b2, turning_point;
fit_foldline_model(freq_samples, bwUt_samples, &k1, &b1, &k2, &b2, &turning_point);

// 性能保障计算
double target_bwUt = max_bwUt * (1 - delta);
double f_min = compute_min_freq(target_bwUt, k1, b1, k2, b2, turning_point);

// 能效优化
double best_freq = f_min;
double best_efficiency = 0;
for (freq = f_min; freq <= MAX_FREQ; freq += STEP) {
    double power = estimate_power(freq);
    double perf = estimate_perf(freq);
    double efficiency = perf / power;
    if (efficiency > best_efficiency) {
        best_efficiency = efficiency;
        best_freq = freq;
    }
}
```

#### Python 版的改进

Python 版使用 DCGM 进行采样，提供更高的精度：

```python
import dcgm_fields
import pynvml

# DCGM 采样（更精确）
field_ids = [
    dcgm_fields.DCGM_FI_DEV_GPU_UTIL,
    dcgm_fields.DCGM_FI_DEV_MEM_COPY_UTIL,  # 更精确的带宽利用率
    dcgm_fields.DCGM_FI_DEV_POWER_USAGE
]

# NVML 调频（兼容性好）
pynvml.nvmlDeviceSetApplicationsClocks(handle, mem_freq, sm_freq)
```

---

## 四、实验流程与结果

### 4.1 实验流程

#### 完整实验流程

```bash
# 1. 编译 DVFS 程序
cd DVFS/geepafs
make

# 2. 编译 CUDA 基准测试
cd cuda_samples/benchmarks
make

# 3. 运行完整实验
sudo python3 runExp.py

# 4. 后处理数据
python3 postprocessing.py
```

#### runExp.py 的工作原理

`runExp.py` 是实验的核心编排脚本，它的工作流程如下：

1. **暖机阶段**：先运行一次所有基准，避免首次运行的性能波动
2. **随机化顺序**：随机打乱基准测试的运行顺序，避免顺序效应
3. **并发执行**：
   - 在后台启动 `dvfs` 守护进程（记录策略决策）
   - 在前台依次运行各个 CUDA 基准（记录应用性能）
4. **日志记录**：
   - `allApps_<policy>_<timestamp>.out`：应用的 stdout/stderr + 时间戳
   - `dvfs_<policy>_<timestamp>.out`：守护进程的频率/功耗/利用率日志

#### postprocessing.py 的数据处理

后处理脚本将原始日志转换为可分析的 CSV 文件：

```python
# 解析应用日志
for line in allApps_log:
    if "Iteration" in line:
        extract_iteration_time(line)
    if "Total time" in line:
        extract_total_time(line)

# 解析 DVFS 日志
for line in dvfs_log:
    extract_frequency(line)
    extract_power(line)
    extract_gpu_utilization(line)
    extract_bwUt(line)

# 计算指标
energy = sum(power * time)
efficiency = performance / energy
performance_loss = (baseline_time - current_time) / baseline_time
```

输出文件：
- `processed_<policy>.csv`：每次迭代的详细指标
- `avgIter_<policy>.csv`：按应用聚合的平均值和方差

#### 实验参数配置

在 `dvfs.c` 或 `dvfsPython.py` 中可以配置：

```c
// 机型配置
#define MACHINE RTX4070
#define MAX_FREQ 2475
#define MIN_FREQ 210
#define MEM_FREQ 7001

// Probing 配置
int probing_freqs[] = {2475, 2100, 1800, 1500, 1200};
int num_probing_freqs = 5;

// 时间参数
#define T1 15000  // Probing 周期（ms）
#define T2 200    // 采样间隔（ms）
#define M 5       // 每个频点采样次数

// 性能约束
double delta = 0.10;  // p90 对应 delta=0.10
```

### 4.2 论文原始结果（V100）

| 策略 | 能效提升 | 平均性能损失 | 最差性能损失 |
|------|----------|--------------|--------------|
| **GEEPAFS (δ=10%)** | **+26.7%** | **5.8%** | **12.5%** |
| EfficientFix | +43.9% | 13.8% | 34.7% |
| UtilizScale | +11.5% | 1.3% | 8.6% |
| NVboost | +0.4% | ~0% | ~0% |

### 4.3 RTX 4070 复现结果

**测试环境**：
- GPU：RTX 4070 Laptop (8GB GDDR6)
- CUDA：12.2
- 驱动：535.129.03
- 系统：Ubuntu 22.04 LTS
- 测试基准：CUDA Samples (BlackScholes, transpose, bandwidthTest 等)

**单任务场景（Assure vs MaxFreq）**：
- 能效提升：**0.4%~5.4%**
- 功耗降低：**6%~13%**（如 BlackScholes：75.25W → 70.55W，-6.2%）
- 性能损失：**3%~14%**（如 BlackScholes：376.5s → 389.5s，+3.5%）

**并发场景（Assure+SweetSpot）**：
- 能效提升：**15.1%**（170.88kJ → 145.10kJ）
- 功耗降低：**13.9%**（71.08W → 61.23W）
- 性能提升：**1.4%**（2404.28s → 2369.93s，总完成时间缩短）

**关键发现**：
- 单任务场景下，能效提升相对保守（0.4%~5.4%）
- 并发场景下，SweetSpot capping 通过减少争用阶段的无效高频运行，显著提升能效
- 某些访存密集型 benchmark（如 transpose、bandwidthTest）在 MaxFreq 下因显存争用反而耗时更长

**为什么 RTX 4070 的提升比 V100 小？**

| 因素 | V100 | RTX 4070 | 影响 |
|------|------|----------|------|
| 架构 | Volta (2017) | Ada Lovelace (2022) | 新架构的动态调频更智能 |
| Boost 机制 | 较简单 | GPU Boost 5.0 | NVIDIA 自带的 boost 已经很激进 |
| 功耗墙 | 300W TDP | 140W TDP (Laptop) | 功耗空间更小 |
| 频率范围 | 1530 MHz → 952 MHz | 2475 MHz → 1200 MHz | 可调节空间相对较小 |

RTX 4070 的 GPU Boost 5.0 已经在做类似的动态调频，GEEPAFS 的优势主要体现在**并发场景**和**长时间稳定运行**。

---

## 五、关键输出文件

| 文件 | 含义 | 用途 |
|------|------|------|
| `allApps_<policy>_*.out` | 每个基准的原始输出 + 时间戳 | 分析单个应用性能影响 |
| `dvfs_<policy>_*.out` | 守护进程日志：频率/功耗/利用率 | 观察策略决策过程 |
| `processed_*.csv` | 解析后的 per-app 指标 | 计算平均功耗、能效、性能损失 |
| `avgIter_*.csv` | 按应用聚合的均值 + 方差 | 绘制论文图表 |

---

## 六、复现经验与踩坑记录

### 6.1 硬件适配

**问题**：不同 GPU 的可设频点不同，需要修改 `dvfs.c` 中的频率参数。

**解决**：
```c
// 在 dvfs.c 中添加 RTX 4070 配置
#define MACHINE RTX4070
#ifdef RTX4070
  #define MAX_FREQ 2475
  #define MIN_FREQ 210
  #define PROBING_FREQS {2475, 2100, 1800, 1500, 1200}
  #define MEM_FREQ 7001  // 固定内存频率
#endif
```

**如何查询你的 GPU 支持的频率**：
```bash
# 查询支持的 SM 频率
nvidia-smi -q -d SUPPORTED_CLOCKS

# 查询当前频率
nvidia-smi -q -d CLOCK

# 测试设置频率（需要 root）
sudo nvidia-smi -lgc 1500  # 锁定 GPU 核心频率为 1500 MHz
```

### 6.2 权限问题

**问题**：NVML 调频需要 root 权限。

**解决方案 1：直接使用 sudo**
```bash
sudo ./dvfs mod Assure p90
# 或者配置 udev 规则允许普通用户调频
```

**解决方案 2：配置 udev 规则**（推荐用于开发环境）
```bash
# 创建 udev 规则文件
sudo nano /etc/udev/rules.d/99-nvidia-power.rules

# 添加以下内容
SUBSYSTEM=="pci", DRIVER=="nvidia", RUN+="/bin/chmod 666 /sys/bus/pci/devices/%k/power_state"

# 重新加载 udev 规则
sudo udevadm control --reload-rules
sudo udevadm trigger
```

### 6.3 采样精度限制

**问题**：GPUbwUt 分辨率只有 1%，限制了建模精度。

**影响**：
- 对于 GPUbwUt 变化较小的应用，模型拟合误差较大
- 频率调整延迟约 25ms，限制了 probing 速度

**缓解方法**：

1. **使用 DCGM 替代 NVML**（Python 版）：
```bash
# 安装 DCGM
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2004/x86_64/datacenter-gpu-manager_3.1.7_amd64.deb
sudo dpkg -i datacenter-gpu-manager_3.1.7_amd64.deb

# 启动 DCGM
sudo nv-hostengine

# 使用 Python 版 DVFS
sudo python3 dvfsPython.py Assure 90
```

2. **增加采样次数 M**：
```c
#define M 10  // 从 5 增加到 10，提高统计稳定性
```

3. **延长 probing 周期 T1**：
```c
#define T1 30000  // 从 15s 增加到 30s，适合长任务
```

### 6.4 短任务不适用

**问题**：Probing 阶段会引入 1.5%–4.5% 的性能开销。

**适用场景判断**：

| 任务执行时间 | 是否适用 GEEPAFS | 原因 |
|-------------|-----------------|------|
| < 1 秒 | ❌ 不适用 | Probing 开销占比过大 |
| 1-10 秒 | ⚠️ 谨慎使用 | 需要调整 T1 参数 |
| 10-60 秒 | ✅ 适用 | 默认参数即可 |
| > 60 秒 | ✅ 强烈推荐 | Probing 开销可忽略 |

**针对短任务的优化**：
```c
// 对于 10-60 秒的任务，减少 probing 频率
#define T1 5000   // 缩短到 5s
#define M 3       // 减少采样次数
int probing_freqs[] = {2475, 1800, 1200};  // 只探测 3 个频点
```

### 6.5 并发场景的特殊处理

**问题**：多个 GPU 任务并发时，资源争用会影响性能建模。

**解决方案**：SweetSpot Capping

在并发场景下，GEEPAFS 可以结合 SweetSpot 策略：
- 在争用阶段：降低频率，减少无效的高频运行
- 在独占阶段：恢复正常的 Assure 策略

```c
// 检测是否有并发任务
if (gpu_utilization > 90 && num_processes > 1) {
    // 使用 SweetSpot 频率（能效最优点）
    target_freq = SWEETSPOT_FREQ;
} else {
    // 使用 Assure 策略
    target_freq = compute_assure_freq();
}
```

### 6.6 调试技巧

**查看实时日志**：
```bash
# 实时查看 DVFS 决策
tail -f output/dvfs_Assure_*.out

# 实时查看应用输出
tail -f output/allApps_Assure_*.out
```

**验证频率设置是否生效**：
```bash
# 在另一个终端监控频率变化
watch -n 0.5 nvidia-smi
```

**分析性能瓶颈**：
```bash
# 使用 nvprof 分析应用特征
nvprof --metrics achieved_occupancy,gld_efficiency,gst_efficiency ./your_app

# 查看内存带宽利用率
nvidia-smi dmon -s u
```

---

## 七、实践启示与批判性思考

### 7.1 何时使用 GEEPAFS

**适合的场景**：
- 长时间运行的训练任务（数小时到数天）
- 数据中心批处理作业
- 多租户云平台（需要能耗控制）
- 功耗受限的边缘设备（如 RTX 4070 Laptop）

**不适合的场景**：
- 实时推理服务（延迟敏感）
- 短时间任务（< 1 分钟）
- 需要极致性能的场景（如竞赛）

### 7.1.5 GEEPAFS 的本质局限

**为什么只适合长任务？**

GEEPAFS 的核心是"在线建模"，这意味着它需要时间来"学习"应用的特征：

1. **Probing 开销**：每个周期 T1（15秒）需要探测 5 个频点，每个频点采样 M 次（5次），总开销约 1.5-4.5%
2. **模型收敛时间**：前几个周期的模型可能不准确，需要 2-3 个周期才能稳定
3. **频率切换延迟**：每次调频需要 ~25ms，频繁切换会引入额外开销

**计算最小适用时间**：
```
最小任务时间 = T1 × 3 / (1 - overhead)
             = 15s × 3 / (1 - 0.045)
             ≈ 47 秒
```

对于 < 1 分钟的任务，probing 开销占比过大，得不偿失。

**与 NVIDIA Boost 的本质区别**：

| 维度 | NVIDIA Boost | GEEPAFS |
|------|--------------|---------|
| **决策依据** | 温度、功耗墙 | 性能模型（GPUbwUt） |
| **目标** | 最大化性能 | 平衡能效与性能 |
| **可控性** | 黑盒，用户无法干预 | 白盒，可设置 δ 阈值 |
| **适用场景** | 通用 | 长时间、能耗敏感 |
| **开销** | 无 | 1.5-4.5% |

NVIDIA Boost 是"尽力而为"的性能优化，GEEPAFS 是"性能保障下的能效优化"。两者目标不同，不是替代关系。

**生产环境部署的可行性分析**：

✅ **可行的场景**：
- 云平台批处理作业（如 AWS Batch、Google Cloud Dataflow）
- 深度学习训练集群（如 Kubernetes + GPU Operator）
- HPC 作业调度系统（如 Slurm）

❌ **不可行的场景**：
- 在线推理服务（延迟敏感，无法容忍 probing 开销）
- 多租户共享 GPU（MIG 模式下 NVML 权限受限）
- 需要实时响应的应用（如游戏、实时渲染）

**部署建议**：
1. 与调度器集成，只对长任务启用 GEEPAFS
2. 预先对常见应用做 profiling，缓存模型参数
3. 提供 Web UI 让用户自主选择策略和 δ 值

### 7.2 参数调优建议

| 参数 | 推荐值 | 说明 |
|------|--------|------|
| δ（性能约束） | 5%–30% | 越小越保守，能效提升越少 |
| T1（probing 周期） | 15s | 长任务可增大，减少开销 |
| T2（采样间隔） | 200ms | 受限于 GPU 调频延迟 |
| M（采样次数） | 5–10 | M·T2/T1 ≪ 1 |

### 7.3 与其他优化手段的结合

GEEPAFS 可以与以下技术结合使用：
- **混合精度训练**：降低计算强度，进一步提升能效
- **梯度累积**：减少通信开销，提高 GPU 利用率
- **模型并行**：多 GPU 场景下的能效优化
- **CPU/内存 DVFS**：系统级能效优化

---

## 八、未来改进方向

### 8.1 论文提出的方向

1. **扩展到大规模集群**：支持多节点、多 GPU 的协同调频
2. **支持 CPU/内存 DVFS**：系统级能效优化
3. **多实例 GPU（MIG）**：A100/H100 的 MIG 模式下的能效优化

### 8.2 实践中的改进空间

1. **自适应 δ 调整**：根据任务类型自动选择性能约束
   - 训练任务：δ = 10-20%（容忍更多性能损失）
   - 推理任务：δ = 5%（严格性能要求）
   - 批处理：δ = 30%（最大化能效）

2. **更精细的建模**：考虑温度、功耗墙等因素
   - 当前模型假设频率-性能关系稳定，但实际上会受温度影响
   - 可以引入温度作为额外特征，构建三维模型

3. **与调度器集成**：在 Kubernetes/Slurm 中自动应用 DVFS 策略
   ```yaml
   # Kubernetes Pod Annotation 示例
   apiVersion: v1
   kind: Pod
   metadata:
     annotations:
       gpu.dvfs.policy: "Assure"
       gpu.dvfs.delta: "0.10"
   ```

4. **用户友好的工具**：提供 Web UI 或命令行工具，简化配置
   - 实时监控：频率、功耗、能效曲线
   - 策略对比：不同策略的能效/性能对比
   - 参数推荐：根据历史数据推荐最优 δ 值

5. **缓存机制**：对常见应用预先建模
   - 第一次运行时保存模型参数
   - 后续运行直接加载，跳过 probing 阶段
   - 可以减少 50% 以上的开销

---

## 九、总结与个人思考

GEEPAFS 提供了一种**应用透明、性能可控**的 GPU 能效优化方案，通过在线建模和动态调频，在保证性能的前提下显著降低功耗。

**核心优势**：
- ✅ 无需修改应用代码
- ✅ 无需离线 profiling
- ✅ 性能损失可控（平均 < 6%）
- ✅ 能效提升显著（20%–27%）

**适用场景**：
- 长时间运行的训练任务
- 数据中心批处理作业
- 功耗受限的边缘设备

**复现建议**：
- 根据 GPU 型号调整频率参数
- 使用 DCGM 提高采样精度
- 根据任务特点调整 δ 和 T1

### 个人思考

在复现 GEEPAFS 的过程中，我有几点深刻体会：

1. **"应用透明"是双刃剑**：
   - 优点：无需修改代码，部署简单
   - 缺点：无法利用应用的先验知识（如训练的 epoch 数、batch size）
   - 如果能让应用主动告知"我现在进入推理阶段了"，模型会更准确

2. **GPUbwUt 不是万能的**：
   - 对于 memory-bound 的应用，GPUbwUt 确实是性能的良好代理
   - 但对于 compute-bound 的应用（如矩阵乘法），GPU 利用率可能更准确
   - 未来可以考虑多指标融合建模

3. **在线建模的局限性**：
   - 当前的折线模型假设应用行为稳定，但实际上很多应用是分阶段的
   - 例如训练的前向传播和反向传播特征不同，但 GEEPAFS 会把它们平均
   - 可以考虑引入"阶段检测"机制，为不同阶段建立不同模型

4. **能效优化的未来**：
   - GPU 能效优化不应该只关注频率，还应该考虑：
     - 内存频率（GEEPAFS 固定了内存频率）
     - 电压调节（更激进的 DVFS）
     - 任务调度（避免资源争用）
   - 系统级的能效优化（CPU + GPU + 内存）可能带来更大收益

5. **从研究到生产的鸿沟**：
   - 论文在 V100/A100 上验证，但实际部署时会遇到各种问题：
     - 权限管理（谁能调频？）
     - 多租户隔离（如何避免互相干扰？）
     - 故障恢复（如果 DVFS 守护进程崩溃怎么办？）
   - 这些工程问题往往比算法本身更难解决

总的来说，GEEPAFS 是一个优秀的研究工作，但要真正落地还需要更多工程化的努力。希望这篇博客能帮助更多人理解和复现这个工作。

---

## 参考资料

- **论文**：Improving GPU Energy Efficiency through an Application-transparent Frequency Scaling Policy with Performance Assurance (EuroSys '24)
- **代码**：https://github.com/zyjopensource/geepafs
- **我的复现**：https://github.com/Redem714233/Research-on-accelerating-computations-on-GPUs-through-DVFS

---

*本文基于论文阅读和实际复现经验整理，如有疑问欢迎交流。*
