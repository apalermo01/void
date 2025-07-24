import { expect, test } from 'vitest'
import { validateLocales } from '@/lib/utils';


for (let testCase of [['succ1', true], ['succ2', true], ['fail1', false], ['fail2', false]]) {
    console.log("test case = ");
    console.log(testCase);
    let elem: string = testCase[0];
    let res: boolean = testCase[1];
    console.log("elem = " + elem);
    console.log("res = " + res);
    test(elem, async () => {
        const val = await validateLocales(`src/tests/fixtures/locales/${elem}`)
        expect(val).toBe(res);
    });

}
