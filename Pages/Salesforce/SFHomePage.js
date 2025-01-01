import { expect } from '@playwright/test';
import { stat } from 'fs';
exports.SFHomePage =
    class SFHomePage {
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
            //Account Details
            this.contactDetailsTab = "(//a[text()='Contact Details'])[2]";
            this.abnNzbnField = "(//span[text()='ABN/NZBN']/../../following-sibling::dd//*[@slot='output'])";
            this.accountNameField = "(//*[@data-field-id='RecordNameField']//lightning-formatted-text)[4]";
            this.recordTypeField = "//span[text()='Record Type']/../../following-sibling::dd";
            this.targetCountryField = "(//span[text()='Target Country']/../../following-sibling::dd//*[@slot='output'])";
            this.profileIcon = "[class='uiImage']";
            this.logoutButton = "//a[text()='Log Out']";
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
            // await this.page.getByRole('link', { name: accountName }).waitFor({ state: 'visible' });
            // await this.page.getByRole('link', { name: accountName }).click();
        }
        async verifyAccountDetails(abn, country) {
            await this.page.locator(this.abnNzbnField).waitFor({ state: 'visible' });
            const abnNzbn = await this.page.locator(this.abnNzbnField).innerText();
            expect(abnNzbn).toContain(abn);
            const targetCountry = await this.page.locator(this.targetCountryField).innerText();
            expect(targetCountry).toContain(country);
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
        async logoutAsAdmin() {
            // await this.page.waitForSelector(this.profileIcon, { state: 'visible' });
            // await this.page.click(this.profileIcon);
            // await this.page.waitForSelector(this.logoutButton, { state: 'visible' });
            // await this.page.click(this.logoutButton);
            await this.page.waitForSelector(this.logoutUser, { state: 'visible' });
            await this.page.click(this.logoutUser);
            await this.page.waitForSelector(this.userNameInput, { state: 'visible' });
            await this.page.close();
        }
    }