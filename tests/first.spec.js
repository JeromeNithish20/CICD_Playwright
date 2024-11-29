import {test, expect} from '@playwright/test'
import { title } from 'process';

test('HomePage Login', async ({ page }) => {

   await page.goto('https://www.demoblaze.com/')
   const pageTitle = await page.title()
   console.log(pageTitle)
   await expect(page).toHaveTitle(pageTitle)

   await page.click('#login2')
   await page.fill('id=loginusername', 'Jerome')
}
);
