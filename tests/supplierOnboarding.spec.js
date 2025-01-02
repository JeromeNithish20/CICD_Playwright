import { test, expect } from '@playwright/test';
import { guestSupplierPage } from '../Pages/Supplier/guestSupplierPage';
import { CommunityPage } from '../Pages/Supplier/CommunityPage';
import { AccountPage } from '../Pages/Supplier/AccountPage';
import { RangeReviewFlow } from '../Pages/Supplier/RangeReviewFlow';
import { LoginPage } from '../Pages/Salesforce/LoginPage';
import { SFHomePage } from '../Pages/Salesforce/SFHomePage';
import { SetupPage } from '../Pages/Salesforce/SetupPage';
import { SF_Page_InternalUser } from '../Pages/Salesforce/SF_Page_InternalUser';
import { SF_CasesPage } from '../Pages/Salesforce/SF_CasesPage';
import { SF_AccountPage } from '../Pages/Salesforce/SF_AccountPage';
import { generate12DigitGTIN } from '../utils/generate12DigitGTIN';
import { getNextMonday } from '../utils/getNextMondayDate';
import { generateRandomName } from '../utils/generateRandomName';
const td = require('../testdata/supplierOnboarding.json');
const fs = require('fs');
const buffer = JSON.parse(fs.readFileSync('buffer.json', 'utf8'));
test.setTimeout(300000);

test('Registering a New Supplier', async ({ page }) => {
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
        const lookupResult = await guest.checkWarningMessage();
        if (lookupResult) {
            const warningMessage = await guest.getWarningMessage();
            console.warn('Warning Message:', warningMessage);
            page.close();
            return;
        }
        else {
            await test.step('Enter Business Details', async () => {
                await page.waitForTimeout(2000);
                //Buffering the value to be used in next step
                const entityNameDropdownValue = await guest.selectEntityName();
                // const buffer = JSON.parse(fs.readFileSync('buffer.json', 'utf8'));
                buffer.entityValue = entityNameDropdownValue;
                fs.writeFileSync('buffer.json', JSON.stringify(buffer, null, 2), 'utf8');
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
                const randomName = generateRandomName();
                await guest.fillContactDetails(randomName.firstName, randomName.lastName, td.jobTitle, td.email, td.contactNumber);
                await page.waitForTimeout(2000);
                await guest.clickOnNext();
            });
            await test.step('Submit the application', async () => {
                await guest.acceptTermsAndConditions();
                // await guest.clickOnCaptchaCheckbox();
                page.pause();
                await guest.clickOnSubmit();
                await guest.verifySuccessMessage(td.expected_successMessage);
            });
            page.close();
        }
    });

});

test('Logging in as Supplier and Initiating a New RRC', async ({ page }) => {
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
    const SF_AccountPage = new SF_AccountPage(page);
    await test.step('Navigate to Supplier Account and Verify Account Details', async () => {
        //Reading buffered value from previous test
        await home.searchAccount(buffer.entityValue);
        await home.clickOnAccountResultTab();
        await home.clickOnAccount(buffer.entityValue);
        await SF_AccountPage.verifyAccountDetails(td.abn, td.country);
    });
    await test.step('Login as Supplier', async () => {
        const fullName = `${buffer.firstName} ${buffer.lastName}`;
        await SF_AccountPage.clickOnContactDetails(fullName);
        await page.waitForLoadState('load');
        await SF_AccountPage.clickOnLoginToExperienceAsUser();
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
        buffer.supplierCaseNo = supplierCaseNo;
        fs.writeFileSync('buffer.json', JSON.stringify(buffer, null, 2), 'utf8');
        //Buffering Article Case Number
        const articleCaseNo = await community1.bufferArticleCaseNumber();
        console.log('Article Case Number: ', articleCaseNo);
        buffer.articleCaseNo = articleCaseNo;
        fs.writeFileSync('buffer.json', JSON.stringify(buffer, null, 2), 'utf8');
    });
    await test.step('Verify Case Status', async () => {
        await community1.clickOnSupplierCase(buffer.supplierCaseNo);
        await community1.verifySupplierCaseDetails(td.supplierCaseOwner, td.supplierCaseType, td.supplierCaseStatus);
        await community1.clickOnArticleCase(buffer.articleCaseNo);
        await community1.verifyArticleCaseDetails(td.articleCaseOwner, td.articleCaseType, td.articleCaseStatus);
    });
    await test.step('Logout As Supplier User', async () => {
        await community.logoutAsSupplierUser();
    });
    await test.step('Login as Admin', async () => {
        await home.logoutAsAdmin();
    });
});

