import { test, expect } from '@playwright/test';
import { supplierPage } from '../Pages/supplierPage';
import { LoginPage } from '../Pages/LoginPage';
import { SFHomePage } from '../Pages/SFHomePage';
import { CommunityPage } from '../Pages/CommunityPage';
const td = require('../testdata/supplierOnboarding.json');
const fs = require('fs');
test.setTimeout(60000);

test('Supplier Registration', async ({ page }) => {
    const supplier = new supplierPage(page);
    await test.step('Initiate Supplier Application', async () => {
        await supplier.gotoSupplierPage();
        await supplier.clickOnStartApplication();
        await supplier.verifyPageTitle(td.pageName);
    });
    await test.step('Enter ABN Number and Click on Lookup', async () => {
        await supplier.enterAbn(td.abn);
        await supplier.clickOnLookup();
    });
    await test.step('Check Warning Message', async () => {
        const lookupResult = await supplier.checkWarningMessage();
        if (lookupResult) {
            const warningMessage = await supplier.getWarningMessage();
            console.warn('Warning Message:', warningMessage);
            page.close();
            return;
        }
        else {
            await test.step('Enter Business Details', async () => {
                await page.waitForTimeout(2000);
                //Buffering the value to be used in next step
                const entityNameDropdownValue = await supplier.selectEntityName();
                const buffer = JSON.parse(fs.readFileSync('buffer.json', 'utf8'));
                buffer.bufferedEntityValue = entityNameDropdownValue;
                fs.writeFileSync('buffer.json', JSON.stringify(buffer));
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
                await supplier.verifySuccessMessage(td.expected_successMessage);
            });
            page.close();
        }
    });

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
    await test.step('Navigate to Supplier Account', async () => {
        //Reading buffered value from previous test
        const buffer = JSON.parse(fs.readFileSync('buffer.json', 'utf8'));
        // console.log('Buffered Value:', buffer.bufferedEntityValue);
        await home.searchAccount(buffer.bufferedEntityValue);
        // await page.waitForTimeout(3000);
        await home.clickOnAccountResultTab();
        // await page.waitForTimeout(2000);
        await home.clickOnAccount(buffer.bufferedEntityValue);
    });
    await test.step('Verify Account Details', async () => {
        // await home.verifyAccountDetails(td.abn, td.country);
        await home.clickOnContactDetails();
        await page.waitForLoadState('load');
        await home.clickOnLoginToExperienceAsUser();
    });
    // await page.waitForTimeout(8000);
    const community = new CommunityPage(page);
    await test.step('Check Welcome Popup', async () => {
        community.closeWelcomePopup();
    });
    await test.step('Buffer New Supplier Case Number', async () => {
        await community.closeWelcomePopup();
        await community.verifyPageTitle();
        // await community.displayAccountName();
        await community.clickOnCases();
        await community.changeListView();
        const supplierCaseNo = await community.bufferSupplierCaseNumber();
        const buffer = JSON.parse(fs.readFileSync('buffer.json', 'utf8'));
        buffer.bufferedSupplierCaseNo = supplierCaseNo;
        fs.writeFileSync('buffer.json', JSON.stringify(buffer));
    });

    /* await test.step('Select RRC', async () => {
        await community.clickOnRRC();
        await community.clickOnMyRRCButton();
    }); */
});
