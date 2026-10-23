---
title: "我的Neovim配置"
description: ""
pubDate: 2026-10-17
tags: []
---
Repo: https://github.com/Michael-Zs/nvim.git

加入我自己写的插件 `waymark.nvim` 实现基于位置的跳转列表

自动从项目根目录加载`.nvim.lua`

# 最小快捷键
JK to scroll
jf to esc

`c-w T` 将当前窗口在新tab打开, `c-w c-q` 退出窗口
`<leader>sp` 快速搜索打开项目

`<leader>sw` 快速搜索单词（可选中搜索

`gao`, `gai` 看函数调用和被调用

mini.ai
使用`vab`选中括号，继续按下ab选择下一个括号/上层括号
`vaq`选中quotes
还可以组合，`valq`， `vanq` 选择上一个，下一个quote

在使用grep的时候，可以使用"pattern -- glob"的方法来指定搜索
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
在打开分屏文件后，使用`c-w T`来把文件放入新tab

## quickfix
在搜索，picker中，使用`tab`多选，`C-q`加入quickfix列表，
`<leader>xq <leader>xQ <leader>sq`

例如:
`<leader>sb` 或者 `<leader>/` 搜索文字，
使用`tab`多选，`C-q`加入quickfix
然后就可以使用`]q`遍历了

## 跳转阅读
使用waymark的q来记录主分支，关键位置标记
使用waymark的r，e，w来记录暂时stack trace，跳转到更深层前记录
在一个文件探索时，使用mark，例如ma来记录重要位置，快速跳转
从主分支切换的时候，可以使用
使用`<leader>num`跳转文件，`<leader>shift num`跳转精确位置

# waymark
可以把它当成一个树来使用，
先设置最基本的123，然后需要深入的时候，直接`<leader>zz`添加，看完回去把多余的新增的树分支删掉，继续主线
 当跳转不再线形，也可使用其他markset来辅助，例如直接`<leader>zr`添加，使用`<leader>]r`来浏览
 mindset: 主线q有结构，树状，分支使用完就删。其他markset，例如r，直接随便使用，无结构，用于快速跳转，减轻记忆负担