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
        this.searchListInput = "input[placeholder='Search lists...']";
        this.allOpenCasesOption = "//mark[text()='All Open Cases']";
        this.caseNumber = "table tbody tr th a";
        this.rrcButton = " //span[text()='Range Review Calendar (CDS)']";
        this.rrcPopup = "//button[text()='How to Submit a New Product']";
        this.rrcPopupClose = '//button[@class="wm-visual-design-button"]/div';
        this.divisionDropdown = "//select[@class='slds-select']";
        this.tradingDeptDropdown = "(//input[@placeholder='Select an Option'])[1]";
        this.subcategoryDropdown = "(//input[@placeholder='Select an Option'])[2]";
        this.myRRCButton = "//button[text()='My Subscribed Range Review Calendar']";

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
            await page.waitForSelector(popupSelector, { timeout: 5000 });
            console.log('Popup appeared');
            await page.click(this.welcomePopupClose);
        } catch (e) {
            await this.page.click(this.casesButton);
            await this.page.waitForLoadState('load');
        }
    }
    async changeListView() {
        await this.page.click(this.casesListViewDropdown);
        await this.page.waitForSelector(this.searchListInput, { state: 'visible' });
        await this.page.fill(this.searchListInput, 'All Open Cases');
        await this.page.waitForSelector(this.allOpenCasesOption, { state: 'visible' });
        await this.page.click(this.allOpenCasesOption);
    }
    async bufferSupplierCaseNumber() {
        await this.page.waitForSelector('table', { state: 'visible' });
        const supplierCaseNumber = await this.page.locator(this.caseNumber).textContent();
        return supplierCaseNumber;
    }
    async clickOnRRC() {
        await this.page.waitForSelector(this.rrcButton, { visible: true });
        await this.page.click(this.rrcButton);
    }

    async clickOnMyRRCButton() {
        if (await this.page.isVisible(this.rrcPopup)) {
            await this.page.click(this.rrcPopupClose);
        }
        await this.page.waitForSelector(this.myRRCButton, { visible: true });
        await this.page.click(this.myRRCButton);
    }
    async selectDivision(division) {
        try {
            //Checking if the popup is visible and closing it
            const popupSelector = this.page.locator(this.rrcPopup);
            await page.waitForSelector(popupSelector, {state: 'visible', timeout: 15000});
            console.log('Popup appeared');
            await page.click(this.rrcPopupClose); 
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
    async calculateGTIN() {

    }
}