test('Updating CM and CA as BSS', async ({ page }) => {
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
        await internalUser.searchCase(buffer.articleCaseNo);
        await internalUser.clickOnCaseResultTab();
        await internalUser.clickOnCase(buffer.articleCaseNo);
    });
    await test.step('Update CM and CA', async () => {
        await internalUser.collapseKeyFields();
        await internalUser.clickOnEditCM(buffer.articleCaseNo);
        await internalUser.enterCM(td.categoryManager);
        await internalUser.selectCMOption(td.categoryManager);
        await internalUser.enterCA(td.categoryAssistant);
        await internalUser.selectCAOption(td.categoryAssistant);
        await internalUser.clickOnSave();
    });
    const SFCase = new SF_CasesPage(page1);
    await test.step('Change Case Owner', async () => {
        await SFCase.changeCaseOwner_User(buffer.articleCaseNo, td.categoryManager);
        await SFCase.clickOnSave();
    });
    await test.step('Logout As BSS User', async () => {
        await internalUser.logoutAsInternalUser();
    });
    await test.step('Login as Admin', async () => {
        await setup.logoutAsAdmin();
    });
});

test('Logging in as CM and Making Article Case Successful', async ({ page }) => {
    let page1;
    await test.step('Login as Admin', async () => {
        const login = new LoginPage(page);
        await login.gotoLoginPage();
        await login.login(td.username, td.password);
    });
    await page.waitForTimeout(8000);
    const home = new SFHomePage(page);
    await test.step('Navigate to Home', async () => {
        // await home.verifyGrossMarginPopup();
        await home.gotoHome();
    });
    await test.step('Navigate to Setup', async () => {
        page1 = await home.gotoSetup();
    });
    const setup = new SetupPage(page1);
    await test.step('Search for CM User and Login', async () => {
        await setup.searchUser(td.categoryManager);
        await setup.clickOnLogin(td.categoryManager);
    });
    await page1.waitForTimeout(8000);
    const internalUser = new SF_Page_InternalUser(page1);
    await test.step('Navigate to Article Case', async () => {
        await internalUser.gotoBSSHome();
        await internalUser.searchCase(buffer.articleCaseNo);
        await internalUser.clickOnCaseResultTab();
        await internalUser.clickOnCase(buffer.articleCaseNo);
    });
    await test.step('Verify Gross Margin Pop-up is displayed', async () => {
        await internalUser.verifyGrossMarginPopup();
    });
    await test.step('Update Merchandise Category', async () => {
        await internalUser.collapseKeyFields();
        await internalUser.clickOnEditMerchCategory(buffer.articleCaseNo);
        await internalUser.enterMerchandiseCategory(td.merchCategory);
        await internalUser.clickOnSave();
    });
    const SFCase = new SF_CasesPage(page1);
    await test.step('Change Case Status', async () => {
        await SFCase.clickOnEditCaseStatus(buffer.articleCaseNo);
        await SFCase.changeCaseStatus(buffer.articleCaseNo, td.caseStatus_Successful);
        await internalUser.clickOnSave();
        await internalUser.reloadPage();
        await internalUser.reloadPage();
        await internalUser.reloadPage();
    });
    // await test.step('Verify Case Status', async () => {
    // });
    await test.step('Logout As CM User', async () => {
        await internalUser.logoutAsInternalUser();
    });
    await test.step('Login as Admin', async () => {
        await setup.logoutAsAdmin();
    });
});

