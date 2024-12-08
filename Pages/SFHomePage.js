import { expect } from '@playwright/test';
exports.SFHomePage =
    class SFHomePage {

        constructor(page) {

            this.page = page;
            this.navMenu = 'button[title="Show Navigation Menu"]';
            this.homeMenu = '//ul[@role="menu"]//span[text()="Home"]';
            //Gloabl Search
            this.globalSearch = 'button[aria-label="Search"]';
            this.globalSearchBox = 'Search...'
            this.contactName = 'span[title="Akhil NPC"]';
            this.loginToExperienceAsUser = 'button[name="LoginToNetworkAsUser"]';
            this.myActiveCases = "a[title$='My Active Cases']";
            //Search Results
            this.contactResultTab = "//span[normalize-space()='Contacts']";
            this.accountResultTab = "//span[normalize-space()='Accounts']";
            this.tableLocator = "//table[contains(@class,'slds-table')]";
            this.tableRows = "tbody tr";
            this.accountNameLink = "th span a";
            this.accountListViewLabel = 'Accounts||List View';
            //Account Details
            this.contactDetailsTab = "(//a[text()='Contact Details'])[2]";
            this.abnNzbnField = "(//*[@data-field-id='RecordABN_cField']//lightning-formatted-text)[4]";
            this.accountNameField = "(//*[@data-field-id='RecordNameField']//lightning-formatted-text)[4]";
            this.recordTypeField = "(//*[@data-field-id='RecordRecord_Type_cField']//lightning-formatted-text)[4]";
            this.targetCountryField = "(//*[@data-field-id='RecordCountry_cField']//lightning-formatted-text)[4]";
        }

        async gotoHome() {
            if (!(this.page.locator(this.navMenu).isVisible())) {
                await this.page.locator(this.navMenu).waitFor({ state: 'visible' });
                await this.page.click(this.navMenu);
                await this.page.locator(this.homeMenu).waitFor({ state: 'visible' });
                await this.page.click(this.homeMenu);
                await this.page.waitForSelector(this.myActiveCases, { visible: true });
                await this.page.waitForSelector(this.globalSearch, { visible: true });
            }
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
            const table = await this.page.locator(this.tableLocator);
            await table.waitFor({ state: 'visible' });
            await this.page.getByRole('link', { name: accountName }).waitFor({ state: 'visible' });
            await this.page.getByRole('link', { name: accountName }).click();
        }
        async verifyAccountDetails(abn, country) {
            // await this.page.waitForSelector(this.abnNzbnField, { visible: true });
            // const abnNzbn = await this.page.locator(this.abnNzbnField).textContent();
            // expect(abnNzbn).toBe(abn);
            // const targetCountry = await this.page.locator(this.targetCountryField).textContent();
            // expect(targetCountry).toBe(country);
            // await this.page.waitForSelector(this.contactDetailsTab, { visible: true });
            // await this.page.click(this.contactDetailsTab);
            await this.page.locator('dd').filter({ hasText: 'Edit ABN/NZBN' }).locator('span').first().waitFor({ state: 'visible' });
            const abn1 = await this.page.locator('dd').filter({ hasText: 'Edit ABN/NZBN' }).locator('span').first().textContent();
            console.log('ABN:', abn1);
            expect(abn1).toBe(abn);
        }
        async clickOnContactDetails() {
            await this.page.getByRole('tab', { name: 'Contact Details' }).waitFor({ state: 'visible' });
            await this.page.getByRole('tab', { name: 'Contact Details' }).click();
            await this.page.getByRole('cell', { name: 'John Doe' }).waitFor({ state: 'visible' });
            await this.page.getByRole('cell', { name: 'John Doe' }).click();
        }
        async clickOnLoginToExperienceAsUser() {
            await this.page.getByRole('button', { name: 'Log in to Experience as User' }).waitFor({ state: 'visible' });
            await this.page.getByRole('button', { name: 'Log in to Experience as User' }).click();
            await this.page.waitForLoadState('load');
        }
    }