import { test, expect } from '@playwright/test';

test('Login As Supplier', async ({ page }) => {
  await page.goto('https://test.salesforce.com/');
  await page.getByLabel('Username').fill('jn@tcs.woolworths.com.au.phuat');
  await page.getByLabel('Password').fill('Tcs@1234');
  await page.getByRole('button', { name: 'Log In to Sandbox' }).click();
  await page.getByRole('button', { name: 'I Agree' }).click();
  
  
  await page.waitForTimeout(10000)
  if(!(await page.locator("//a[@title='Home']/span").isVisible())){
    await page.getByTitle('Show Navigation Menu').click()
  await page.locator("//div[@id='navMenuList']/div/ul/li[1]").click()
  }
  
  await page.locator("button[aria-label='Search']").click()
  await page.getByPlaceholder('Search...').fill('Akhil NPC');
  await page.getByPlaceholder('Search...').press('Enter')

  await page.waitForTimeout(5000)
  await page.locator("//span[normalize-space()='Contacts']").click()

  await page.locator("a[title='Akhil NPC']").click()
  // const [page1] = await Promise.all([
  //   page.waitForEvent('popup'),
   await page.locator("//button[@name='LoginToNetworkAsUser']").click()
  // ]);

  await page1.waitForTimeout(10000)
  await page1.locator("//li[.//span[text()='Range Review Calendar (CDS)']]").click();

});

