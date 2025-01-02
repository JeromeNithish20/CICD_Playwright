export class SFHomePage {
        constructor(page) {
            this.page = page;
            this.logoutUser = "a[class='action-link']";
            this.grossMarginOk_btn = "//button[text()='OK']";
            this.selectedMenu = "//a[@title='Home']";
            this.navMenu = 'button[title="Show Navigation Menu"]';
            this.homeMenu = '//ul[@role="menu"]//span[text()="Home"]';
            //Gloabl Search
            this.globalSearch = 'button[aria-label="Search"]';
            this.globalSearchBox = 'Search...'
            this.contactName = 'span[title="Akhil NPC"]';
            this.loginToExperienceAsUser = 'button[name="LoginToNetworkAsUser"]';
            this.myActiveCases = "a[title$='My Active Cases']";
            this.setupGearIcon = "div[class='setupGear'] a";
            this.setupMenu = "//li[@id='all_setup_home']/a";
            //Search Results
            this.contactResultTab = "//span[normalize-space()='Contacts']";
            this.accountResultTab = "//span[normalize-space()='Accounts']";
            this.caseResultTab = "//span[normalize-space()='Cases']";
            this.tableLocator = "(//table[contains(@class,'slds-table')])[3]";
            this.tableRows = "tbody tr";
            this.accountNameLink = "//th/span/a[@title='${accountName}']";
            this.accountListViewLabel = 'Accounts||List View';

            this.userNameInput = '#username';
        }
        async verifyGrossMarginPopup() {
            const isPopupVisible = (await this.page.locator(this.grossMarginOk_btn).isVisible());
            if (isPopupVisible) {
                await this.page.click(this.grossMarginOk_btn);
            }
        }
        async gotoHome() {
            if (!(await this.page.locator(this.myActiveCases).isVisible())) {
                await this.page.locator(this.navMenu).waitFor({ state: 'visible' });
                await this.page.click(this.navMenu);
                await this.page.locator(this.homeMenu).waitFor({ state: 'visible' });
                await this.page.click(this.homeMenu);
                await this.page.waitForSelector(this.myActiveCases, { visible: true });
                await this.page.waitForSelector(this.globalSearch, { visible: true });
            }
        }
        async gotoSetup() {
            await this.page.waitForSelector(this.setupGearIcon, { state: 'visible' });
            await this.page.locator(this.setupGearIcon).click();
            await this.page.waitForSelector(this.setupMenu, { state: 'visible' });
            const [page1] = await Promise.all([
                this.page.waitForEvent("popup"),
                await this.page.locator(this.setupMenu).click()
            ]);
            await page1.waitForLoadState('load');
            await this.page.close();
            return page1;
        }
        async loginAsSupplier(contact) {
            await this.page.click(this.globalSearch);
            await this.page.getByPlaceholder(this.globalSearchBox).fill(contact);
            await this.page.click(this.contactName);
        }
        async clickOnLogin() {
            await this.page.locator(this.loginToExperienceAsUser, { state: 'visible' });
            await this.page.click(this.loginToExperienceAsUser);
            await this.page.waitForLoadState('load');
        }
        async searchAccount(account) {
            await this.page.waitForSelector(this.globalSearch, { visible: true });
            await this.page.click(this.globalSearch);
            await this.page.getByPlaceholder(this.globalSearchBox).fill(account);
            await this.page.getByPlaceholder(this.globalSearchBox).press('Enter');
        }
        async clickOnAccountResultTab() {
            await this.page.waitForSelector(this.accountResultTab, { state: 'visible' });
            await this.page.click(this.accountResultTab);
        }
        async clickOnAccount(accountName) {
            const accountLink = this.accountNameLink.replace("${accountName}", accountName);
            await this.page.locator(accountLink).waitFor({ state: 'visible' });
            await this.page.locator(accountLink).click();
        }
        async logoutAsAdmin() {
            await this.page.waitForSelector(this.logoutUser, { state: 'visible' });
            await this.page.click(this.logoutUser);
            await this.page.waitForSelector(this.userNameInput, { state: 'visible' });
            await this.page.close();
        }
    }