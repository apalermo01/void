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

/* 
 * Check that a collection of objects have the same keys
 * This is done by converting the keys to a set and ensuring that the sets have
 * the same length.
 *
 * source: https://stackoverflow.com/a/35047888
 */
function compareKeys(objs: any[]): boolean {
    const allKeys = objs.reduce((keys, object) => getKeys(keys, object, ''), [])
    const union = new Set(allKeys);
    return objs.every(object => {
        const theseKeys = new Set(getKeys([], object, ''));
        return union.size === theseKeys.size
    })
}

function getKeys(keys: string[], object: any, prefix: string = ''): string[] {
    Object.keys(object).forEach((k) => {
        const element = object[k];
        if (typeof element === 'object' && !Array.isArray(element) && element !== null) {
            const newPrefix = prefix.length == 0 ? '${k}' : `${prefix}.${k}`
            return getKeys(keys, element, newPrefix)
        } else {
            keys.push(`${prefix}.${k}`)
        }
    })

    return keys;
}
