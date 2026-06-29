import fs from "node:fs/promises";
import https from "node:https";
import path from "node:path";

const API_KEY = process.env.OBSIDIAN_API_KEY;
const BASE_URL = process.env.OBSIDIAN_BASE_URL || "https://127.0.0.1:27124";
const OUT_DIR = path.resolve("src/content/posts/obsidian");
const PUBLISHED_DATE = process.env.OBSIDIAN_IMPORT_DATE || "2026-06-29";

if (!API_KEY) {
	throw new Error("OBSIDIAN_API_KEY is required");
}

const agent = new https.Agent({ rejectUnauthorized: false });

function requestJson(url) {
	return request(url).then((text) => JSON.parse(text));
}

function request(url) {
	return new Promise((resolve, reject) => {
		const req = https.get(
			url,
			{
				agent,
				headers: {
					Authorization: `Bearer ${API_KEY}`,
				},
			},
			(res) => {
				let data = "";
				res.setEncoding("utf8");
				res.on("data", (chunk) => {
					data += chunk;
				});
				res.on("end", () => {
					if (res.statusCode >= 200 && res.statusCode < 300) {
						resolve(data);
						return;
					}
					reject(new Error(`HTTP ${res.statusCode}: ${data}`));
				});
			},
		);
		req.on("error", reject);
		req.end();
	});
}

function encodeVaultPath(filePath) {
	return filePath
		.split("/")
		.map((part) => encodeURIComponent(part))
		.join("/");
}

function stripFrontmatter(markdown) {
	if (!markdown.startsWith("---\n")) return { frontmatter: {}, body: markdown };
	const end = markdown.indexOf("\n---", 4);
	if (end < 0) return { frontmatter: {}, body: markdown };

	const raw = markdown.slice(4, end).trim();
	const body = markdown.slice(end + 4).replace(/^\r?\n/, "");
	const frontmatter = {};

	for (const line of raw.split(/\r?\n/)) {
		const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
		if (!match) continue;
		const [, key, value] = match;
		frontmatter[key] = value.replace(/^['"]|['"]$/g, "");
	}

	return { frontmatter, body };
}

function titleFromPath(filePath) {
	return path.posix.basename(filePath, path.posix.extname(filePath));
}

function slugify(title, usedSlugs) {
	const normalized = title
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/c\+\+/g, "cpp")
		.replace(/node\.?js/g, "node-js")
		.replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
		.replace(/^-+|-+$/g, "");

	let slug = normalized || "post";
	let i = 2;
	while (usedSlugs.has(slug)) {
		slug = `${normalized || "post"}-${i}`;
		i += 1;
	}
	usedSlugs.add(slug);
	return slug;
}

function yamlString(value) {
	return JSON.stringify(String(value ?? ""));
}

function yamlList(values) {
	if (!values.length) return "[]";
	return `[${values.map((value) => yamlString(value)).join(", ")}]`;
}

function descriptionFromBody(body) {
	const plain = body
		.replace(/^>\s*图片附件缺失：.*$/gm, " ")
		.replace(/图片附件缺失：[^）\n]+（[^）]+）/g, " ")
		.replace(/```[\s\S]*?```/g, " ")
		.replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
		.replace(/\[[^\]]+\]\([^)]+\)/g, (match) => match.replace(/^\[|\]\([^)]+\)$/g, ""))
		.replace(/[#>*_`|~\-\[\]()]/g, " ")
		.replace(/\s+/g, " ")
		.trim();
	return plain.slice(0, 140);
}

function inferTags(title) {
	const rules = [
		["Docker", /docker|minio|jenkins/i],
		["Linux", /linux|ubuntu|arm|nvidia|cuda|jdk/i],
		["Windows", /windows|win10|win11|wsl|c盘|系统盘/i],
		["C++", /c\+\+|cmake|opencv|boost|freetype|eigen|mysql事务|mysql配置/i],
		["Python", /python|pycharm|pyinstaller|anaconda|jupyter|paddleocr/i],
		["Java", /java|spring|springboot|maven|jdk|kafka/i],
		["MySQL", /mysql|数据库/i],
		["Nginx", /nginx/i],
		["AI", /yolo|mxnet|模型|图像|albumentations|paddleocr/i],
		["流媒体", /ffmpeg|rtsp|webrtc|mediamtx|zlmediakit|wvp|gb28181/i],
		["工具", /vscode|adb|notion|codex|claudecode|远程|gitee|npm/i],
	];
	return rules.filter(([, pattern]) => pattern.test(title)).map(([tag]) => tag);
}

function inferCategory(tags) {
	if (tags.includes("AI")) return "AI";
	if (tags.includes("流媒体")) return "音视频";
	if (tags.some((tag) => ["Docker", "Linux", "Windows", "Nginx"].includes(tag))) {
		return "运维部署";
	}
	if (tags.some((tag) => ["Java", "C++", "Python", "MySQL"].includes(tag))) {
		return "开发笔记";
	}
	return "技术笔记";
}

function convertWikiLinks(body, titleToSlug) {
	return body.replace(/!?\[\[([^\]]+)\]\]/g, (match, inner) => {
		const isEmbed = match.startsWith("!");
		const [targetRaw, labelRaw] = inner.split("|");
		const target = targetRaw.trim();
		const label = (labelRaw || target).trim();
		const ext = path.posix.extname(target).toLowerCase();

		if (isEmbed) {
			return ext.match(/\.(png|jpe?g|gif|webp|avif|svg)$/)
				? `![${label}](./${target})`
				: `[${label}](${target})`;
		}

		const targetTitle = titleFromPath(target);
		const slug = titleToSlug.get(targetTitle);
		if (!slug) return label;
		return `[${label}](/posts/obsidian/${slug}/)`;
	});
}

