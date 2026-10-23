---
title: "robot-learning"
description: ""
pubDate: 2026-10-23
tags: []
---
![](attachments/Pasted%20image%2020261023210506.png)

- [ ] motion tracking

[人形算法](https://www.bilibili.com/video/BV1CNfzBbEY5/?spm_id_from=333.337.search-card.all.click&vd_source=e2845475854f731bb7132d922cd543d8)
[同济子豪兄教程](https://zihao-ai.feishu.cn/wiki/Q6Gbw9GMPiZQd8kjqz7cpB2Nn4c?fromScene=spaceOverview)

retargeting: 人动捕数据重映射到机器人（GMR算法
DeepMimic!!!!这个值得看
大小两个模型来, RGMT?

## Motion Tracking:
1. 采集数据，遥操作数据
2. 重定向（Retargeting），人类坐标映射到机器人，获得机器人的reference motion(GMR算法)
3. 在仿真环境训练强化学习算法（DeepMimic, AMP)
4. sim2real

> 可用开源方案：BeyondMimic, OmniRetarget, PH Parkour, HumanX
> Hiking in the Wild(类似PH Parkour)
> Deep Whole-Body Parkour
> Robot Parkour Learning

# 具身3流派：
Motion Tracking
VLA
世界模型（特斯拉FSD
