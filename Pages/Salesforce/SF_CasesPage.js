import { expect } from '@playwright/test';
export class SF_CasesPage {
    constructor(page) {
        this.page = page;
        this.accountNameLink = "//span[@class='slds-truncate']/slot[text()='${accountName}']";
        this.caseOwner = "//p[@title='Case Owner']/following-sibling::p/slot";
        this.editCaseStatus_btn = "(//slot/*[text()='$caseNo']/ancestor::dl)[2]//button[@title='Edit Status']";
        this.caseStatus = "//p[@title='Status']/following-sibling::p/slot";//"(//dl[@class='slds-form'])[1]//span[text()='Status']/../../following-sibling::dd//*[@slot='outputField']";
        this.caseStatusDropdown = "//*[text()='$caseNo']/ancestor::records-record-layout-row/following-sibling::records-record-layout-row//button[@aria-label='Status']";//"(//dl[@class='slds-form'])[1]//button[@aria-label='Status']";
        this.caseStatusDropdown_successful = "span[title='${status}']";
        this.saveButton = "//button[@name='SaveEdit']";
        this.editCaseOwner_btn = "//*[text()='$caseNo']/ancestor::records-record-layout-item/following-sibling::records-record-layout-item//button[@title='Edit Case Owner']";
        this.clearCaseOwner = "//label[text()='Case Owner']/following-sibling::div//button";
        this.caseOwner_type = "//label[text()='Case Owner']/following-sibling::div//button/span";
        this.caseOwner_User = "//span[@title='User']";
        this.caseOwner_Input = "//label[text()='Case Owner']/following-sibling::div//input";
        this.caseOwnerDropdownValue = "(//span//*[@title='${user}'])[1]";
        this.showMoreActions = "//a[contains(@title,'$caseNo')]/ancestor::div[contains(@class,'tabsetHeader')]/following-sibling::div//span[text()='Show more actions']/parent::button";
        // //"//span[text()='Show more actions']/parent::button";
        this.sendToSAP = "//*[@title='Send to SAP']//a";
        //Account Details
        this.vendorNumber = "//p[@title='Vendor Number']/following-sibling::p/slot/*";
        this.editSearchTerm1 = "button[title='Edit Search Term1']";
        this.searchTerm1 = "input[name='Search_Term1__c']";
        this.searchTerm2 = "input[name='Search_Term2__c']";
        this.editTradingTerm_btn = "button[title='Edit Trading Term']";
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
    }
    async clickOnEditCaseStatus(caseNo) {
        const editCaseStatus_btn = this.editCaseStatus_btn.replace("$caseNo", caseNo);
        await this.page.waitForSelector(editCaseStatus_btn, { state: 'visible' });
        await this.page.click(editCaseStatus_btn);
    }
    async changeCaseStatus(caseNo, status) {
        // await this.page.waitForSelector(this.saveButton, { state: 'hidden' });
        const caseStatusDropdown = this.caseStatusDropdown.replace("$caseNo", caseNo);
        await this.page.waitForSelector(caseStatusDropdown, { state: 'visible' });
        await this.page.click(caseStatusDropdown);
        const dynamicStatus = this.caseStatusDropdown_successful.replace("${status}", status);
        await this.page.waitForSelector(dynamicStatus, { state: 'visible' });
        await this.page.click(dynamicStatus);
    }
    async changeCaseOwner_User(caseNo, user) {
        const editCaseOwner_btn = this.editCaseOwner_btn.replace("$caseNo", caseNo);
        await this.page.waitForSelector(editCaseOwner_btn, { state: 'visible' });
        await this.page.click(editCaseOwner_btn);
        const isClearCaseOwnerVisible = await this.page.locator(this.clearCaseOwner).isVisible();
        if (isClearCaseOwnerVisible) {
            await this.page.waitForTimeout(1000);
            await this.page.click(this.clearCaseOwner);
            const caseOwnerType = await this.page.locator(this.caseOwner_type).textContent();
            if (caseOwnerType === 'Queue') {
                await this.page.click(this.caseOwner_type);
                await this.page.click(this.caseOwner_User);
            }
        }
        const caseOwner_inputBox = await this.page.locator(this.caseOwner_Input);
        await caseOwner_inputBox.waitFor({ state: 'visible' });
        await caseOwner_inputBox.fill(user);
        await caseOwner_inputBox.press('Space');
        const dynamicUserOption = this.caseOwnerDropdownValue.replace("${user}", user);
        const dynamicUserOption_locator = await this.page.locator(dynamicUserOption);
        await dynamicUserOption_locator.waitFor({ state: 'visible' });
        await dynamicUserOption_locator.click();
    }
    async clickOnSave() {
        await this.page.waitForSelector(this.saveButton, { state: 'visible' });
        await this.page.click(this.saveButton);
        await this.page.waitForSelector(this.saveButton, { state: 'hidden' });
    }
    async verifyCaseDetails(expected_CaseOwner, expected_CaseStatus) {
        await this.page.waitForSelector(this.caseOwner, { state: 'visible' });
        const caseOwner = await this.page.locator(this.caseOwner).innerText();
        expect(caseOwner).toContain(expected_CaseOwner);
        await this.page.waitForSelector(this.caseStatus, { state: 'visible' });
        const actual_caseStatus = await this.page.locator(this.caseStatus).innerText();
        expect(actual_caseStatus).toContain(expected_CaseStatus);
    }
    async reloadPageUntilReviewStatus() {
        while (true) {
            await this.page.waitForLoadState('load');
            await this.page.reload({ waitUntil: 'load' });
            await this.page.waitForTimeout(2000);
            const actual_caseStatus = await this.page.locator(this.caseStatus).innerText();
            if (actual_caseStatus.includes("In Review")) {
                break;
            }
        }
    }
    async reloadPage() {
        await this.page.reload();
    }
    async navigateToAccount(accountName) {
        const accountNameLink = this.accountNameLink.replace("${accountName}", accountName);
        await this.page.locator(accountNameLink).waitFor({ state: 'visible' });
        await this.page.locator(accountNameLink).click();
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
    async clickOnShowMoreActions(caseNo) {
        const showMoreActions = this.showMoreActions.replace('$caseNo', caseNo);
        await this.page.waitForSelector(showMoreActions, { state: 'visible' });
        await this.page.click(showMoreActions);
    }
    async clickOnSendToSAP() {
        await this.page.waitForSelector(this.sendToSAP, { state: 'visible' });
        await this.page.click(this.sendToSAP);
        await this.page.waitForTimeout(2000);
        await this.page.waitForSelector(this.showMoreActions, { state: 'hidden' });
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