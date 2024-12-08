import { expect } from "@playwright/test";
export class CommunityPage {
    constructor(page) {
        this.page = page;
        this.title = 'Community';
        this.pageURL = 'https://woolworths--phuat.sandbox.my.site.com/s/';
        this.accountName = '.textReg:nth-child(2)';
        this.rrcButton =" //span[text()='Range Review Calendar (CDS)']";
        this.rrcPopup = "//button[text()='How to Submit a New Product']";
        this.rrcPopupClose = '//button[@class="wm-visual-design-button"]/div';
        this.myRRCButton = "//button[text()='My Subscribed Range Review Calendar']";

    }
    async displayAccountName(){
        await this.page.waitForSelector(this.accountName, { visible: true });
        console.log(this.page.locator(this.accountName).textContent());
    }
    async verifyPageTitle(){
        await expect.soft(this.page).toHaveURL(this.pageURL);
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
}