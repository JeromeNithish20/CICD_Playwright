import { test, expect } from '@playwright/test'

test('Home Page', async ({ page }) => {

    await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/')
    const logo = page.locator('div[class="brand greenLogo"]')
    // await expect(logo).toBeVisible()

    //Printing all products on the display
    
    const products = await page.$$('.products .product h4')
    for (const product of products){
      const prodName = await product.textContent()
      console.log(prodName)
    }

    //Increasing the products quantity
    const incButtons = await page.$$('.products .product .increment')
    for (const incButton of incButtons) {
        await incButton.click()
    }

    //Adding all items to the cart
    const atcButtons = await page.$$('.products .product button')
    for (const atcButton of atcButtons) {
        await atcButton.click()
    }

    //Checking out the cart
    await page.locator('.cart-icon').click()
    await page.getByText('PROCEED TO CHECKOUT').click()

    //Calculating the cart value
    await page.waitForSelector('#productCartTables')
    const totalValues = await page.$$('//tbody/tr/td[5]/p[@class="amount"]')
    let total = 0
    for (const value of totalValues) {
        const itemPrice = await value.textContent()
        // console.log(itemPrice)
        total += Number(itemPrice)
    }
    console.log('Calculated price: ' + total)

    //Verifing with UI amount
    const UItotal = Number(await page.locator('.totAmt').textContent())
    console.log('Total in UI: '+UItotal)

   
    //Placing the order
    await page.getByText('Place Order').click()

    //Proceeding without checking Terms & Conditions
    await page.getByText('Proceed').click()

    //Capturing the error message and validating it
    const errorBox = await page.locator('.errorAlert')
    const errorMsg = errorBox.textContent()
    console.log(errorMsg)
    await expect(errorBox).toHaveText('Please accept Terms & Conditions - Required')
    //await page.waitForTimeout(2000)

    //Proceeding by accepting Terms & Conditions
    await page.locator('select').selectOption('India')
    await page.click('.chkAgree')
    await page.waitForTimeout(2000)
    await page.getByText('Proceed').click()

    //   await page.waitForTimeout(5000)

}
);