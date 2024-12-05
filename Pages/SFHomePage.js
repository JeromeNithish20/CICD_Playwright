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
    }

    async gotoHome(){
        if(!(this.page.locator('button[title="Show Navigation Menu"]').isVisible())){
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
}