function replaceLocalImageReferences(body) {
	return body.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, target) => {
		if (/^(https?:)?\/\//i.test(target) || target.startsWith("/")) return match;
		return `> 图片附件缺失：${decodeURIComponent(target)}${alt ? `（${alt}）` : ""}`;
	});
}

async function main() {
	const listUrl = `${BASE_URL.replace(/\/$/, "")}/vault/`;
	const { files } = await requestJson(listUrl);
	const markdownFiles = files
		.filter((file) => file.endsWith(".md"))
		.filter((file) => !file.startsWith("All-in-RAG/"))
		.sort((a, b) => a.localeCompare(b, "zh-CN"));

	const usedSlugs = new Set();
	const records = markdownFiles.map((file) => {
		const title = titleFromPath(file);
		return { file, title, slug: slugify(title, usedSlugs) };
	});
	const titleToSlug = new Map(records.map((record) => [record.title, record.slug]));

	await fs.mkdir(OUT_DIR, { recursive: true });

	for (const record of records) {
		const noteUrl = `${BASE_URL.replace(/\/$/, "")}/vault/${encodeVaultPath(record.file)}`;
		const raw = await request(noteUrl);
		const { frontmatter, body } = stripFrontmatter(raw.replace(/\r\n/g, "\n"));
		const convertedBody = replaceLocalImageReferences(convertWikiLinks(body, titleToSlug)).trim();
		const tags = inferTags(record.title);
		const category = inferCategory(tags);
		const published = frontmatter.published || frontmatter.date || PUBLISHED_DATE;
		const description = frontmatter.description || frontmatter.summary || descriptionFromBody(convertedBody);

		const content = `---
title: ${yamlString(frontmatter.title || record.title)}
published: ${published}
description: ${yamlString(description)}
image: ""
tags: ${yamlList(tags)}
category: ${yamlString(category)}
draft: false
lang: "zh-CN"
---

${convertedBody}
`;

		await fs.writeFile(path.join(OUT_DIR, `${record.slug}.md`), content, "utf8");
	}

	console.log(`Imported ${records.length} Obsidian notes into ${OUT_DIR}`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
