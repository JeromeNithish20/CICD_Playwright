import { expect } from '@playwright/test';
export class guestSupplierPage {
    constructor(page) {
        this.page = page;
        //First Page
        this.pageUrl = 'https://woolworths--phuat.sandbox.my.site.com/s/';
        this.startApplicationButton = 'button:has-text("Start your application now")';
        this.abnInput = "input[placeholder$='Enter ABN']";
        this.lookupButton = "button:has-text('Lookup')";
        this.tradeDetailsText = "h6:has-text('Trade Partner Details')";
        this.entityNameDropdown = "(//Select[@class='slds-select'])[4]";
        this.entityNameDropdownOption = "((//select[@class='slds-select'])[4])//option[2]";
        this.tradingNameDropdown = "(//Select[@class='slds-select'])[5]";
        this.tradingNameInput = "input[placeholder$='Trading Name']";
        this.nextButton = "button:has-text('Next')";
        this.warningMessage = "//div[contains(text(),'Your company')]";
        //Second Page
        this.countryDropdown = "(//input[@class='slds-input slds-combobox__input'])[1]";
        this.countryOption = "span[title='Australia']";
        this.streetInput = "(//input[@class='slds-input'])[3]";
        this.townInput = "(//input[@class='slds-input'])[4]";
        this.stateDropdown = "(//Select[@class='slds-select'])[6]";
        this.postcodeInput = "(//input[@class='slds-input'])[5]";
        this.copyCheckbox = "(//*[@class='slds-checkbox_faux'])[1]";
        this.titleDropdown = "(//select[@class='slds-select'])[9]"
        this.firstNameInput = "(//input[@class='slds-input'])[10]";
        this.lastNameInput = "(//input[@class='slds-input'])[11]";
        this.jobTitleInput = "(//input[@class='slds-input'])[12]";
        this.emailInput = "(//input[@class='slds-input'])[13]";
        this.countryCodeDropdown = "(//select[contains(@class, 'countryCode')])[1]";
        this.contactNumberInput = "(//input[@class='slds-input'])[14]";
        //Third Page
        this.termsCheckbox = "(//*[@class='slds-checkbox_faux'])[2]";
        this.declarationCheckbox = "(//*[@class='slds-checkbox_faux'])[3]";
        this.captchaFrame = "//iframe[@title='reCAPTCHA']";
        this.captchaCheckbox = "#recaptcha-anchor";
        this.submitButton = "button:has-text('Submit')";
        //Final Page
        this.successMessage = "//h5[contains(@class,'slds-text')]";
    }
    async gotoSupplierPage() {
        await this.page.goto(this.pageUrl);
    }
    async clickOnStartApplication() {
        await this.page.click(this.startApplicationButton);
        await this.page.waitForLoadState('load');
    }
    async verifyPageTitle(pageName) {
        const pageTitle = await this.page.title();
        expect(pageTitle).toBe(pageName);
    }
    async enterAbn(abn) {
        // expect(this.page.title()).toHaveTitle('Supplier Onboarding');
        await this.page.fill(this.abnInput, abn);
    }
    async clickOnLookup() {
        await this.page.click(this.lookupButton);
    }
    async checkWarningMessage() {
        try {
            await this.page.waitForSelector(this.warningMessage, { state: 'visible', timeout: 5000 });
            return true;
        } catch (error) {
            return false;
        }
    }
    async getWarningMessage() {
        await this.page.waitForSelector(this.warningMessage, { visible: true });
        const warningMessage = await this.page.locator(this.warningMessage).textContent();
        return warningMessage;
    }

    async selectEntityName() {
        await this.page.waitForSelector(this.entityNameDropdown, { visible: true });
        await this.page.locator(this.entityNameDropdown).selectOption({ index: 1 });
        const entityNameDropdownValue = await this.page.locator(this.entityNameDropdownOption).textContent();
        return entityNameDropdownValue;
    }
    async selectCompanyTradingName() {
        await this.page.waitForSelector(this.tradingNameDropdown, { visible: true });
        await this.page.locator(this.tradingNameDropdown).selectOption({ value: 'Other' });
    }
    async enterTradingName(tradingName) {
        await this.page.waitForSelector(this.tradingNameInput, { visible: true });
        await this.page.fill(this.tradingNameInput, tradingName);
    }
    async clickOnNext() {
        await this.page.waitForSelector(this.nextButton, { visible: true });
        await this.page.click(this.nextButton);
    }
    async selectCountry(country) {
        await this.page.waitForSelector(this.countryDropdown, { visible: true });
        await this.page.type(this.countryDropdown, country);
        await this.page.waitForSelector(this.countryOption, { visible: true });
        await this.page.click(this.countryOption);
    }
    async enterStreet(street) {
        await this.page.waitForSelector(this.streetInput, { visible: true });
        await this.page.fill(this.streetInput, street);
    }
    async enterTown(town) {
        await this.page.waitForSelector(this.townInput, { visible: true });
        await this.page.fill(this.townInput, town);
    }
    async selectState() {
        await this.page.waitForSelector(this.stateDropdown, { visible: true });
        await this.page.locator(this.stateDropdown).selectOption({ index: 2 });
    }
    async enterPostcode(postcode) {
        await this.page.waitForSelector(this.postcodeInput, { visible: true });
        await this.page.fill(this.postcodeInput, postcode);
    }
    async clickOnCheckbox() {
        await this.page.click(this.copyCheckbox);
    }
    async fillContactDetails(firstName, lastName, jobTitle, email, contactNumber) {
        await this.page.waitForSelector(this.titleDropdown, { visible: true });
        await this.page.locator(this.titleDropdown).selectOption({ index: 1 });
        await this.page.fill(this.firstNameInput, firstName);
        await this.page.fill(this.lastNameInput, lastName);
        await this.page.fill(this.jobTitleInput, jobTitle);
        await this.page.fill(this.emailInput, email);
        await this.page.locator(this.countryCodeDropdown).selectOption({ value: 'Australia (+61)' });
        await this.page.fill(this.contactNumberInput, contactNumber);
    }
    async acceptTermsAndConditions() {
        await this.page.waitForSelector(this.termsCheckbox, { visible: true });
        await this.page.click(this.termsCheckbox);
        await this.page.click(this.declarationCheckbox);

    }
    async clickOnSubmit() {
        await this.page.waitForSelector(this.submitButton, { visible: true });
        await this.page.click(this.submitButton);
    }
    async verifySuccessMessage(expected_successMessage) {
        await this.page.waitForSelector(this.successMessage, { visible: true });
        const successMessage = await this.page.textContent(this.successMessage);
        console.log(successMessage);
        expect(successMessage)
            .toContain(expected_successMessage);

    }
}