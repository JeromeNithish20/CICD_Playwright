export class RangeReviewFlow{
    constructor(page){
        this.page = page;
        //Product Overview
        this.GTINInput = 'input[placeholder="*Enter GTIN"]';
        this.lookupButton = "//button[text()='Lookup']";
        this.gtinSuccessMsg = "span[class='thanksMsg']";
        this.articleTypeDropdown = "(//select[@class='slds-select'])[1]";
        this.articleClassDropdown = "(//select[@class='slds-select'])[2]";
        this.articleCategoryDropdown = "(//select[@class='slds-select'])[3]";
        this.isForHumanConsumptionDropdown = "(//select[@class='slds-select'])[4]"; 
        this.DataSource_Y_N = "//select[@name='ThirdParty']";
        this.MPD_DataSource = "(//select[@name='drpDownValue'])[1]";
        this.OnPack_DataSource = "(//select[@name='drpDownValue'])[2]";
        this.Image_DataSource = "(//select[@name='drpDownValue'])[3]";
        this.nextButton = "//button[text()='Next']";
        //Product Details
        this.productName = "input[name='txtProductName']";
        this.minShefLife = "input[placeholder='Min']";
        this.maxShefLife = "input[placeholder='Max']";
        this.unitsSoldPerStore = "(//input[@class='slds-input'])[4]";
        this.storesRanged = "(//input[@class='slds-input'])[5]";
        this.distributionMethodDropdown = "(//select[@class='slds-select'])[1]";

    }
    async enterGTIN(gtin){
        await this.page.waitForLoadState('load');
        await this.page.getByPlaceholder('*Enter GTIN').waitFor({ state: 'visible' });
        await this.page.getByPlaceholder('*Enter GTIN').fill(gtin);
    }
    async clickOnLookup(){
        await this.page.waitForSelector(this.lookupButton, { state: 'visible' });
        await this.page.click(this.lookupButton);
    }
    async verifyGTINSuccessMsg(){
        await this.page.waitForSelector(this.gtinSuccessMsg, { state: 'visible' });
    }
    async selectArticleType(articleType){
        await this.page.waitForSelector(this.articleTypeDropdown, { state: 'visible' });
        await this.page.selectOption(this.articleTypeDropdown, { value: articleType });
    }
    async selectArticleClass(articleClass){
        await this.page.waitForSelector(this.articleClassDropdown, { state: 'visible' });
        await this.page.selectOption(this.articleClassDropdown, { value: articleClass });
    }
    async selectArticleCategory(articleCategory){
        await this.page.waitForSelector(this.articleCategoryDropdown, { state: 'visible' });
        await this.page.selectOption(this.articleCategoryDropdown, { value: articleCategory });
    }
    async selectIsForHumanConsumption(yes_no){
        await this.page.waitForSelector(this.isForHumanConsumptionDropdown, { state: 'visible' });
        await this.page.selectOption(this.isForHumanConsumptionDropdown, { value: yes_no });
    }
    async selectDataSource(yes_no){
        await this.page.waitForSelector(this.DataSource_Y_N, { state: 'visible' });
        await this.page.selectOption(this.DataSource_Y_N, { value: yes_no });
    }
    async clickOnNext(){
        await this.page.waitForSelector(this.nextButton, { state: 'visible' });
        await this.page.click(this.nextButton);
    }
    async enterProductDescription(productName, minShefLife, maxShefLife){
        await this.page.waitForSelector(this.productName, { state: 'visible' });
        await this.page.fill(this.productName, productName);
        await this.page.waitForSelector(this.minShefLife, { state: 'visible' });
        await this.page.fill(this.minShefLife, minShefLife);
        await this.page.waitForSelector(this.maxShefLife, { state: 'visible' });
        await this.page.fill(this.maxShefLife, maxShefLife);
    }
    async enterProductDistribution(unitsSoldPerStore, storesRanged, distributionMethod){
        await this.page.waitForSelector(this.unitsSoldPerStore, { state: 'visible' });
        await this.page.fill(this.unitsSoldPerStore, unitsSoldPerStore);
        await this.page.waitForSelector(this.storesRanged, { state: 'visible' });
        await this.page.fill(this.storesRanged, storesRanged);
        await this.page.waitForSelector(this.distributionMethodDropdown, { state: 'visible' });
        await this.page.selectOption(this.distributionMethodDropdown, { value: distributionMethod });
    }
}