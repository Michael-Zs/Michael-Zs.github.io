---
title: LeRobot-学习
description: lerobot note
pubDate: 2026-10-16
tags: []
---
![](attachments/Pasted%20image%2020261017010309.png)

# startup
## 安装
```bash
git clone https://github.com/huggingface/lerobot.git
cd lerobot
uv sync --locked
```

> uv 两个安装路径：
> `~/.cache/uv/` （ `uv cache dir`, uv缓存
> `.venv/`

# 开发
## Python 里：三种加载方式
```python
from lerobot.datasets import LeRobotDataset

# 方式一：用 Hub repo_id（首次自动下载，之后读缓存）—— 你已经会了
ds = LeRobotDataset("lerobot/pusht")

# 方式二：加载本地目录（自己录的数据就是这样）
ds = LeRobotDataset("my_user/my_task", root="path/to/dataset_dir")

# 方式三：带历史窗口加载（策略需要观察历史时用，比如"过去 2 帧 + 当前帧"）
ds = LeRobotDataset(
    "lerobot/pusht",
    delta_timestamps={"observation.image": [-0.1, 0.0]},  # 0.1s 前和现在
)
```

## 看结构：dataset.meta 的关键属性
```python
ds.meta.total_episodes   # 206
ds.meta.total_frames     # 25650
ds.meta.fps              # 10
ds.meta.features         # 每个特征的 dtype/shape ← 上轮打印过的那张表
ds.meta.tasks            # 任务描述 DataFrame
ds.meta.stats            # 各特征的统计量（归一化的来源）
ds.episode_data_index    # episode 边界（episode 0 从第几帧到第几帧）
```
> meta数据也存放在`~/.cache/huggingface/lerobot/hub/datasets--lerobot--pusht/snapshots/b1c3ecbae7f244acc039a3dbc255a00dad1372b9/meta`

## 取数据：`dataset[i] 返回一帧的 dict`
```python
sample = ds[0]
sample["observation.image"]   # torch.Tensor [3, 96, 96] float32
sample["observation.state"]   # torch.Tensor [2]
sample["action"]              # torch.Tensor [2]
sample["timestamp"]           # 这帧的时间戳
sample["task"]                # 任务描述字符串
```
> 一个实用细节：`ds[0]` 是第一个 episode 的第一帧；想遍历某个 episode 的所有帧，用 `ds.episode_data_index["from"][ep]` 到 `"to"[ep]` 的范围索引。
## 数据可视化
```bash
uv sync --locked --extra dataset_viz --extra training --extra pusht # 安装依赖
uv run lerobot-dataset-viz --repo-id lerobot/pusht --episode-index 0
```
>使用rerun

![](attachments/Pasted%20image%2020261017150154.png)
# 训练自己的模型
## 一般流程：
> setup-motors
> calibrate
> teleoperate
> record
> train
> replay：录制动作重放
> eval：测试评估
> rollout

使用以下来看`lerobot-*`命令的入口文件
```bash
grep -n 'lerobot-' pyproject.toml | nvim -c 'set ft=toml' -c 'set buftype=nofile' -
```

## 代码架构：
policy存放在`src/lerobot/policies/`下
configuration（各种超参数）存放在对应policy文件夹里的configuration_xxx.py里

- grep 的四个姿势（比“全局搜索”精确得多）
```bash
# ① 找定义：锚定 class/def 前缀
grep -rn "class PI05Policy" src/
grep -rn "def select_action" src/

# ② 找调用方（反向追踪，最常用！）：
#    注意前面的点——搜"方法被调用"，而不是"方法被定义"
grep -rn "\.select_action(" src/

# ③ 只看分布，不进细节：先看命中哪些文件，再挑一个深入
grep -rln "predict_action_chunk" src/

# ④ 排除噪音
grep -rn "make_policy" src/ --include="*.py" | grep -v test
② 是核心技能：看懂一个方法的最好方式是看它的调用方——调用处展示了“期望它干什么”。
```

### policy
一个文件夹存放一个policy
```bash
configuration_* # 超参数
modeling_* # 网络
processor_* # 数据变换
factory.py # 字符串->类 翻译
```

架构参考：
- @docs/source/bring_your_own_policies.mdx (policy文档)
- @src/lerobot/policies/pretrained.py (policy父类)

### Stack Trace
关键概念有policy, strategy
rollout -> Strategy -> policy

**robot.get_observation->observation_processor->obs_processed**
> @src/lerobot/rollout/strategies/base.py:71

**processed_obs->policy->action->action_processor->robot.send_action**
> @src/lerobot/rollout/strategies/core.py:430-431

---
## 参数介绍

policy, robot


---
# TODO:
- [ ] lerobot代码，看policy, robot, dataset 定义
- [ ] 仿真测试，使用学校电脑
- [ ] 看论文？别人是怎么做的
- [ ] lerobot如何二次开发，看课题组基于lerobot的工作是怎样的
- [ ] 笔记，config，policy，processor

> lerobot有哪些policy？
> 如果仅仅使用已有的policy，那岂不是没有任何策略的进步，如何二次开发
> 改 config：chunk_size、学习率、backbone、图像增强……同一策略行为大变
> Processor 积木：我们之前看过的 inverse_kinematics_ee_to_joints、相对动作转换、图像变换——都是不碰 policy 内部就能改变系统行为的机制。比如“ACT + EE pose action space”就是用现成积木拼出来的新组合
> 
> config有什么用？

> 一个值得注意的 strategy：dagger
> 它把我们最早聊的复合误差问题变成了采集方案：policy 自己跑，人只在它要犯错时介入修正——修正的那段轨迹恰好是“分布外状态下的正确动作”，正是缓解 distribution shift 最值钱的数据。部署、监控、采数据、再训练在这个模式下形成闭环。

> 先看`rollout`，看到使用`create_strategy`，然后下面使用了`strategy.run(ctx)`, 这一定是重点，于是看`create_strategy`的定义->`BaseStrategy(RolloutStrategy)`，在里面找到了`.run方法`，里面`action=send_next_action(obs)`往里找到发现使用`action_tensor = engine.get_action(obs_frame)`，而`engine`在函数中使用：`engine = ctx.policy.inference`获取，
> 所以得到了最终的stack_trace:`ctx.policy.inference.get_action(obs)`
> 于是返回看，看base的setup:`self._init_engine(ctx)`，无，所以再往上一层：ctx来自`build_rollout_context`，终于找到：@src/lerobot/rollout/inference/sync.py:109
> `action = self._policy.select_action(observation)`
