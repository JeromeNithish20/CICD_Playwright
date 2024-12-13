import { expect } from "@playwright/test";
import { stat } from "fs";
export class CommunityPage {
    constructor(page) {
        this.page = page;
        this.title = 'Community';
        this.pageURL = 'https://woolworths--phuat.sandbox.my.site.com/s/';
        this.accountName = '.textReg:nth-child(2)';
        this.quickLinksTitle = "[class='quickTxt']";
        this.welcomePopup = "(//span[contains(text(),'Welcome to Partner Hub')])[2]";
        this.welcomePopupClose = "Stop Walk-thru";
        this.casesButton = "//span[text()='Cases']";
        this.casesListViewDropdown = "button[title='Select a List View: Cases']";
        this.searchCaseListInput = "input[placeholder='Search lists...']";
        this.allOpenCasesOption = "//mark[text()='All Open Cases']";
        this.caseNumber = "table tbody tr th a";
        this.rrcButton = " //span[text()='Range Review Calendar (CDS)']";
        this.rrcPopup = "locator('#walkme-visual-design-73ba664a-ccd1-6111-15bd-c43c69ce5ae6')";//button[text()='How to Submit a New Product']";
        this.rrcPopupClose = "locator('#container-d14afb67-5378-6828-2c7d-f55ac5cbbf04 div').nth(1)";//button[@class="wm-visual-design-button"]/div';
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

    }
    async displayAccountName() {
        await this.page.waitForSelector(this.accountName, { state: 'visible' });
        const actual_accountName = this.page.locator(this.accountName).textContent();
        console.log('Account Name:', actual_accountName);
    }
    async verifyPageTitle() {
        await this.page.waitForSelector(this.quickLinksTitle, { state: 'visible' });
        await expect.soft(this.page).toHaveURL(this.pageURL);
    }
    async clickOnCases() {
        try {
            //Checking if the popup is visible and closing it
            const popupSelector = this.page.locator(this.welcomePopup);
            await this.page.waitForSelector(popupSelector, { timeout: 5000 });
            console.log('Popup appeared');
            await this.page.click(this.welcomePopupClose);
        } catch (e) {
            await this.page.click(this.casesButton);
            await this.page.waitForLoadState('load');
        }
    }
    async changeCaseListView() {
        await this.page.click(this.casesListViewDropdown);
        await this.page.waitForSelector(this.searchCaseListInput, { state: 'visible' });
        await this.page.fill(this.searchCaseListInput, 'All Open Cases');
        await this.page.waitForSelector(this.allOpenCasesOption, { state: 'visible' });
        await this.page.click(this.allOpenCasesOption);
    }
    async bufferSupplierCaseNumber() {
        await this.page.waitForSelector('table', { state: 'visible' });
        const supplierCaseNumber = await this.page.locator(this.caseNumber).textContent();
        return supplierCaseNumber;
    }
    async clickOnRRC() {
        await this.page.waitForSelector(this.quickLinksTitle, { state: 'visible' });//Need to be commented
        await this.page.waitForSelector(this.rrcButton, { visible: true });
        await this.page.click(this.rrcButton);
    }

    async clickOnMyRRCButton() {
        await this.page.waitForSelector(this.myRRCButton, { visible: true });
        await this.page.click(this.myRRCButton);
    }
    async selectDivision(division) {
        try {
            //Checking if the popup is visible and closing it
            const popupSelector = this.page.locator(this.rrcPopup);
            await this.page.waitForSelector(popupSelector, {state: 'visible', timeout: 15000});
            console.log('Popup appeared');
            await this.page.click(this.rrcPopupClose); 
        } catch (e) {
            console.log('RRC Popup did not appear within the timeout');
            await this.page.waitForSelector(this.divisionDropdown, { state: 'visible' });
            await this.page.selectOption(this.divisionDropdown, { value: division });
        }

    }
    async selectTradingDept(tradingDept) {
        await this.page.waitForSelector(this.tradingDeptDropdown, { state: 'visible' });
        await this.page.locator(this.tradingDeptDropdown).click();
        await this.page.getByPlaceholder('Search', { exact: true }).waitFor({ state: 'visible' });
        await this.page.getByPlaceholder('Search', { exact: true }).click();
        await this.page.getByPlaceholder('Search', { exact: true }).fill(tradingDept);
        await this.page.waitForSelector("span[title='${tradingDept}']", { state: 'visible' });
        await this.page.click("span[title='${tradingDept}']");
    }
    async selectSubcategory(subcategory) {
        await this.page.locator(this.subcategoryDropdown).click();
        await this.page.getByPlaceholder('Search', { exact: true }).waitFor({ state: 'visible' });
        await this.page.getByPlaceholder('Search', { exact: true }).click();
        await this.page.getByPlaceholder('Search', { exact: true }).fill(subcategory);
        await this.page.waitForSelector("span[title='${subcategory}']", { state: 'visible' }); 
        await this.page.click("span[title='${subcategory}']");
    }
    async changeRRCListView() {
        await this.page.waitForSelector(this.RRCListViewDropdown, { state: 'visible' });
        await this.page.click(this.RRCListViewDropdown);
        await this.page.waitForSelector(this.searchRRCListInput, { state: 'visible' });
        await this.page.fill(this.searchRRCListInput, 'All Active');
        await this.page.waitForSelector(this.allAciveRRCOption, { state: 'visible' });
        await this.page.click(this.allAciveRRCOption);
    }
    async searchRRCList(RRC){
        await this.page.waitForSelector(this.searchRRCInput, { state: 'visible' });
        await this.page.fill(this.searchRRCInput, RRC);
        await this.page.locator(this.searchRRCInput).press('Enter');
    }
    async clickOnRangeReviewName() {
        await this.page.waitForSelector(this.rangeReviewName, { state: 'visible' });
        await this.page.click(this.rangeReviewName);
    }
    async clickOnAddArticle() {
        console.log('Waiting for Add Article button to be visible');
        await this.page.waitForSelector(this.addArticleButton, { state: 'visible' });
        console.log('Add Article button is visible, clicking it now');
        await this.page.click(this.addArticleButton);
        await this.page.waitForLoadState('load');
    }
    async calculateGTIN() {

    }
}