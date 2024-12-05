import { expect } from '@playwright/test';
export class supplierPage{
    constructor(page){
        this.page = page;
        this.pageUrl = 'https://woolworths--phuat.sandbox.my.site.com/s/';
        this.startApplicationButton = 'button:has-text("Start your application now")';
        this.abnInput = "input[placeholder$='Enter ABN']";
        this.tradeDetailsText = "h6:has-text('Trade Partner Details')";
        this.entityName = "(//Select[@class='slds-select'])[4]";
    }
    async gotoSupplierPage(){
        await this.page.goto(this.pageUrl);
    }
    async clickOnStartApplication(){
        await this.page.click(this.startApplicationButton);
        await this.page.waitForLoadState('load');
    }
    async enterAbn(abn){
        // expect(this.page.title()).toBe('Supplier Onboarding');
        await this.page.fill(this.abnInput, abn);
    }   
    async clickOnLookup(){
        await this.page.click('button:has-text("Lookup")');
    }

    async selectEntityName(entityName){
        await this.page.click(this.entityName);
        await this.page.click(`text=${entityName}`);
    }
}