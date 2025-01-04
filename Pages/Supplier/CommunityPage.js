import { expect } from "@playwright/test";
import { stat } from "fs";
export class CommunityPage {
    constructor(page) {
        this.page = page;
        this.title = 'Community';
        this.pageURL = 'https://woolworths--phuat.sandbox.my.site.com/s/';
        this.accountName = "span[class='textReg']:nth-child(2)";
        this.quickLinksTitle = "[class='quickTxt']";
        this.welcomePopup = "(//span[contains(text(),'Welcome to Partner Hub')])[2]";
        this.welcomePopupClose = "[title='Stop Walk-thru']";
        this.casesButton = "//span[text()='Cases']";
        this.casesListViewDropdown = "button[title='Select a List View: Cases']";
        this.searchCaseListInput = "input[placeholder='Search lists...']";
        this.allOpenCasesOption = "//mark[text()='All Open Cases']";

        this.rrcButton = " //span[text()='Range Review Calendar (CDS)']";
        this.exitPopup = "(//div/p/a/u)[2]"
        this.divisionDropdown = "//select[@class='slds-select']";
        this.tradingDeptDropdown = "(//input[@placeholder='Select an Option'])[1]";
        this.subcategoryDropdown = "(//input[@placeholder='Select an Option'])[2]";
        this.myRRCButton = "//button[text()='My Subscribed Range Review Calendar']";
        this.RRCListViewDropdown = "button[title='Select a List View: Range Review Calendars']";
        this.searchRRCListInput = "input[placeholder='Search lists...']";
        this.allAciveRRCOption = "//mark[text()='All Active']";
        this.searchRRCInput = "//input[@class='slds-input']";
        this.rangeReviewName = "(//tbody/tr/th)[3]/span/a[text()='ASIAN FOODS']";
        this.addArticleButton = "//a[@title='Add Article']";

        this.allOpenCasesTable = "table[aria-label='All Open Cases']";
        this.caseTableRows = "//table/tbody/tr";
        this.caseOwner = "(//dt[@title='Case Owner']/following-sibling::div//span)[1]";
        this.caseStatus = "//dt[@title='Status']/following-sibling::div//span";
        this.caseType = "//dt[@title='Type']/following-sibling::div//span";
        this.editCaseStatus_btn = "button[title='Edit Status']";
        this.caseStatusDropdown = "//span[text()='Status']/../following-sibling::div//a";
        this.caseStatusValue = "a[title='${caseStatus}']";
        this.saveButton = "//button[@title='Save']";
        this.profileIcon = "a[class='trigger-link  ']";
        this.logoutButton = "a[title='Logout']";
    }
    async displayAccountName() {
        await this.page.waitForSelector(this.accountName, { state: 'visible' });
        const actual_accountName = this.page.locator(this.accountName).textContent();
        console.log("Account Name: " + actual_accountName);
    }
    async verifyPageTitle() {
        await this.page.waitForSelector(this.quickLinksTitle, { state: 'visible' });
        await expect.soft(this.page).toHaveURL(this.pageURL);
    }
    async clickOnCases() {
        /* const popupTimeout = 10000;
        // Wait for the popup if it appears
        try {
            const isPopupVisible = await this.page.locator(this.welcomePopupClose).waitFor({
                state: 'visible',
                timeout: popupTimeout
            });
            if (isPopupVisible) {
                await this.page.locator(this.welcomePopupClose).click();
                await this.page.locator(this.welcomePopupClose).waitFor({ state: 'hidden' }); // Ensure popup is gone
            }
        } catch (error) {
            console.log("Welcome Popup did not appear within the timeout. Proceeding...");
        } */
        // Proceed to click the "Cases" button
        await this.page.locator(this.casesButton).waitFor({ state: 'visible' });
        await this.page.locator(this.casesButton).click();
        await this.page.waitForLoadState('load'); // Wait for the page to fully load
    }

