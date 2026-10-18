---
title: "项目开发workflow"
description: ""
pubDate: 2026-10-18
tags: []
---
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
function preview_stack_trace()
	local line = vim.api.nvim_get_current_line()
	local pattern = '="([^:]+):([^"]+)"'
	local path, symbol = string.match(line, pattern)
	if path and symbol then
		path = "src/" .. string.gsub(path, "%.", "/") .. ".py"
		print(path .. ":" .. symbol)
		pcall(vim.cmd("e " .. path))
		vim.fn.cursor(1, 1)
		local lnum = vim.fn.search("def main", "w")
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

也可以考虑使用`.nvim.lua`，自定义`filetype`并使用`autocmd`来完成更灵活的配置