import { expect, test } from 'vitest'
import { validateLocales } from '@/lib/utils';

interface Case {
    path: string,
    shouldPass: boolean
};

let cases: Case[] = [
    { path: 'succ1', shouldPass: true },
    { path: 'succ2', shouldPass: true },
    { path: 'fail1', shouldPass: false },
    { path: 'fail2', shouldPass: false },
];

for (let testCase of cases) {
    let elem: string = testCase.path;
    let res: boolean = testCase.shouldPass;
    test(elem, async () => {
        const val = await validateLocales(`src/tests/fixtures/locales/${elem}`)
        expect(val).toBe(res);
    });

}