    async changeCaseListView() {
        await this.page.click(this.casesListViewDropdown);
        await this.page.waitForSelector(this.searchCaseListInput, { state: 'visible' });
        await this.page.fill(this.searchCaseListInput, 'All Open Cases');
        await this.page.waitForSelector(this.allOpenCasesOption, { state: 'visible' });
        await this.page.click(this.allOpenCasesOption);
    }
    async clickOnRRC() {
        /* const popupTimeout = 20000;
        // Handle the popup if it appears
        try {
            const isPopupVisible = await this.page.locator(this.welcomePopupClose).waitFor({
                state: 'visible',
                timeout: popupTimeout
            });

            if (isPopupVisible) {
                await this.page.locator(this.welcomePopupClose).click();
                await this.page.locator(this.welcomePopupClose).waitFor({ state: 'hidden' }); // Ensure popup is gone
            }
        } catch (error) {
            console.log("Welcome Popup did not appear within the timeout. Proceeding...");
        } */

        // Proceed to click the "RRC" button
        await this.page.locator(this.quickLinksTitle).waitFor({ state: 'visible' });
        await this.page.locator(this.rrcButton).waitFor({ state: 'visible' });
        await this.page.locator(this.rrcButton).click();
    }
    async clickOnMyRRCButton() {
        await this.page.waitForSelector(this.myRRCButton, { visible: true });
        await this.page.click(this.myRRCButton);
    }
    async changeRRCListView() {
        try {
            await this.page.click(this.exitPopup);
            await this.page.waitForSelector(this.RRCListViewDropdown, { state: 'visible' });
            await this.page.click(this.RRCListViewDropdown);
            await this.page.waitForSelector(this.searchRRCListInput, { state: 'visible' });
            await this.page.fill(this.searchRRCListInput, 'All Active');
            await this.page.waitForSelector(this.allAciveRRCOption, { state: 'visible' });
            await this.page.click(this.allAciveRRCOption);
        } catch (e) {
            await this.page.waitForSelector(this.RRCListViewDropdown, { state: 'visible' });
            await this.page.click(this.RRCListViewDropdown);
            await this.page.waitForSelector(this.searchRRCListInput, { state: 'visible' });
            await this.page.fill(this.searchRRCListInput, 'All Active');
            await this.page.waitForSelector(this.allAciveRRCOption, { state: 'visible' });
            await this.page.click(this.allAciveRRCOption);
        }
    }
    async searchRRCList(RRC) {
        await this.page.waitForSelector(this.searchRRCInput, { state: 'visible' });
        await this.page.fill(this.searchRRCInput, RRC);
        await this.page.locator(this.searchRRCInput).press('Enter');
    }
    async clickOnRangeReviewName() {
        await this.page.waitForSelector(this.rangeReviewName, { state: 'visible' });
        await this.page.click(this.rangeReviewName);
    }
    async clickOnAddArticle() {
        await this.page.waitForSelector(this.addArticleButton, { state: 'visible' });
        const [page1] = await Promise.all([
            this.page.waitForEvent("popup"),
            await this.page.click(this.addArticleButton)
        ]);
        await page1.waitForLoadState('load');
        await this.page.close();
        return page1;
    }
    async bufferSupplierCaseNumber() {
        await this.page.waitForSelector(this.allOpenCasesTable, { state: 'visible' });
        await this.page.waitForSelector(this.caseTableRows, { state: 'visible' });
        const caseRows = await this.page.locator(this.caseTableRows);
        const supplierCaseNumber = await caseRows.nth(0).locator('th span a').textContent();
        return supplierCaseNumber;
    }
    async bufferArticleCaseNumber() {
        const caseRows = await this.page.locator(this.caseTableRows);
        const articleCaseNumber = await caseRows.nth(1).locator('th span a').textContent();
        return articleCaseNumber;
    }
    async clickOnSupplierCase(bf_supplierCaseNumber) {
        const supplierCase = await this.page.locator(`//a[text()="${bf_supplierCaseNumber}"]`);
        await supplierCase.waitFor({ state: 'visible' });
        await supplierCase.click();
    }
    async verifySupplierCaseDetails(caseOwner, caseType, caseStatus) {
        await this.page.waitForSelector(this.caseOwner, { state: 'visible' });
        const act_caseOwner = await this.page.locator(this.caseOwner).textContent();
        expect(act_caseOwner).toBe(caseOwner);
        const act_caseType = await this.page.locator(this.caseType).textContent();
        expect(act_caseType).toBe(caseType);
        const act_caseStatus = await this.page.locator(this.caseStatus).textContent();
        expect(act_caseStatus).toBe(caseStatus);
        await this.page.goBack();
        await this.page.waitForLoadState('load');
    }
    async clickOnArticleCase(bf_articleCaseNumber) {
        const articleCase = await this.page.locator(`//a[text()="${bf_articleCaseNumber}"]`);
        await articleCase.waitFor({ state: 'visible' });
        await articleCase.click();
    }
    async verifyArticleCaseDetails(caseOwner, caseType, caseStatus) {
        await this.page.waitForSelector(this.caseOwner, { state: 'visible' });
        const act_caseOwner = await this.page.locator(this.caseOwner).textContent();
        expect(act_caseOwner).toBe(caseOwner);
        const act_caseType = await this.page.locator(this.caseType).textContent();
        expect(act_caseType).toBe(caseType);
        const act_caseStatus = await this.page.locator(this.caseStatus).textContent();
        expect(act_caseStatus).toBe(caseStatus);
        await this.page.goBack();
        await this.page.waitForLoadState('load');
    }
    async clickOnEditCaseStatus() {
        await this.page.waitForSelector(this.editCaseStatus_btn, { state: 'visible' });
        await this.page.click(this.editCaseStatus_btn);
    }
    async selectCaseStatus(caseStatus) {
        await this.page.waitForSelector(this.caseStatusDropdown, { state: 'visible' });
        await this.page.click(this.caseStatusDropdown);
        const dynamicCaseStatus = this.caseStatusValue.replace('${caseStatus}', caseStatus);
        await this.page.waitForSelector(dynamicCaseStatus, { state: 'visible' });
        await this.page.click(dynamicCaseStatus);
    }
    async clickOnSave() {
        await this.page.waitForSelector(this.saveButton, { state: 'visible' });
        await this.page.click(this.saveButton);
        await this.page.waitForSelector(this.saveButton, { state: 'hidden' });
    }
    async verifyVendorNumber(exp_accountName, exp_vendorNumber) {
        await this.page.waitForSelector(this.accountName, { state: 'visible' });
        const act_ANandVN = await this.page.locator(this.accountName).textContent();
        console.log("Actual Account Name and Vendor Number: " + act_ANandVN);
        expect(act_ANandVN).toBe(`${exp_accountName} ${exp_vendorNumber}`);
        console.log("Expected Account Name and Vendor Number: " + `${exp_accountName} ${exp_vendorNumber}`);
    }
    async logoutAsSupplierUser() {
        await this.page.waitForSelector(this.profileIcon, { state: 'visible' });
        await this.page.click(this.profileIcon);
        await this.page.waitForSelector(this.logoutButton, { state: 'visible' });
        await this.page.click(this.logoutButton);
    }
    async reloadHomePage() {
        await this.page.waitForSelector(this.quickLinksTitle, { state: 'visible' });
        await this.page.reload();
        await this.page.waitForLoadState('load');
    }
}