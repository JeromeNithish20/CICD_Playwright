import { test, expect } from '@playwright/test';
import { guestSupplierPage } from '../Pages/Supplier/guestSupplierPage';
import { LoginPage } from '../Pages/Salesforce/LoginPage';
import { SFHomePage } from '../Pages/Salesforce/SFHomePage';
import { CommunityPage } from '../Pages/Supplier/CommunityPage';
import { RangeReviewFlow } from '../Pages/Supplier/RangeReviewFlow';
import { generate12DigitGTIN } from '../utils/generate12DigitGTIN';
import { SetupPage } from '../Pages/Salesforce/SetupPage';
import { SF_Page_InternalUser } from '../Pages/Salesforce/SF_Page_InternalUser';
const td = require('../testdata/supplierOnboarding.json');
const fs = require('fs');
const buffer = JSON.parse(fs.readFileSync('buffer.json', 'utf8'));
test.setTimeout(180000);

test('Supplier Registration', async ({ page }) => {
    const guest = new guestSupplierPage(page);
    await test.step('Initiate Supplier Application', async () => {
        await guest.gotoSupplierPage();
        await guest.clickOnStartApplication();
        await guest.verifyPageTitle(td.pageName);
    });
    await test.step('Enter ABN Number and Click on Lookup', async () => {
        await guest.enterAbn(td.abn);
        await guest.clickOnLookup();
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
                // const buffer = JSON.parse(fs.readFileSync('buffer.json', 'utf8'));
                buffer.bufferedEntityValue = entityNameDropdownValue;
                fs.writeFileSync('buffer.json', JSON.stringify(buffer));
                await guest.selectCompanyTradingName();
                await guest.enterTradingName(entityNameDropdownValue);
                await guest.clickOnNext();
            });
            await test.step('Enter Company Details', async () => {
                await guest.selectCountry(td.country);
                await guest.enterStreet(td.street);
                await guest.enterTown(td.town);
                await guest.selectState();
                await guest.enterPostcode(td.postcode);
                await guest.clickOnCheckbox();
            });
            await test.step('Enter Contact Details', async () => {
                await guest.fillContactDetails(td.firstName, td.lastName, td.jobTitle, td.email, td.contactNumber);
                await page.waitForTimeout(2000);
                await guest.clickOnNext();
            });
            await test.step('Submit the application', async () => {
                await guest.acceptTermsAndConditions();
                page.pause();
                await guest.clickOnSubmit();
                await guest.verifySuccessMessage(td.expected_successMessage);
            });
            page.close();
        }
    });

});

test('Login as Supplier and Initiate a New RRC', async ({ page }) => {
    let page1;
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
    }); 
    const community1 = new CommunityPage(page1);
    await test.step('Buffer Case Numbers', async () => {
        await community1.clickOnCases();
        await community1.changeCaseListView();
        //Buffering Supplier Case Number
        const supplierCaseNo = await community1.bufferSupplierCaseNumber();
        console.log('Supplier Case Number: ', supplierCaseNo);
        buffer.bufferedSupplierCaseNo = supplierCaseNo;
        fs.writeFileSync('buffer.json', JSON.stringify(buffer));
        //Buffering Article Case Number
        const articleCaseNo = await community1.bufferArticleCaseNumber();
        console.log('Article Case Number: ', articleCaseNo);
        buffer.bufferedArticleCaseNo = articleCaseNo;
        fs.writeFileSync('buffer.json', JSON.stringify(buffer));
    });
    await test.step('Verify Case Status', async () => {
        await community1.clickOnSupplierCase(buffer.bufferedSupplierCaseNo);
        await community1.verifySupplierCaseDetails(td.supplierCaseOwner, td.supplierCaseType, td.supplierCaseStatus);
        await community1.clickOnArticleCase(buffer.bufferedArticleCaseNo);
        await community1.verifyArticleCaseDetails(td.articleCaseOwner, td.articleCaseType, td.articleCaseStatus);
    });
    await page1.close();
});

test('Update CM and CA as BSS', async ({ page }) => {
    let page1;
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
    await test.step('Navigate to Setup', async () => {
        page1 = await home.gotoSetup();
    });
    const setup = new SetupPage(page1);
    await test.step('Search for User and Login', async () => {
        await setup.searchUser(td.BSS_UserName);
        await setup.clickOnLogin(td.BSS_UserName);
    });
    await page1.waitForTimeout(8000);
    const internalUser = new SF_Page_InternalUser(page1);
    await test.step('Navigate to Article Case', async () => {
        await internalUser.gotoBSSHome();
        await internalUser.searchCase(buffer.bufferedArticleCaseNo);
        await internalUser.clickOnCaseResultTab();
        await internalUser.clickOnCase(buffer.bufferedArticleCaseNo);
    });
    await test.step('Update CM, CA and Merchandise Category', async () => {
        await internalUser.collapseKeyFields();
        await internalUser.clickOnEditCM();
        await internalUser.enterCM(td.categoryManager);
        await internalUser.selectCMOption(td.categoryManager);
        await internalUser.enterCA(td.categoryAssistant);
        await internalUser.selectCAOption(td.categoryAssistant);
        await internalUser.clickOnSave();
    });
    await test.step('Change Case Owner', async () => {
        await internalUser.changeCaseOwner(td.categoryManager);
        await internalUser.clickOnSave();
    });
    await test.step('Logout As BSS User', async () => {
        await internalUser.logoutAsInternalUser();
    });
    await test.step('Login as Admin', async () => {
        await setup.logoutAsAdmin();
    });
});

test('Update Merchandise Category and Case Status as CM', async ({ page }) => {
    let page1;
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
    await test.step('Navigate to Setup', async () => {
        page1 = await home.gotoSetup();
    });
    const setup = new SetupPage(page1);
    await test.step('Search for CM User and Login', async () => {
        await setup.searchUser(td.CM_UserName);
        await setup.clickOnLogin(td.CM_UserName);
    });
    await page1.waitForTimeout(8000);
    const internalUser = new SF_Page_InternalUser(page1);
    await test.step('Navigate to Article Case', async () => {
        await internalUser.gotoBSSHome();
        await internalUser.searchCase(buffer.bufferedArticleCaseNo);
        await internalUser.clickOnCaseResultTab();
        await internalUser.clickOnCase(buffer.bufferedArticleCaseNo);
    });
    await test.step('Update Merchandise Category', async () => {
        await internalUser.collapseKeyFields();
        await internalUser.clickOnEditKeyFields();
        await internalUser.enterMerchandiseCategory(td.merchandiseCategory);
        await internalUser.clickOnSave();
    });
    await test.step('Logout As CM User', async () => {
        await internalUser.logoutAsInternalUser();
    });
    await test.step('Login as Admin', async () => {
        await setup.logoutAsAdmin();
    });
});