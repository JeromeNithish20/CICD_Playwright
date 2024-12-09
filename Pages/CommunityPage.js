import { expect } from "@playwright/test";
export class CommunityPage {
    constructor(page) {
        this.page = page;
        this.title = 'Community';
        this.pageURL = 'https://woolworths--phuat.sandbox.my.site.com/s/';
        this.accountName = '.textReg:nth-child(2)';
        this.welcomePopup = "(//span[contains(text(),'Welcome to Partner Hub')])[2]";
        this.welcomePopupClose = "Stop Walk-thru";
        this.casesButton = "//span[text()='Cases']";
        this.casesListViewDropdown = "button[title='Select a List View: Cases']";
        this.searchListInput = "input[placeholder='Search lists...']";
        this.allOpenCasesOption = "//mark[text()='All Open Cases']";
        this.caseNumber = "table tbody tr th a";
        this.rrcButton =" //span[text()='Range Review Calendar (CDS)']";
        this.rrcPopup = "//button[text()='How to Submit a New Product']";
        this.rrcPopupClose = '//button[@class="wm-visual-design-button"]/div';
        this.myRRCButton = "//button[text()='My Subscribed Range Review Calendar']";

    }
    async displayAccountName(){
        await this.page.waitForSelector(this.accountName, { state: 'visible' });
        const actual_accountName = this.page.locator(this.accountName).textContent();
        console.log('Account Name:' , actual_accountName);
    }
    async verifyPageTitle(){
        await expect.soft(this.page).toHaveURL(this.pageURL);
    }
    async closeWelcomePopup(){
        if (await this.page.isVisible(this.welcomePopup)){
            await this.page.click(this.welcomePopupClose);
        }
    }
    async clickOnCases(){
        await this.page.click(this.casesButton);
        await this.page.waitForLoadState('load');
    }
    async clickOnRRC(){
        await this.page.click(this.rrcButton);
    }
  
    async clickOnMyRRCButton(){
        if (await this.page.isVisible(this.rrcPopup)){
            await this.page.click(this.rrcPopupClose);
        }
        await this.page.waitForSelector(this.myRRCButton, { visible: true });
        await this.page.click(this.myRRCButton);
    }
    async changeListView(){
        await this.page.click(this.casesListViewDropdown);
        await this.page.waitForSelector(this.searchListInput, { state: 'visible' });
        await this.page.fill(this.searchListInput, 'All Open Cases');
        await this.page.waitForSelector(this.allOpenCasesOption, { state: 'visible' });
        await this.page.click(this.allOpenCasesOption);
    }   
    async bufferSupplierCaseNumber(){
        await this.page.waitForSelector('table', { state: 'visible' });
        const supplierCaseNumber = await this.page.locator(this.caseNumber).textContent();
        return supplierCaseNumber;
    }
}