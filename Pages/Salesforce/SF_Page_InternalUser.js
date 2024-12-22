export class SF_Page_InternalUser {
    constructor(page) {
        this.page = page;
        this.BSS_SupplierDashboard = "[title*='Supplier Articles Dashboard']";
        this.navMenu = 'button[title="Show Navigation Menu"]';
        this.homeMenu = '//ul[@role="menu"]//span[text()="Home"]';
        //Gloabl Search
        this.globalSearch = 'button[aria-label="Search"]';
        this.globalSearchBox = 'Search...';
        this.caseResultTab = "//span[normalize-space()='Cases']";
        //Case Details
        this.showMore_btn = "//button[@title='Show More']";
        this.keyFields = "h2[class='title']";
        this.editKeyFields_btn = "//a[@title='Edit Key Fields']";
        this.merchCategory_input = "input[title='Search Composites']";
        this.CM_input = "(//input[@title='Search People'])[1]";
        this.CA_input = "(//input[@title='Search People'])[2]";
        this.clearButton = "//a[@class='deleteAction']";
        this.popupFooter = "[class='inlineFooter']";

    }
    async gotoBSSHome() {
        if (!(await this.page.locator(this.BSS_SupplierDashboard).isVisible())) {
            await this.page.locator(this.navMenu).waitFor({ state: 'visible' });
            await this.page.click(this.navMenu);
            await this.page.locator(this.homeMenu).waitFor({ state: 'visible' });
            await this.page.click(this.homeMenu);
            await Promise.all([
                this.page.locator(this.BSS_SupplierDashboard).waitFor({ state: 'visible' }),
                this.page.locator(this.globalSearch).waitFor({ state: 'visible' }),
                this.page.waitForNavigation({ waitUntil: 'load' })  // Wait for the page to fully load
            ]);
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
    async expandKeyFields() {
        const isNotVisible = !(await this.page.locator(this.keyFields).isVisible());
        if (isNotVisible) {
            await this.page.waitForSelector(this.showMore_btn, { state: 'visible' });
            await this.page.click(this.showMore_btn);
        }
    }
    async clickOnEditKeyFields() {
        await this.page.waitForSelector(this.editKeyFields_btn, { state: 'visible' });
        await this.page.click(this.editKeyFields_btn);
    }
    async clearCMandCA() {
        // Get all matching elements for the locator
        await this.page.waitForSelector(this.clearButton, { state: 'visible' });
        const clearButtons = this.page.locator(this.clearButton);
        // Determine the count of elements
        const buttonCount = await clearButtons.count();
        if (buttonCount === 0) {
            
        } else {
            console.log(`Found ${buttonCount} clear buttons.`);
            for (let i = 0; i < buttonCount; i++) {
                console.log(`Clicking clearButton ${i + 1}`);
                await clearButtons.nth(i).waitFor({ state: 'visible' });
                await clearButtons.nth(i).click();
                await this.page.waitForSelector(this.popupFooter, { state: 'visible' });
                await this.page.click(this.popupFooter);
                // Optional: Add a short delay to prevent overlapping actions
                await this.page.waitForTimeout(2000);
            }
        }
    }
}