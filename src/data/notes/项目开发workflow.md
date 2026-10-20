---
title: "项目开发workflow"
description: ""
pubDate: 2026-10-18
tags: []
---
# 项目级插件
我使用`just`来自定义指令，并且通过自定义加载的neovim lua文件来完成对不同项目的定制化，
例如，在LeRobot项目中，我使用如下配置：

- `justfile`:
```bash
in:
  grep -n 'lerobot-' pyproject.toml | nvim -c 'luafile .zsm_conf/config.lua' -c 'set ft=toml' -c 'set buftype=nofile' -
```
> 使用`just in`打开toml文件，并加载config.lua, 自动配置跳转快捷键

- `.zsm_conf/config.lua`:
```lua
local function preview_stack_trace()
	local prj_root = vim.fs.root(0, ".git")
	local line = vim.api.nvim_get_current_line()
	local pattern = '="([^:]+):([^"]+)"'
	local path, symbol = string.match(line, pattern)
	if path and symbol then
		path = prj_root .. "/src/" .. string.gsub(path, "%.", "/") .. ".py"
		print(path .. ":" .. symbol)
		vim.cmd("e " .. path)
		vim.fn.cursor(1, 1)
		local lnum = vim.fn.search("def " .. symbol, "w")
		if lnum == 0 then
			vim.notify(symbol .. " not found")
		end
	end
end

vim.keymap.set("n", "<CR>", function()
	preview_stack_trace()
end, { silent = true, noremap = true, buffer = true })
```
> 在toml文件中，使用回车快速跳转。
> `vim.keymap.set()`的`option`中，配置`buffer = true`把快捷键锁定到当前文件

- `.nvim.lua`
```lua
local function setup_lerobot_keymap()
	local prj_root = vim.fs.root(0, ".git")
	local filename = vim.api.nvim_buf_get_name(0)
	if filename ~= prj_root .. "/pyproject.toml" then
		return
	end

	dofile(prj_root .. "/.zsm_conf/config.lua")
end

vim.api.nvim_create_autocmd("BufEnter", {
	group = vim.api.nvim_create_augroup("LerobotEntrypoints", { clear = true }),
	pattern = "pyproject.toml",
	callback = setup_lerobot_keymap,
})

setup_lerobot_keymap()
```
> 也可以考虑使用`.nvim.lua`，自定义`filetype`并使用`autocmd`来完成更灵活的配置

# 快捷键配置
可以约定使用`<leader>p`作为项目快捷键，并且给`which-key`配置分组

# FZF
使用`c-t` 或者`** tab` 搜索文件
使用`c-r` 搜索指令

# TODO
- [ ] agent能否输出neovim的jumplist?
- [ ] 使用direnv管理开发环境