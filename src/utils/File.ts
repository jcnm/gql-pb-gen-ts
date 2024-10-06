// src/utils/FileUtils.ts
import { promises as fs } from 'fs';
import { dirname } from 'path';

export async function ensureDir(path: string) {
  await fs.mkdir(dirname(path), { recursive: true });
}

export async function writeFile(path: string, content: string) {
  await ensureDir(path);
  await fs.writeFile(path, content, 'utf-8');
}
