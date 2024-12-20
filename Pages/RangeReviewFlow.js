import { expect } from '@playwright/test';
export class RangeReviewFlow {
    constructor(page) {
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
        this.minShelfLife = "input[placeholder='Min']";
        this.maxShelfLife = "input[placeholder='Max']";
        this.unitsSoldPerStore = "(//input[@class='slds-input'])[4]";
        this.storesRanged = "(//input[@class='slds-input'])[5]";
        this.distributionMethodDropdown = "(//select[@class='slds-select'])[1]";
        //Product Packaging
        this.unitOfMeasureDropdown = "//select[@class='slds-select']";
        this.consumerUnitCheckbox = "(//span[@class='slds-checkbox_faux'])[1]";
        this.innerPackCheckbox = "(//span[@class='slds-checkbox_faux'])[2]";
        this.outerPackCheckbox = "(//span[@class='slds-checkbox_faux'])[3]";
        this.baseUnitPrice = "(//input[@class='slds-input'])[2]";
        this.confirmPopup = "(//button[@class='wm-visual-design-button'])[1]";
        // "6ded4672-62f8-4a57-83df-84d720416dbd";
        //"//button[contains(text(),'I have')]"
        //Product pricing
        this.consumerUnit = "(//span[@class='slds-radio_faux'])[1]";
        this.addPriceButton_consUnit = "//button[text()='+ Add Price']";
        this.effectiveDate = "//input[@name='txtEffectiveDate']";
        this.list_firstCostPrice = "//input[@name='inputPriceKg']";
        this.selectRegion = "//select[@name='selRegion']";
        this.selectDeliveryMethod = "//select[@name='selDeliveryMethod']";
        this.invoiceCost = "(//input[@class='slds-input'])[16]";
        this.netCost = "(//input[@class='slds-input'])[17]";
        this.addButton = "//button[text()='Add']";
        this.priceTable = "//table/tbody/tr/th";
        //Submit Range Review
        this.summaryReview = "//h4[text()='Summary Review']";
        this.submitButton = "//button[text()='Submit']";
        this.RRC_SuccessMessage = "//div[@class='c-container']/div/div/p/b";

    }
    async enterGTIN(gtin) {
        await this.page.waitForLoadState('load');
        await this.page.getByPlaceholder('*Enter GTIN').waitFor({ state: 'visible' });
        await this.page.getByPlaceholder('*Enter GTIN').fill(gtin);
    }
    async clickOnLookup() {
        await this.page.waitForSelector(this.lookupButton, { state: 'visible' });
        await this.page.click(this.lookupButton);
        // await this.page.waitForLoadState('networkidle');
    }
    async verifyGTINSuccessMsg(GTIN_SuccessMsg) {
        await this.page.waitForSelector(this.gtinSuccessMsg, { state: 'visible' });
        const actual_GTIN_SuccessMsg = await this.page.locator(this.gtinSuccessMsg).textContent();
        expect(actual_GTIN_SuccessMsg).toContain(GTIN_SuccessMsg);
    }
    async selectArticleType(articleType) {
        await this.page.waitForSelector(this.articleTypeDropdown, { state: 'visible' });
        await this.page.selectOption(this.articleTypeDropdown, { value: articleType });
    }
    async selectArticleClass(articleClass) {
        await this.page.waitForSelector(this.articleClassDropdown, { state: 'visible' });
        await this.page.selectOption(this.articleClassDropdown, { value: articleClass });
    }
    async selectArticleCategory(articleCategory) {
        await this.page.waitForSelector(this.articleCategoryDropdown, { state: 'visible' });
        await this.page.selectOption(this.articleCategoryDropdown, { value: articleCategory });
    }
    async selectIsForHumanConsumption(yes_no) {
        await this.page.waitForSelector(this.isForHumanConsumptionDropdown, { state: 'visible' });
        await this.page.selectOption(this.isForHumanConsumptionDropdown, { value: yes_no });
    }
    async selectDataSource(yes_no) {
        await this.page.waitForSelector(this.DataSource_Y_N, { state: 'visible' });
        await this.page.selectOption(this.DataSource_Y_N, { value: yes_no });
    }
    async clickOnNext() {
        await this.page.waitForSelector(this.nextButton, { state: 'visible' });
        await this.page.click(this.nextButton);
        // await this.page.waitForLoadState('networkidle');
        // await this.page.waitForTimeout(3000);
    }
    async enterProductDescription(productName, minShelfLife, maxShelfLife) {
        await this.page.locator(this.productName).waitFor({ state: 'visible' });
        await this.page.fill(this.productName, productName);
        await this.page.waitForSelector(this.minShelfLife, { state: 'visible' });
        await this.page.fill(this.minShelfLife, minShelfLife);
        await this.page.waitForSelector(this.maxShelfLife, { state: 'visible' });
        await this.page.fill(this.maxShelfLife, maxShelfLife);
    }
    async enterProductDistribution(unitsSoldPerStore, storesRanged, distributionMethod) {
        await this.page.waitForSelector(this.unitsSoldPerStore, { state: 'visible' });
        await this.page.fill(this.unitsSoldPerStore, unitsSoldPerStore);
        await this.page.waitForSelector(this.storesRanged, { state: 'visible' });
        await this.page.fill(this.storesRanged, storesRanged);
        await this.page.waitForSelector(this.distributionMethodDropdown, { state: 'visible' });
        await this.page.selectOption(this.distributionMethodDropdown, { value: distributionMethod });
    }
    async selectUnitOfMeasure(unitOfMeasure) {
        await this.page.waitForSelector(this.unitOfMeasureDropdown, { state: 'visible' });
        await this.page.selectOption(this.unitOfMeasureDropdown, { value: unitOfMeasure });
    }
    async selectConsumerUnit() {
        await this.page.waitForSelector(this.consumerUnitCheckbox, { state: 'visible' });
        await this.page.click(this.consumerUnitCheckbox);
    }
    async enterBaseUnitPrice(baseUnitPrice) {
        await this.page.waitForSelector(this.baseUnitPrice, { state: 'visible' });
        await this.page.fill(this.baseUnitPrice, baseUnitPrice);
    }
    async hoverOnNext() {
        await this.page.hover(this.nextButton);
    }
    async acceptConfirmPopup() {
        // await this.page.waitForSelector(this.confirmPopup, { state: 'visible' });
        await this.page.click(this.confirmPopup);
    }
    async selectProductUnit() {
        await this.page.waitForSelector(this.consumerUnit, { state: 'visible' });
        await this.page.click(this.consumerUnit);
    }
    async clickOnAddPrice() {
        await this.page.waitForSelector(this.addPriceButton_consUnit, { state: 'visible' });
        await this.page.click(this.addPriceButton_consUnit);
    }
    async getTodaysDate() {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0'); // Two-digit day
        const month = today.toLocaleString('default', { month: 'short' }); // Short month name (e.g., Jan, Feb)
        const year = today.getFullYear(); // Full year (e.g., 2024)
        const formattedDate = `${day} ${month} ${year}`;
        return formattedDate;
        }
    async enterPriceDetails(effectiveDate, list_firstCostPrice, selectDeliveryMethod, invoiceCost, netCost){
            await this.page.waitForSelector(this.effectiveDate, { state: 'visible' });
            await this.page.fill(this.effectiveDate, effectiveDate);
            await this.page.waitForSelector(this.list_firstCostPrice, { state: 'visible' });
            await this.page.fill(this.list_firstCostPrice, list_firstCostPrice);
            // await this.page.waitForSelector(this.selectRegion, { state: 'visible' });
            // await this.page.selectOption(this.selectRegion, { value: selectRegion });
            await this.page.waitForSelector(this.selectDeliveryMethod, { state: 'visible' });
            await this.page.selectOption(this.selectDeliveryMethod, { value: selectDeliveryMethod });
            await this.page.waitForSelector(this.invoiceCost, { state: 'visible' });
            await this.page.fill(this.invoiceCost, invoiceCost);
            await this.page.waitForSelector(this.netCost, { state: 'visible' });
            await this.page.fill(this.netCost, netCost);
        }
    async clickOnAdd(){
            await this.page.waitForSelector(this.addButton, { state: 'visible' });
            await this.page.click(this.addButton);
            await this.page.waitForSelector(this.priceTable, { state: 'visible' });
        }
    async clickOnSubmit(){
            await this.page.waitForSelector(this.summaryReview, { state: 'visible' });
            await this.page.waitForSelector(this.submitButton, { state: 'visible' });
            await this.page.click(this.submitButton);
        }
    async verifyRRCSuccessMessage(RRC_SuccessMessage){
            await this.page.waitForSelector(this.RRC_SuccessMessage, { state: 'visible' });
            const actual_RRC_SuccessMessage = await this.page.locator(this.RRC_SuccessMessage).textContent();
            expect(actual_RRC_SuccessMessage).toContain(RRC_SuccessMessage);
        }
    }