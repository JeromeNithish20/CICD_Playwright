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
        this.caseResultTab = "//span[normalize-space()='Cases']";
        //Case Details
        this.keyFields = "h2[class='title']";
        this.showMore_btn = "//button[@title='Show More']";
        this.showLess_btn = "//button[@title='Show Less']";
        //Key Fields Edit Pop-up
        /* 
        this.editKeyFields_btn = "//a[@title='Edit Key Fields']";
        this.merchCategory_input = "input[title='Search Composites']";
        this.CM_label = "//label/span[text()='Category Manager']";
        this.CA_label = "//label/span[text()='Category Assistant']";
        this.clearCM = "(//label/span[text()='Category Manager'])/parent::label/following-sibling::div//a[@class='deleteAction']";
        this.clearCA = "(//label/span[text()='Category Assistant'])/parent::label/following-sibling::div//a[@class='deleteAction']";
        this.CM_input = "(//input[@title='Search People'])[1]";
        this.CA_input = "(//input[@title='Search People'])[2]";
        this.CM_CA_DropDown_Option = "//div[@title='${user}']";
        this.saveButton = "//div[@class='inlineFooter']//button[@title='Save']"; */
        this.editCM_btn = "//button[@title='Edit Category Manager']";
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
    async collapseKeyFields() {
        const isVisible = (await this.page.locator(this.keyFields).isVisible());
        if (isVisible) {
            await this.page.waitForSelector(this.showLess_btn, { state: 'visible' });
            await this.page.click(this.showLess_btn);
        }
    }
    async clickOnEditKeyFields() {
        await this.page.waitForSelector(this.editKeyFields_btn, { state: 'visible' });
        await this.page.click(this.editKeyFields_btn);
    }
    async clickOnEditCM() {
        await this.page.waitForSelector(this.editCM_btn, { state: 'visible' });
        await this.page.click(this.editCM_btn);
    }
    async enterCM(CM) {
        const isVisible = await this.page.locator(this.clearCM).isVisible();
        if (isVisible) {
            await this.page.click(this.clearCM);
        }
        await this.page.locator(this.CM_input).waitFor({ state: 'visible' });
        await this.page.locator(this.CM_input).fill(CM);
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
        await this.page.locator(this.CA_input).waitFor({ state: 'visible' });
        await this.page.locator(this.CA_input).fill(CA);
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
        await this.page.locator(this.caseOwner_Input).waitFor({ state: 'visible' });
        await this.page.locator(this.caseOwner_Input).fill(CM);
        const dynamicCMOption = this.CM_Dropdown_Option.replace("${user}", CM);
        await this.page.waitForSelector(dynamicCMOption, { state: 'visible' });
        await this.page.locator(dynamicCMOption).scrollIntoViewIfNeeded();
        await this.page.click(dynamicCMOption);
    }
    async logoutAsInternalUser() {
        await this.page.click(this.logoutUser);
    }
}