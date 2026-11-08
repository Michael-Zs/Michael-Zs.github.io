---
title: "Python学习"
description: ""
pubDate: 2026-10-20
tags: []
---
# ABC抽象基类
接口是一个类需要对外暴露的功能（函数）集合
当需要定义接口的时候，也就是需要强制类实现某些方法的时候，就要使用ABC
```python
import abc

class Vehicle(abc.ABC):
	@abc.abstractmethod
	def setSpeed(self, speed: Vec3):
		print(f"set speed: {speed}")
		
class Car(Vehicle):
	pass # 无法实例化，因为强制实现的setSpeed没有实现
	
class Bicycle(Vehicle): # 实现了抽象方法，可以实例化
	def setSpeed(self, speed):
		print(f"Bicycle set speed")
		super().setSpeed(speed)
```

在探索项目的时候，可以从__init__.py入手，这是package的入口

# UV
```bash
uv venv --python 3.12
uv sync
uv lock
uv pip install -r requirements.txt
uv add xxxpackage
uvx xxx # 临时运行，类似npx

uv init --script main.py # 初始已有化脚本，开头创建dependencies
uv run main.py # 便会自动安装依赖运行


# 创建最小的 pyproject.toml，已有这个文件就跳过
uv init --bare
# 将 requirements.txt 中的依赖写进 pyproject.toml
uv add -r requirements.txt
```

```bash
pip freeze > requirements.txt
```