test('Logging as Supplier and Enriching Supplier Case', async ({ page }) => {
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
        await home.searchAccount(buffer.entityValue);
        await home.clickOnAccountResultTab();
        await home.clickOnAccount(buffer.entityValue);
    });
    const SF_AccountPage = new SF_AccountPage(page);
    await test.step('Verify Account Details', async () => {
        // await home.verifyAccountDetails(td.abn, td.country);
        const fullName = `${buffer.firstName} ${buffer.lastName}`;
        await SF_AccountPage.clickOnContactDetails(fullName);
        await page.waitForLoadState('load');
        await SF_AccountPage.clickOnLoginToExperienceAsUser();
    });
    const community = new CommunityPage(page);
    const account = new AccountPage(page);
    await test.step('Navigate to Supplier Case and Open Account', async () => {
        await community.clickOnCases();
        await community.changeCaseListView();
        await community.clickOnSupplierCase(buffer.supplierCaseNo);
        await account.clickOnAccountNameOnSupplierCase(buffer.entityValue);
    });
    await test.step('Upload Necessary Documents', async () => {
        await account.uploadBankStatement('Bank Statement');
        await account.uploadTaxInvoice('Tax Invoice');
    });
    await test.step('Update Account Details', async () => {
        await account.clickOnAccountEditButton();
        await account.enterAccountDetails(td.businessOrganization, td.accountExecutiveEmail, td.financeManagerEmail);
        await account.clickOnSaveButton();
    });
    await test.step('Create Trading Terms', async () => {
        await account.clickOnTradingTermTab();
        await account.clickOnAddTradingTerm();
        const rebateEffectiveDate = getNextMonday();
        await account.enterTradingTermDetails(rebateEffectiveDate);
        await account.clickOnSaveButton();
        //Buffering Trading Term Name
        const tradingTermName = await account.bufferTradingTermName();
        buffer.tradingTermName = tradingTermName;
        fs.writeFileSync('buffer.json', JSON.stringify(buffer, null, 2), 'utf8');
        await account.navigateBack();
        await account.navigateBack();
    });
    await test.step('Change Case Status', async () => {
        await community.clickOnEditCaseStatus();
        await community.selectCaseStatus(td.caseStatus_InfoProvided);
        await community.clickOnSave();
    });
    await test.step('Logout As Supplier User', async () => {
        await community.logoutAsSupplierUser();
    });
    await test.step('Login as Admin', async () => {
        await home.logoutAsAdmin();
    });
});

test('Logging in as CM and Making the Supplier Case Successful', async ({ page }) => {  
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
        await setup.searchUser(td.categoryManager);
        await setup.clickOnLogin(td.categoryManager);
    });
    await page1.waitForTimeout(8000);
    const internalUser = new SF_Page_InternalUser(page1);
    await test.step('Navigate to Article Case', async () => {
        // await internalUser.gotoBSSHome();
        await internalUser.searchCase(buffer.supplierCaseNo);
        await internalUser.clickOnCaseResultTab();
        await internalUser.clickOnCase(buffer.supplierCaseNo);
    });
    const SFCase = new SF_CasesPage(page1);
    const SFAccount = new SF_AccountPage(page1);
    await test.step('Enter Search Term Details', async () => { 
        await SFCase.navigateToAccount(buffer.entityValue);
        await SFAccount.clickOnEditSearchTerm1();
        await SFAccount.enterSearchTerms(buffer.entityValue);
        await SFAccount.clickOnSave();
        await SFAccount.navigateBack();
    });
    await test.step('Change Case Status', async () => {
        await SFCase.clickOnEditCaseStatus(buffer.supplierCaseNo);
        await SFCase.changeCaseStatus(buffer.supplierCaseNo, td.caseStatus_Successful);
        await SFCase.clickOnSave();
        await SFCase.reloadPage();
        await SFCase.verifyCaseDetails(td.CSA_QueueName, td.caseStatus_Successful);
    });
    await test.step('Logout As CM User', async () => {
        await internalUser.logoutAsInternalUser();
    });
    await test.step('Logout as Admin', async () => {
        await setup.logoutAsAdmin();
    });
});

