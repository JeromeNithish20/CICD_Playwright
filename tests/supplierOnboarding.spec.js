import { test, expect } from '@playwright/test';
import { supplierPage } from '../Pages/supplierPage';
import { LoginPage } from '../Pages/LoginPage';
import { SFHomePage } from '../Pages/SFHomePage';
const td = require('../testdata/supplierOnboarding.json');

test('Supplier Onboarding', async ({ page }) => {
    const supplier = new supplierPage(page);
    await test.step('Initiate Supplier Application', async () => {
        await supplier.gotoSupplierPage();
        await supplier.clickOnStartApplication();
        await supplier.verifyPageTitle(td.pageName);
    });
    await test.step('Enter Business Details', async () => {
        await supplier.enterAbn(td.abn);
        await supplier.clickOnLookup();
        await page.waitForTimeout(2000);
        const entityNameDropdownValue = await supplier.selectEntityName();
        await supplier.selectCompanyTradingName();
        await supplier.enterTradingName(entityNameDropdownValue);
        await supplier.clickOnNext();
    });
    await test.step('Enter Company Details', async () => {
        await supplier.selectCountry(td.country);
        await supplier.enterStreet(td.street);
        await supplier.enterTown(td.town);
        await supplier.selectState();
        await supplier.enterPostcode(td.postcode);
        await supplier.clickOnCheckbox();
    });
    await test.step('Enter Contact Details', async () => {
        await supplier.fillContactDetails(td.firstName, td.lastName, td.jobTitle, td.email, td.contactNumber);
        await page.waitForTimeout(2000);
        await supplier.clickOnNext();
    });
    await test.step('Submit the application', async () => {
        await supplier.acceptTermsAndConditions();
        page.pause();
        await supplier.clickOnSubmit();
        await supplier.verifySuccessMessage();
    });
    page.close();

});

test('Login as Supplier', async ({ page }) => {
    await test.step('Login as Admin', async () => {
        const login = new LoginPage(page);
        await login.gotoLoginPage();
        await login.login(td.username, td.password);
    });
    await page.waitForTimeout(8000);
    const home = new SFHomePage(page);
    await test.step('Navigate to Home', async () => {
        await home.gotoHome();
    });
    await test.step('Verify Supplier Account', async () => {
        await home.searchAccount(td.tradingName);
        await page.waitForTimeout(3000);
        await home.clickOnAccountResultTab();
        await page.waitForTimeout(4000);
        await home.clickOnAccount(td.tradingName);
    });
});