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

## 参数介绍：
policy, robot

# TODO:
- [ ] lerobot代码，看policy, robot, dataset 定义
- [ ] 仿真测试，使用学校电脑
- [ ] 看论文？别人是怎么做的
- [ ] lerobot如何二次开发，看课题组基于lerobot的工作是怎样的