import { test, expect } from '@playwright/test';
import { supplierPage } from '../Pages/supplierPage';
import { LoginPage } from '../Pages/LoginPage';
import { SFHomePage } from '../Pages/SFHomePage';
import { CommunityPage } from '../Pages/CommunityPage';
import { RangeReviewFlow } from '../Pages/RangeReviewFlow';
import { generate12DigitGTIN } from '../utils/generate12DigitGTIN';
const td = require('../testdata/supplierOnboarding.json');
const fs = require('fs');
test.setTimeout(180000);

test.only('Supplier Registration', async ({ page }) => {
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

test('Login as Supplier and Initiate a RRC', async ({ page }) => {
    let page1;
    const buffer = JSON.parse(fs.readFileSync('buffer.json', 'utf8'));
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
        await home.searchAccount(buffer.bufferedEntityValue);
        await home.clickOnAccountResultTab();
        await home.clickOnAccount(buffer.bufferedEntityValue);
    });
    await test.step('Verify Account Details', async () => {
        // await home.verifyAccountDetails(td.abn, td.country);
        await home.clickOnContactDetails();
        await page.waitForLoadState('load');
        await home.clickOnLoginToExperienceAsUser();
    });
    const community = new CommunityPage(page);
    /* 
   await test.step('Select RRC', async () => {
       await community.clickOnRRC();
       await community.changeRRCListView();
       await page.waitForTimeout(2000);
       await community.searchRRCList(td.RRCName);
       await community.clickOnRangeReviewName();
       page1 = await community.clickOnAddArticle();
   });
   const rrc = new RangeReviewFlow(page1);
   await test.step('Range Review Flow', async () => {
       await test.step('Product Overview', async () => {
           const gtin = generate12DigitGTIN(); // Generate GTIN
           console.log(`Generated GTIN: ${gtin}`);
           await rrc.enterGTIN(gtin);
           await page1.waitForTimeout(2000);
           await rrc.clickOnLookup();
           await rrc.verifyGTINSuccessMsg(td.GTIN_SuccessMessage);
           await rrc.selectArticleType(td.articleType);
           await rrc.selectArticleClass(td.articleClass);
           await rrc.selectArticleCategory(td.articleCategory);
           await rrc.selectIsForHumanConsumption(td.isHumanForConsumption);
           await rrc.selectDataSource(td.isThirdParty);
           await rrc.clickOnNext();
       });
       await page1.waitForTimeout(4000);
       await test.step('Product Details', async () => {
           await rrc.enterProductDescription(td.productName, td.minShelfLife, td.maxShelfLife);
           await rrc.enterProductDistribution(td.unitsSoldPerStore, td.storesRanged, td.distributionMethod);
           await rrc.clickOnNext();
       });
       await page1.waitForTimeout(4000);
       await test.step('Product Packaging', async () => {
           await rrc.selectUnitOfMeasure(td.baseUnitOfMeasure);
           await rrc.selectConsumerUnit();
           await rrc.enterBaseUnitPrice(td.baseUnitPrice);
           await rrc.hoverOnNext();
           await rrc.acceptConfirmPopup();
           await rrc.clickOnNext();
       });
       await test.step('Product Pricing', async () => {
           await rrc.selectProductUnit();
           await rrc.clickOnAddPrice();
           const effectiveDate = await rrc.getTodaysDate();
           await rrc.enterPriceDetails(effectiveDate, td.list_firstCostPrice, td.distributionMethod, td.invoiceCost, td.netCost);
           await rrc.clickOnAdd();
           await rrc.clickOnNext();
       });
       await test.step('Submit Range Review', async () => {
           await rrc.clickOnSubmit();
           await rrc.verifyRRCSuccessMessage(td.RRC_SuccessMessage);
       });
   }); */
    await test.step('Buffer Case Numbers', async () => {
        await community.clickOnCases();
        await community.changeCaseListView();
        //Buffering Supplier Case Number
        const supplierCaseNo = await community.bufferSupplierCaseNumber();
        console.log('Supplier Case Number: ', supplierCaseNo);
        // const buffer = JSON.parse(fs.readFileSync('buffer.json', 'utf8'));
        buffer.bufferedSupplierCaseNo = supplierCaseNo;
        fs.writeFileSync('buffer.json', JSON.stringify(buffer));
        //Buffering Article Case Number
        const articleCaseNo = await community.bufferArticleCaseNumber();
        console.log('Article Case Number: ', articleCaseNo);
        buffer.bufferedArticleCaseNo = articleCaseNo;
        fs.writeFileSync('buffer.json', JSON.stringify(buffer));
    });
    await test.step('Verify Case Status', async () => {
        await community.clickOnSupplierCase(buffer.bufferedSupplierCaseNo);
        await community.clickOnArticleCase(buffer.bufferedArticleCaseNo);
    });
});
