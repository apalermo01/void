import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { readdir, readFile } from 'node:fs/promises';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export async function validateLocales(localePath: string): Promise<boolean> {
    const files = await readdir(localePath)
    const contents = await Promise.all(
        files.map((f: string) =>
            readFile(`${localePath}/${f}`, 'utf8'))
    )
    const contents_parsed = contents.map(r => JSON.parse(r))

    return compareKeys(contents_parsed)
}

function compareKeys(...objs: any[]): boolean {
    const allKeys = objs.reduce((keys, object) => keys.concat(Object.keys(object)), [])
    const union = new Set(allKeys);
    return objs.every(object => union.size === Object.keys(object).length);
}
