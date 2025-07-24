import { expect, test } from 'vitest'
import { validateLocales } from '@/lib/utils';

// Local comparison checks
// function testLocaleComparisons(): boolean {
//     return true;
// }

test('test locales', async () => {
    const val = await validateLocales("src/locales")
    expect(val).toBe(true);
});
