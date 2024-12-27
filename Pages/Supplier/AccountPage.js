export class AccountPage{
    constructor(page){
        this.page = page;
        this.accountEditButton = "//a[@title='Edit']";
        this.accountNameOnSupplierCase = "(//a[text()='${accountName}'])[1]";
        this.fileName_inputBox = "//div[@class='slds-form-element__control']/input";
        this.documentTypeDropdown = "//select[@class='slds-select']";
        this.uploadFilesButton = "(//span[text()='Upload Files'])[1]";
        this.doneButton = "//span[text()='Done']";
        this.notesAndAttachments = "[aria-label='Notes & Attachments']";
        this.uploadedDoc = "span[title='${fileName}']";
        //Edit Account Pop-up
        this.businessOrganization = "//span[text()='Business Organization']/../following-sibling::div//a[@class='select']";
        this.businessOrganizationValue = "li a[title='${businessOrganization}']";
        this.accountExecutiveEmail = "//span[text()='Account Executive Email']/parent::label/following-sibling::input";
        this.financeManagerEmail = "//span[text()='Finance Manager Email']/parent::label/following-sibling::input";
        this.generalBusinessQueriesReceiptMethod = "//span[contains(text(), 'General Business')]/../following-sibling::div//a";
        this.remittanceAdviceReportReceiptMethod = "//span[contains(text(), 'Remittance Advice')]/../following-sibling::div//a";
        this.receiptMethod1 = "(//li/a[@title='PDF'])[1]";
        this.receiptMethod2 = "(//li/a[@title='PDF'])[2]";
        this.accountSaveButton = "button[title='Save']";

        this.tradingTermTab = "//a[text()='TRADING TERMS']";
        this.addTradingTermButton = "//button[text()='Add Trading Terms']";
        this.settlementTerms = "//span[text()='Settlement Terms']/../following-sibling::div//a";
        this.settlementTermsValue = "a[title='30 Days 3.75%']";
        this.rebateEffectiveDate_DatePicker = "//span[text()='Rebate Effective Date']/../following-sibling::div//a";
        this.rebateEffectiveDate = "//span[text()='Rebate Effective Date']/../following-sibling::div/input";
        this.tradingTermName = "//div[text()='Trading Term']/following-sibling::div/span";

    }
    async clickOnAccountNameOnSupplierCase(accountName) {
        const accountNameLink = await this.page.locator(this.accountNameOnSupplierCase.replace('${accountName}', accountName));
        await accountNameLink.waitFor({ state: 'visible' });
        await accountNameLink.click();
    }
    async uploadBankStatement(fileName) {
        await this.page.waitForSelector(this.fileName_inputBox, { state: 'visible' });
        await this.page.fill(this.fileName_inputBox, fileName);
        await this.page.locator(this.fileName_inputBox).press('Enter');
        await this.page.selectOption(this.documentTypeDropdown, { value: 'BankDocuments' });
        await this.page.locator(this.uploadFilesButton).setInputFiles('testdata/BanksDoc.xls');
        await this.page.waitForSelector(this.doneButton, { state: 'visible' });
        await this.page.click(this.doneButton);
        await this.page.waitForTimeout(5000);
        await this.page.waitForSelector(this.notesAndAttachments, { state: 'visible' });
        await this.page.locator(this.notesAndAttachments).scrollIntoViewIfNeeded();
        await this.page.waitForSelector(this.uploadedDoc.replace('${fileName}', fileName), { state: 'visible' });
    }
    async uploadTaxInvoice(fileName) {
        await this.page.waitForSelector(this.fileName_inputBox, { state: 'visible' });
        await this.page.fill(this.fileName_inputBox, fileName);
        await this.page.locator(this.fileName_inputBox).press('Enter');
        await this.page.selectOption(this.documentTypeDropdown, { value: 'Tax Invoice' });
        await this.page.locator(this.uploadFilesButton).setInputFiles('testdata/BanksDoc.xls');
        await this.page.waitForSelector(this.doneButton, { state: 'visible' });
        await this.page.click(this.doneButton);
        await this.page.waitForTimeout(5000);
        await this.page.waitForSelector(this.notesAndAttachments, { state: 'visible' });
        await this.page.locator(this.notesAndAttachments).scrollIntoViewIfNeeded();
        await this.page.waitForSelector(this.uploadedDoc.replace('${fileName}', fileName), { state: 'visible' });
    }
    async clickOnAccountEditButton() {
        await this.page.waitForSelector(this.accountEditButton, { state: 'visible' });
        await this.page.click(this.accountEditButton);
    }
    async enterAccountDetails(businessOrganization, accountExecutiveEmail, financeManagerEmail) {
        await this.page.waitForSelector(this.businessOrganization, { state: 'visible' });
        await this.page.click(this.businessOrganization);
        await this.page.click(this.businessOrganizationValue.replace('${businessOrganization}', businessOrganization));
        await this.page.fill(this.accountExecutiveEmail, accountExecutiveEmail);
        await this.page.click(this.generalBusinessQueriesReceiptMethod);
        await this.page.click(this.receiptMethod1);
        await this.page.fill(this.financeManagerEmail, financeManagerEmail);
        await this.page.click(this.remittanceAdviceReportReceiptMethod);
        await this.page.click(this.receiptMethod2);
    }
    async clickOnTradingTermTab() {
        await this.page.waitForSelector(this.tradingTermTab, { state: 'visible' });
        await this.page.click(this.tradingTermTab);
    }
    async clickOnAddTradingTerm() {
        await this.page.waitForSelector(this.addTradingTermButton, { state: 'visible' });
        await this.page.click(this.addTradingTermButton);
    }
    async enterTradingTermDetails(rebateEffectiveDate) {
        await this.page.waitForSelector(this.settlementTerms, { state: 'visible' });
        await this.page.click(this.settlementTerms);
        await this.page.click(this.settlementTermsValue);
        await this.page.fill(this.rebateEffectiveDate, rebateEffectiveDate);
    }
    async clickOnSaveButton() {
        await this.page.waitForSelector(this.accountSaveButton, { state: 'visible' });
        await this.page.click(this.accountSaveButton);
    }
    async bufferTradingTermName() {
        await this.page.waitForSelector(this.tradingTermName, { state: 'visible' });
        return await this.page.locator(this.tradingTermName).textContent();
    }
    async navigateBack() {
        await this.page.goBack();
    }
}