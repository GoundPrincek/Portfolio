import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'

async function collect(directory) {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await collect(path))
    else if (entry.isFile() && entry.name.endsWith('.js')) files.push(path)
  }
  return files
}

for (const directory of ['src', 'prisma', 'tests', 'scripts']) {
  for (const file of await collect(directory)) execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' })
}
console.info('Backend JavaScript syntax is valid.')
