import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const title = process.argv[2];
if (!title) {
	console.error('Usage: npm run new -- "Note title"');
	process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);

const slug =
	title
		.trim()
		.toLowerCase()
		.replace(/[^\p{L}\p{N}]+/gu, "-")
		.replace(/(^-|-$)/g, "") || `note-${today.replace(/-/g, "")}`;

const path = resolve(`src/data/notes/${slug}.md`);

await writeFile(
	path,
	`---
title: "${title}"
description: ""
pubDate: ${today}
tags: []
---

`,
);

console.log(`Created ${path}`);
