import { stat } from "fs";

export class SF_Page_InternalUser {
    constructor(page) {
        this.page = page;
        this.openButton = "//button[text()='Open']";
        this.recentRecords = "[title='Recent Records']";
        this.navMenu = 'button[title="Show Navigation Menu"]';
        this.homeMenu = '//ul[@role="menu"]//span[text()="Home"]';
        //Gloabl Search
        this.globalSearch = 'button[aria-label="Search"]';
        this.globalSearchBox = 'Search...';
        this.caseResultTab = "//a//span[text()='Cases']";
        //Case Details
        this.keyFields = "h2[class='title']";
        this.showMore_btn = "//button[@title='Show More']";
        this.showLess_btn = "//button[@title='Show Less']";
        this.grossMarginOk_btn = "//button[text()='OK']";
        //Case Fields
        this.editCM_btn = "(//slot//*[text()='$caseNo']/ancestor::records-record-layout-section)[2]/following-sibling::records-record-layout-section[1]//button[@title='Edit Category Manager']";
        this.editCaseStatus_btn = "(//button[@title='Edit Status'])[2]";
        this.editMerchCategory_btn = "//button[@title='Edit Merchandise Category']";
        this.merchCategory_input = "input[placeholder='Search Composites...']";
        this.merchCategory_Dropdown_Option = "span [title='${merchCategory}']";
        this.clearCM = "//label[text()='Category Manager']/following-sibling::div//button";
        this.clearCA = "//label[text()='Category Assistant']/following-sibling::div//button";
        this.CM_input = "//label[text()='Category Manager']/following-sibling::div//input";
        this.CA_input = "//label[text()='Category Assistant']/following-sibling::div//input";
        this.CM_Dropdown_Option = "(//span//*[@title='${user}'])[1]";
        this.CA_Dropdown_Option = "(//span//*[@title='${user}'])[2]";
        this.editCaseOwner_btn = "button[title='Edit Case Owner']";
        this.clearCaseOwner = "//label[text()='Case Owner']/following-sibling::div//button";
        this.caseOwner_type = "//label[text()='Case Owner']/following-sibling::div//button/span";
        this.caseOwner_User = "//span[@title='User']";
        this.caseOwner_Input = "//label[text()='Case Owner']/following-sibling::div//input";
        this.saveButton = "//button[@name='SaveEdit']";
        this.logoutUser = "a[class='action-link']";
        this.toastMessage_Success = "//span[contains(@class,'toastMessage')]";
    }
    async gotoBSSHome() {
        if (!(await this.page.locator(this.openButton).isVisible())) {
            await this.page.locator(this.navMenu).waitFor({ state: 'visible' });
            await this.page.click(this.navMenu);
            await this.page.locator(this.homeMenu).waitFor({ state: 'visible' });
            await this.page.click(this.homeMenu);
            await this.page.waitForSelector(this.recentRecords, { visible: true });
        }
    }
    async searchCase(caseNumber) {
        await this.page.waitForSelector(this.globalSearch, { visible: true });
        await this.page.click(this.globalSearch);
        await this.page.getByPlaceholder(this.globalSearchBox).fill(caseNumber);
        await this.page.getByPlaceholder(this.globalSearchBox).press('Enter');
    }
    async clickOnCaseResultTab() {
        await this.page.waitForSelector(this.caseResultTab, { state: 'visible' });
        await this.page.click(this.caseResultTab);
    }
    async clickOnCase(caseNumber) {
        await this.page.getByRole('link', { name: caseNumber }).waitFor({ state: 'visible' });
        await this.page.getByRole('link', { name: caseNumber }).click();
    }
    async verifyGrossMarginPopup() {
        const popupTimeout = 5000;
        try {
            await this.page.locator(this.grossMarginOk_btn).waitFor({
                state: 'visible',
                timeout: popupTimeout
            });
            await this.page.click(this.grossMarginOk_btn);
            await this.page.locator(this.grossMarginOk_btn).waitFor({ state: 'hidden' });
        } catch (error) {
        }
    }
    async collapseKeyFields() {
        const isVisible = (await this.page.locator(this.showLess_btn).isVisible());
        if (isVisible) {
            await this.page.waitForSelector(this.showLess_btn, { state: 'visible' });
            await this.page.click(this.showLess_btn);
        }
    }
    async clickOnEditCM(caseNo) {
        const editCM_btn = this.editCM_btn.replace("$caseNo", caseNo);
        await this.page.waitForSelector(editCM_btn, { state: 'visible' });
        await this.page.click(editCM_btn);
    }
    async clickOnEditMerchCategory() {
        await this.page.waitForSelector(this.editMerchCategory_btn, { state: 'visible' });
        await this.page.click(this.editMerchCategory_btn);
    }
    async enterMerchandiseCategory(merchCategory) {
        const merchCategory_inputBox = await this.page.locator(this.merchCategory_input);
        await merchCategory_inputBox.waitFor({ state: 'visible' });
        await merchCategory_inputBox.scrollIntoViewIfNeeded();
        await merchCategory_inputBox.fill(merchCategory);
        await merchCategory_inputBox.click();
        const dynamicMerchCategory = this.merchCategory_Dropdown_Option.replace("${merchCategory}", merchCategory);
        await this.page.waitForSelector(dynamicMerchCategory, { state: 'visible' });
        await this.page.click(dynamicMerchCategory);
    }
    async enterCM(CM) {
        const isVisible = await this.page.locator(this.clearCM).isVisible();
        if (isVisible) {
            await this.page.click(this.clearCM);
        }
        const CM_inputBox = await this.page.locator(this.CM_input);
        await CM_inputBox.waitFor({ state: 'visible' });
        await CM_inputBox.fill(CM);
        await CM_inputBox.click();
    }
    async selectCMOption(CM) {
        // Dynamically replace ${user} with the actual user value
        const dynamicCMOption = this.CM_Dropdown_Option.replace("${user}", CM);
        await this.page.waitForSelector(dynamicCMOption, { state: 'visible' });
        await this.page.locator(dynamicCMOption).scrollIntoViewIfNeeded();
        await this.page.click(dynamicCMOption);
    }
    async enterCA(CA) {
        const isVisible = await this.page.locator(this.clearCA).isVisible();
        if (isVisible) {
            await this.page.click(this.clearCA);
        }
        const CA_inputBox = await this.page.locator(this.CA_input);
        await CA_inputBox.waitFor({ state: 'visible' });
        await CA_inputBox.fill(CA);
        await CA_inputBox.click();
    }
    async selectCAOption(CA) {
        // Dynamically replace ${user} with the actual user value
        const dynamicCAOption = this.CA_Dropdown_Option.replace("${user}", CA);
        await this.page.waitForSelector(dynamicCAOption, { state: 'visible' });
        await this.page.click(dynamicCAOption);
    }
    async clickOnSave() {
        await this.page.waitForSelector(this.saveButton, { state: 'visible' });
        await this.page.click(this.saveButton);
        await this.page.waitForSelector(this.saveButton, { state: 'hidden' });
    }
    async changeCaseOwner(CM) {
        await this.page.waitForSelector(this.editCaseOwner_btn, { state: 'visible' });
        await this.page.click(this.editCaseOwner_btn);
        const isClearCaseOwnerVisible = await this.page.locator(this.clearCaseOwner).isVisible();
        if (isClearCaseOwnerVisible) {
            await this.page.click(this.clearCaseOwner);
            const caseOwnerType = await this.page.locator(this.caseOwner_type).textContent();
            if (caseOwnerType === 'Queue') {
                await this.page.click(this.caseOwner_type);
                await this.page.click(this.caseOwner_User);
            }
        }
        const caseOwner_inputBox = await this.page.locator(this.caseOwner_Input);
        await caseOwner_inputBox.waitFor({ state: 'visible' });
        await caseOwner_inputBox.fill(CM);
        const dynamicCMOption = this.CM_Dropdown_Option.replace("${user}", CM);
        const dynamicCMOption_locator = await this.page.locator(dynamicCMOption);
        await dynamicCMOption_locator.waitFor({ state: 'visible' });
        await dynamicCMOption_locator.scrollIntoViewIfNeeded();
        await dynamicCMOption_locator.click();
    }
    async reloadPage() {
        await this.page.reload();
        await this.page.waitForSelector(this.editCaseStatus_btn, { state: 'visible' });
    }
    async logoutAsInternalUser() {
        await this.page.waitForSelector(this.logoutUser, { state: 'visible' });
        await this.page.click(this.logoutUser);
    }
}