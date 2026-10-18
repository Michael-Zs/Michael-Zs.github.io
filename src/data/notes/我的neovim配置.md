---
title: "我的Neovim配置"
description: ""
pubDate: 2026-10-17
tags: []
---
Repo: https://github.com/Michael-Zs/nvim.git

加入我自己写的插件 `waymark.nvim` 实现基于位置的跳转列表

自动从项目根目录加载`.nvim.lua`

# Recipe
## 文件记忆跳转，stack_trace
使用`V<leader>number`来设置某个位置，
使用`<leader>number`来快速返回
> 也可使用`<leader>zz`来添加更多位置，`]z`和`[z`来遍历

## 快速对照，分屏
使用`\x`弹出菜单选择分屏文件, `\c`toggle分屏

## 快速跳转symbol
使用`\v`toggle侧边symbol list
使用`<leader>v` 用picker选择symbol跳转

## 善用tab
使用`Tab Tab`创建tab
使用`<leader>,`和`<leader>.`来切换tab