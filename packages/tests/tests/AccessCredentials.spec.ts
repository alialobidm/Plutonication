import { accessCredentials } from "./helper";
import { test, expect } from '@playwright/test';

test('AccessCredentials to uri', async () => {
  expect(accessCredentials.ToUri()).toBe(`plutonication:?url=wss%3A%2F%2Fplutonication.com%2F&key=${accessCredentials.key}&name=Plutonication%20test&icon=https%3A%2F%2Frostislavlitovkin.pythonanywhere.com%2Fplutowalleticonwhite`)
});
