// import {test, expect} from '@playwright/test'
// import { title } from 'process';

// test('HomePage Login', async ({ page }) => {

//    await page.goto('https://www.demoblaze.com/')
//    const pageTitle = await page.title()
//    console.log(pageTitle)
//    await expect(page).toHaveTitle(pageTitle)

//    await page.click('#login2')
//    await page.fill('id=loginusername', 'Jerome')
// }
// );
function generateABN() {
   function isValidABN(abn) {
       const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
       const digits = abn.split('').map(Number);
       digits[0] -= 1; // Subtract 1 from the first digit
       const checksum = digits.reduce((sum, digit, idx) => sum + digit * weights[idx], 0);
       return checksum % 89 === 0;
   }

   let abn;
   do {
       const baseNumber = Math.floor(Math.random() * 900000000) + 100000000; // Random 9-digit number
       abn = '10' + baseNumber.toString(); // Prefix "10" to make it 11 digits
   } while (!isValidABN(abn));
   return abn;
}

// Example usage in Playwright
console.log("Generated ABN:", generateABN());
