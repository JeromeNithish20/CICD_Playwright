exports.SFHomePage = 
class SFHomePage{

    constructor(page){

        this.page=page;
        this.navMenu='button[title="Show Navigation Menu"]';
        this.homeMenu='//ul[@role="menu"]//span[text()="Home"]';
        this.globalSearch = 'button[aria-label="Search"]';
        this.globalSearchBox ='Search...'
        this.contactName = 'span[title="Akhil NPC"]';
        this.loginToExperienceAsUser= 'button[name="LoginToNetworkAsUser"]';
        this.myActiveCases ="a[title$='My Active Cases']";
        this.contactResultTab = "//span[normalize-space()='Contacts']";
        this.accountResultTab = "//span[normalize-space()='Accounts']";
        this.tableLocator = "//table[contains(@class,'slds-table')]";
        this.tableRows = "tbody tr";
        this.accountNameLink = "th span a";
    }

    async gotoHome(){
        if(!(this.page.locator(this.navMenu).isVisible())){
        await this.page.locator(this.navMenu).waitFor({ state: 'visible' });
        await this.page.click(this.navMenu);
        await this.page.locator(this.homeMenu).waitFor({ state: 'visible' });
        await this.page.click(this.homeMenu);
        await this.page.waitForSelector(this.myActiveCases, { visible: true });
        await this.page.waitForSelector(this.globalSearch, { visible: true });
        }
    }
    async loginAsSupplier(contact){
        await this.page.click(this.globalSearch);
        await this.page.getByPlaceholder(this.globalSearchBox).fill(contact);
        await this.page.click(this.contactName);
    }
    async clickOnLogin()
    {
        await this.page.locator(this.loginToExperienceAsUser, { state: 'visible' });
        await this.page.click(this.loginToExperienceAsUser);
        await this.page.waitForLoadState('load');
    }
    async searchAccount(account){
        await this.page.waitForSelector(this.globalSearch, { visible: true });
        await this.page.click(this.globalSearch);
        await this.page.getByPlaceholder(this.globalSearchBox).fill(account);
        await this.page.getByPlaceholder(this.globalSearchBox).press('Enter');
    }
    async clickOnAccountResultTab(){
        await this.page.waitForSelector(this.accountResultTab, { visible: true });
        await this.page.click(this.accountResultTab);
    }
    async clickOnAccount(accountName){
        // await this.page.locator(this.tableLocator).waitFor({ state: 'visible' });
        const table = await this.page.locator(this.tableLocator);
        await table.waitFor({ state: 'visible' });
        const rows = table.locator(this.tableRows);
        console.log("No. of rows: ", await rows.count());
        const matchedAccount = await rows.filter({
            has: await this.page.locator(this.accountNameLink).locator(`text=${accountName}`)
        });
        await matchedAccount.first().click();
    }
}