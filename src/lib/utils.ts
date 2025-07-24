import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { readdir, readFile } from 'node:fs/promises';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export async function validateLocales(localePath: string): Promise<boolean> {
    const files = await readdir(localePath)
    console.log("file = " + files)
    const contents = await Promise.all(
        files.map((f: string) =>
            readFile(`${localePath}/${f}`, 'utf8'))
    )
    const contents_parsed = contents.map(r => JSON.parse(r))
    console.log("RUNNING COMPARE KEYS ON A NEW BATCH")
    return compareKeys(contents_parsed)
}

/* 
 * Check that a collection of objects have the same keys
 * This is done by converting the keys to a set and ensuring that the sets have
 * the same length.
 *
 * source: https://stackoverflow.com/a/35047888
 */
function compareKeys(...objs: any[]): boolean {
    console.log("objs in compareKeys = ");
    console.log(objs)
    const allKeys = objs.reduce((keys, object) => getKeys(keys, object, ''), [])
    console.log("all Keys = " + allKeys)
    const union = new Set(allKeys);
    return objs.every(object => union.size === Object.keys(object).length);
}

function getKeys(keys: string[], object: any, prefix: string = ''): string[] {
    console.log("object @ top of get keys = ");
    console.log(object)
    Object.keys(object).forEach((k) => {
        console.log("k = ");
        console.log(k)
        const element = object[k];
        if (typeof element === 'object' && !Array.isArray(element) && element !== null) {
            console.log(`${k} is an object, making recursive call with `)
            console.log("keys = ");
            console.log(keys);
            console.log("element = ")
            console.log(element);
            const newPrefix = prefix.length == 0 ? `${k}` : `${prefix}.${k}`
            console.log("new prefix = ");
            console.log(newPrefix)
            return getKeys(keys, element, newPrefix)
        } else {
            keys.push(prefix.length == 0 ? k : `${prefix}.${k}`)
        }
    })

    return keys;
}
