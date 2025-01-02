import { expect } from '@playwright/test';
export class SF_CasesPage {
    constructor(page) {
        this.page = page;
        this.accountNameLink = "//span[@class='slds-truncate']/slot[text()='${accountName}']";
        this.caseOwner = "//p[@title='Case Owner']/following-sibling::p/slot";
        this.editCaseStatus_btn = "(//slot/*[text()='$caseNo']/ancestor::dl)[2]//button[@title='Edit Status']";
        this.caseStatus = "//p[@title='Status']/following-sibling::p/slot";
        this.caseStatusDropdown = "//*[text()='$caseNo']/ancestor::records-record-layout-row/following-sibling::records-record-layout-row//button[@aria-label='Status']";
        this.caseStatusDropdown_successful = "span[title='${status}']";
        this.saveButton = "//button[@name='SaveEdit']";
        this.editCaseOwner_btn = "//*[text()='$caseNo']/ancestor::records-record-layout-item/following-sibling::records-record-layout-item//button[@title='Edit Case Owner']";
        this.clearCaseOwner = "//label[text()='Case Owner']/following-sibling::div//button";
        this.caseOwner_type = "//label[text()='Case Owner']/following-sibling::div//button/span";
        this.caseOwner_User = "//span[@title='User']";
        this.caseOwner_Input = "//label[text()='Case Owner']/following-sibling::div//input";
        this.caseOwnerDropdownValue = "(//span//*[@title='${user}'])[1]";
        this.showMoreActions = "//slot[text()='${accountName}']/ancestor::div[@class='secondaryFields']/preceding-sibling::div//*[contains(text(),'Show')]/parent::button";
        this.sendToSAP = "//*[@title='Send to SAP']//a";
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
    async clickOnShowMoreActions(accountName) {
        const showMoreActions = this.showMoreActions.replace('${accountName}', accountName);
        await this.page.waitForSelector(showMoreActions, { state: 'visible' });
        await this.page.click(showMoreActions);
    }
    async clickOnSendToSAP() {
        await this.page.waitForSelector(this.sendToSAP, { state: 'visible' });
        await this.page.click(this.sendToSAP);
        await this.page.waitForTimeout(2000);
        await this.page.waitForSelector(this.showMoreActions, { state: 'hidden' });
    }
}