import fs from "node:fs";
import path from "node:path";

export type SidebarItem = {
  text: string;
  link?: string;
  items?: SidebarItem[];
};
export type Sidebar = Record<string, SidebarItem[]>;

const DOC_EXT = [".md"];
const EXCLUDED_DIRS = new Set([
  ".git",
  ".github",
  ".vitepress",
  "node_modules",
  "public",
  "en", // 排除 en 目录，避免在中文版导航中显示
]);

function isDirectory(p: string) {
  return fs.existsSync(p) && fs.statSync(p).isDirectory();
}

function isMarkdown(p: string) {
  return (
    fs.existsSync(p) &&
    fs.statSync(p).isFile() &&
    DOC_EXT.includes(path.extname(p))
  );
}

function titleFromName(name: string) {
  // strip extension & use as-is (Chinese names kept)
  return name.replace(/\.md$/i, "");
}

function sortByPinyinOrName(a: string, b: string) {
  return a.localeCompare(b, "zh-Hans-CN-u-co-pinyin");
}

export function generateNavAndSidebar(
  rootDir: string,
  localePrefix: string = ""
) {
  const scanDir = localePrefix ? path.join(rootDir, localePrefix) : rootDir;

  if (!fs.existsSync(scanDir)) {
    return { nav: [], sidebar: {} };
  }

  const entries = fs.readdirSync(scanDir);
  const sections = entries
    .filter((e: string) => isDirectory(path.join(scanDir, e)))
    .filter((e: string) => !EXCLUDED_DIRS.has(e) && !e.startsWith("."));
  sections.sort(sortByPinyinOrName);

  const nav: { text: string; link: string }[] = [];
  const sidebar: Sidebar = {};

  for (const dir of sections) {
    const abs = path.join(scanDir, dir);
    const files = fs
      .readdirSync(abs)
      .filter((f: string) => isMarkdown(path.join(abs, f)))
      .sort(sortByPinyinOrName);

    // Build sidebar for this section
    const items: SidebarItem[] = files.map((f: string) => ({
      text: titleFromName(f),
      link: `/${localePrefix}${localePrefix ? "/" : ""}${encodeURI(
        dir
      )}/${encodeURI(f)}`,
    }));

    if (items.length > 0) {
      const sidebarKey = `/${localePrefix}${localePrefix ? "/" : ""}${dir}/`;
      sidebar[sidebarKey] = [
        {
          text: dir,
          items,
        },
      ];

      // First doc becomes nav link for section
      nav.push({ text: dir, link: items[0].link! });
    } else {
      // Empty section: still show in nav to directory index if exists
      nav.push({
        text: dir,
        link: `/${localePrefix}${localePrefix ? "/" : ""}${encodeURI(dir)}/`,
      });
    }
  }

  return { nav, sidebar };
}
