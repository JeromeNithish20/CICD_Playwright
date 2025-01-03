import { expect } from '@playwright/test';
export class SF_AccountPage {
    constructor(page) {
        this.page = page;
        //Highlight Panel
        this.vendorNumber = "//p[@title='Vendor Number']/following-sibling::p/slot/*";
        this.businessUnit = "//p[@title='Business Organization']/following-sibling::p/slot/*";
        this.contactDetailsTab = "(//a[text()='Contact Details'])[2]";
        //Business Details
        this.abnNzbnField = "(//span[text()='ABN/NZBN']/../../following-sibling::dd//*[@slot='output'])";
        this.recordTypeField = "(//span[text()='Record Type']/../../following-sibling::dd//*[@slot='output'])";
        this.targetCountryField = "(//span[text()='Target Country']/../../following-sibling::dd//*[@slot='output'])";
        this.editSearchTerm1 = "button[title='Edit Search Term1']";
        this.searchTerm1 = "input[name='Search_Term1__c']";
        this.searchTerm2 = "input[name='Search_Term2__c']";
        this.editTradingTerm_btn = "button[title='Edit Trading Term']";
        //Trading Terms
        this.tadingTerm_Input = "input[placeholder='Search Trading Terms...']";
        this.tradingTerm_Value = "[title='$tradeTerm']";
        this.tradingTermTab = "//a[text()='Trading Terms']";
        this.tradingTermName = "//slot[text()='${tradingTermName}']";
        this.editRefVendor_btn = "//button[@title='Edit Reference Vendor']";
        this.refVendorDropdown = "//label[text()='Reference Vendor']/following-sibling::div//button";
        this.refVendorDropdownOption = "span[title='${refVendor}']";
        this.paymentMethod = "[title='EFT Payment(EDG trans only)']";
        this.moveToChosen = "[title='Move to Chosen']";
        this.paymentTermsCodeDropdown = "//label[text()='Payment Terms Code']/following-sibling::div//button";
        this.paymentTermsCodeOption = "span[title='${paymentTermsCode}']";
        this.saveButton = "//button[@name='SaveEdit']";
    }
    async verifyAccountDetails(exp_abn, exp_country) {
        await this.page.locator(this.abnNzbnField).waitFor({ state: 'visible' });
        const act_abnNzbn = await this.page.locator(this.abnNzbnField).innerText();
        expect(act_abnNzbn).toContain(exp_abn);
        const act_recordType = await this.page.locator(this.recordTypeField).innerText();
        expect(act_recordType).toContain('Supplier');
        const act_targetCountry = await this.page.locator(this.targetCountryField).innerText();
        expect(act_targetCountry).toContain(exp_country);
    }
    async clickOnContactDetails(fullName) {
        await this.page.getByRole('tab', { name: 'Contact Details' }).waitFor({ state: 'visible' });
        await this.page.getByRole('tab', { name: 'Contact Details' }).click();
        await this.page.getByRole('cell', { name: fullName }).waitFor({ state: 'visible' });
        await this.page.getByRole('cell', { name: fullName }).click();
    }
    async clickOnLoginToExperienceAsUser() {
        await this.page.getByRole('button', { name: 'Log in to Experience as User' }).waitFor({ state: 'visible' });
        await this.page.getByRole('button', { name: 'Log in to Experience as User' }).click();
        await this.page.waitForLoadState('load');
    }
    async clickOnSave() {
        await this.page.waitForSelector(this.saveButton, { state: 'visible' });
        await this.page.click(this.saveButton);
        await this.page.waitForSelector(this.saveButton, { state: 'hidden' });
    }
    async clickOnEditSearchTerm1() {
        await this.page.waitForSelector(this.editSearchTerm1, { state: 'visible' });
        await this.page.click(this.editSearchTerm1);
    }
    async enterSearchTerms(accountName) {
        await this.page.waitForSelector(this.searchTerm1, { state: 'visible' });
        const searchTerm1_Value = accountName.substring(0, 4);
        await this.page.fill(this.searchTerm1, searchTerm1_Value);
        await this.page.waitForSelector(this.searchTerm2, { state: 'visible' });
        const searchTerm2_Value = accountName.substring(0, 6);
        await this.page.fill(this.searchTerm2, searchTerm2_Value);
    }
    async clickOnEditTradingTerm() {
        await this.page.waitForSelector(this.editTradingTerm_btn, { state: 'visible' });
        await this.page.click(this.editTradingTerm_btn);
    }
    async enterTradingTerm(tradingTerm) {
        await this.page.waitForSelector(this.tadingTerm_Input, { state: 'visible' });
        await this.page.fill(this.tadingTerm_Input, tradingTerm);
        await this.page.locator(this.tadingTerm_Input).press('Space');
        const tradingTermValue = this.tradingTerm_Value.replace("$tradeTerm", tradingTerm);
        await this.page.waitForSelector(tradingTermValue, { state: 'visible' });
        await this.page.click(tradingTermValue);
    }
    async clickOnTradingTermTab() {
        await this.page.waitForSelector(this.tradingTermTab, { state: 'visible' });
        await this.page.click(this.tradingTermTab);
    }
    async openTradingTerm(tradingTermName) {
        const tradingTerm = await this.page.locator(this.tradingTermName.replace('${tradingTermName}', tradingTermName));
        await tradingTerm.waitFor({ state: 'visible' });
        await tradingTerm.click();
    }
    async clickOnEditRefVendor() {
        await this.page.waitForSelector(this.editRefVendor_btn, { state: 'visible' });
        await this.page.click(this.editRefVendor_btn);
    }
    async selectRefVendor(refVendor) {
        await this.page.waitForSelector(this.refVendorDropdown, { state: 'visible' });
        await this.page.click(this.refVendorDropdown);
        const refVendorOption = this.refVendorDropdownOption.replace('${refVendor}', refVendor);
        await this.page.waitForSelector(refVendorOption, { state: 'visible' });
        await this.page.click(refVendorOption);
    }
    async selectPaymentMethod() {
        await this.page.waitForSelector(this.paymentMethod, { state: 'visible' });
        await this.page.click(this.paymentMethod);
        await this.page.waitForSelector(this.moveToChosen, { state: 'visible' });
        await this.page.click(this.moveToChosen);
    }
    async selectPaymentTermsCode(paymentTermsCode) {
        await this.page.waitForSelector(this.paymentTermsCodeDropdown, { state: 'visible' });
        await this.page.click(this.paymentTermsCodeDropdown);
        const paymentTermsCodeOption = this.paymentTermsCodeOption.replace('${paymentTermsCode}', paymentTermsCode);
        await this.page.waitForSelector(paymentTermsCodeOption, { state: 'visible' });
        await this.page.click(paymentTermsCodeOption);
    }
    async verifyAndBufferVendorNumber() {
        await this.page.waitForSelector(this.vendorNumber, { state: 'visible' });
        const vendorNumber = await this.page.locator(this.vendorNumber).textContent();
        expect(vendorNumber).not.toBeNull();
        console.log("Vendor Number: " + vendorNumber);
        return vendorNumber;
    }
    async navigateBack() {
        await this.page.goBack();
    }
}