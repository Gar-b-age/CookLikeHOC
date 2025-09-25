import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const EXCLUDED_DIRS = new Set([
  '.git',
  '.github',
  '.vitepress',
  'node_modules',
  'public',
]);

function isDirectory(p) {
  return fs.existsSync(p) && fs.statSync(p).isDirectory();
}

function isMarkdown(p) {
  return (
    fs.existsSync(p) &&
    fs.statSync(p).isFile() &&
    path.extname(p).toLowerCase() === '.md'
  );
}

function sortByPinyinOrName(a, b) {
  return a.localeCompare(b, 'zh-Hans-CN-u-co-pinyin');
}

function titleFromName(name) {
  return name.replace(/\.md$/i, '');
}

function getTitleFromFile(filePath) {
  if (!fs.existsSync(filePath)) return titleFromName(path.basename(filePath));
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  for (const line of lines) {
    if (line.startsWith('# ')) {
      let title = line.substring(2).trim();
      title = title.replace(/\{#nav\}/g, '').trim();
      return title;
    }
  }
  return titleFromName(path.basename(filePath));
}

function buildIndexContent(dirName, files, isEn = false, dirPath = '') {
  const header = `# ${dirName}\n\n<!-- AUTO-GENERATED: index for ${dirName}. Edit source files instead. -->\n\n`;
  if (files.length === 0)
    return header + (isEn ? 'No entries yet.\n' : '（暂无条目）\n');
  const list = files
    .sort(sortByPinyinOrName)
    .map((f) => {
      const filePath = path.join(dirPath, f);
      const title = getTitleFromFile(filePath);
      return `- [${title}](${encodeURI('./' + f)})`;
    })
    .join('\n');
  return header + list + '\n';
}

function shouldOverwriteExisting(readmePath) {
  if (!fs.existsSync(readmePath)) return true;
  const content = fs.readFileSync(readmePath, 'utf8');
  // 仅覆盖带有标记的自动生成文件，避免覆盖人工维护的索引
  return content.includes('AUTO-GENERATED: index');
}

function processDirectory(dirPath, dirName, isEn, changedRef) {
  const entries = fs.readdirSync(dirPath);
  const files = entries
    .filter((f) => isMarkdown(path.join(dirPath, f)))
    .filter(
      (f) => f.toLowerCase() !== 'readme.md' && f.toLowerCase() !== 'index.md'
    )
    .sort(sortByPinyinOrName);

  const readmePath = path.join(dirPath, 'README.md');
  if (shouldOverwriteExisting(readmePath)) {
    const content = buildIndexContent(dirName, files, isEn, dirPath);
    fs.writeFileSync(readmePath, content, 'utf8');
    changedRef.count++;
  }

  const subDirs = entries
    .filter((e) => isDirectory(path.join(dirPath, e)))
    .filter((e) => !EXCLUDED_DIRS.has(e) && !e.startsWith('.'))
    .sort(sortByPinyinOrName);

  for (const subDir of subDirs) {
    const subDirPath = path.join(dirPath, subDir);
    const subIsEn = isEn || subDir === 'en';
    processDirectory(subDirPath, subDir, subIsEn, changedRef);
  }
}

function main() {
  const entries = fs.readdirSync(ROOT);
  const dirs = entries
    .filter((e) => isDirectory(path.join(ROOT, e)))
    .filter((e) => !EXCLUDED_DIRS.has(e) && !e.startsWith('.'))
    .sort(sortByPinyinOrName);

  const changedRef = { count: 0 };
  for (const dir of dirs) {
    const isEn = dir === 'en';
    processDirectory(path.join(ROOT, dir), dir, isEn, changedRef);
  }
  console.log(`[generate-indexes] updated ${changedRef.count} index file(s).`);
}

main();