test('Logging in as CA and Approving the Case', async ({ page }) => {
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
    await test.step('Search for CA User and Login', async () => {
        await setup.searchUser(td.categoryAssistant);
        await setup.clickOnLogin(td.categoryAssistant);
    });
    await page1.waitForTimeout(8000);
    const internalUser = new SF_Page_InternalUser(page1);
    await test.step('Navigate to Article Case', async () => {
        // await internalUser.gotoBSSHome();
        await internalUser.searchCase(buffer.supplierCaseNo);
        await internalUser.clickOnCaseResultTab();
        await internalUser.clickOnCase(buffer.supplierCaseNo);
    });
    const SFCase = new SF_CasesPage(page1);
    await test.step('Change Case Owner', async () => {
        await SFCase.changeCaseOwner_User(buffer.supplierCaseNo, td.categoryAssistant);
        await SFCase.clickOnSave();
    });
    const SFAccount = new SF_AccountPage(page1);
    await test.step('Enter Trading Term Details', async () => {
        await SFCase.navigateToAccount(buffer.entityValue);
        await SFAccount.clickOnTradingTermTab();
        await SFAccount.openTradingTerm(buffer.tradingTermName);
        await SFAccount.clickOnEditRefVendor();
        await SFAccount.selectRefVendor(td.refVendor);
        await SFAccount.selectPaymentMethod();
        await SFAccount.selectPaymentTermsCode(td.paymentTermsCode);
        await SFAccount.clickOnSave();
        await SFAccount.navigateBack();
        await SFAccount.navigateBack();
    });
    await test.step('Change Case Status', async () => {
        await SFCase.clickOnEditCaseStatus(buffer.supplierCaseNo);
        await SFCase.changeCaseStatus(buffer.supplierCaseNo, td.caseStatus_Approved);
        await SFCase.clickOnSave();
        await SFCase.reloadPage();
        await SFCase.verifyCaseDetails('Trade Supplier Support', td.caseStatus_Approved);
    });
    await test.step('Logout As CA User', async () => {
        await internalUser.logoutAsInternalUser();
    });
    await test.step('Logout as Admin', async () => {
        await setup.logoutAsAdmin();
    });
});

test('Logging in as BSS and Syncing the Case', async ({ page }) => {
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
    await test.step('Search for BSS User and Login', async () => {
        await setup.searchUser(td.BSS_UserName);
        await setup.clickOnLogin(td.BSS_UserName);
    });
    await page1.waitForTimeout(8000);
    const internalUser = new SF_Page_InternalUser(page1);
    await test.step('Navigate to Article Case', async () => {
        await internalUser.gotoBSSHome();
        await internalUser.searchCase(buffer.supplierCaseNo);
        await internalUser.clickOnCaseResultTab();
        await internalUser.clickOnCase(buffer.supplierCaseNo);
    });
    const SFCase = new SF_CasesPage(page1);
    await test.step('Change Case Owner', async () => {
        await SFCase.changeCaseOwner_User(buffer.supplierCaseNo, td.BSS_UserName);
        await SFCase.clickOnSave();
    });
    const SFAccount = new SF_AccountPage(page1);
    await test.step('Assign Trading Term', async () => {
        await SFCase.navigateToAccount(buffer.entityValue);
        await SFAccount.clickOnEditTradingTerm();
        await SFAccount.enterTradingTerm(buffer.tradingTermName);
        await SFAccount.clickOnSave();
        await SFAccount.navigateBack();
    });
    await test.step('Change Case Status', async () => {
        await SFCase.clickOnShowMoreActions(buffer.supplierCaseNo);
        await SFCase.clickOnSendToSAP();
        await SFCase.reloadPageUntilReviewStatus();
        await SFCase.verifyCaseDetails('Trade Supplier Support',td.caseStatus_InReview);
    });
    await test.step('Verify Vendor Number is Generated', async () => {
        await SFCase.navigateToAccount(buffer.entityValue);
        const vendorNumber = await SFAccount.verifyAndBufferVendorNumber();
        buffer.vendorNumber = vendorNumber;
        fs.writeFileSync('buffer.json', JSON.stringify(buffer, null, 2), 'utf8');
    });
    await test.step('Logout As BSS User', async () => {
        await internalUser.logoutAsInternalUser();
    });
    await test.step('Logout as Admin', async () => {
        await setup.logoutAsAdmin();
    });
});

test('Logging in as Supplier and Verifying Vendor Number', async ({ page }) => {
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
        await home.searchAccount(buffer.entityValue);
        await home.clickOnAccountResultTab();
        await home.clickOnAccount(buffer.entityValue);
    });
    const SF_AccountPage = new SF_AccountPage(page);
    await test.step('Navigate to Contact and Login', async () => {
        const fullName = `${buffer.firstName} ${buffer.lastName}`;
        await SF_AccountPage.clickOnContactDetails(fullName);
        await page.waitForLoadState('load');
        await SF_AccountPage.clickOnLoginToExperienceAsUser();
    });
    const community = new CommunityPage(page);
    await test.step('Verify Vendor Number', async () => {
        await community.verifyVendorNumber(buffer.entityValue, buffer.vendorNumber);
    });
    await test.step('Logout As Supplier User', async () => {
        await community.logoutAsSupplierUser();
    });
    await test.step('Login as Admin', async () => {
        await home.logoutAsAdmin();
    });
});