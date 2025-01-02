import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/Salesforce/LoginPage';
import { SFHomePage } from '../Pages/Salesforce/SFHomePage';
import { CommunityPage } from '../Pages/Supplier/CommunityPage';

test.setTimeout(60000);

test('Article creation', async ({ page }) => {
    const login = new LoginPage(page);
    await test.step('Login Test', async () => {
        await login.gotoLoginPage();
        await login.login('jn@tcs.woolworths.com.au.phuat', 'Tcs@1234');
        await page.waitForTimeout(10000);
    });

    const home = new SFHomePage(page);
    await test.step('Login as Supplier', async () => {
        await home.gotoHome();
        await home.loginAsSupplier('Akhil NPC');
        await page.waitForTimeout(5000);
        try {
            await home.clickOnLogin();
        } catch (error) {
            console.error('Failed to click on login button:', error.message, error.stack);
        }
    });

    const community = new CommunityPage(page);
    await test.step('Click on RRC', async () => {
        await page.waitForTimeout(10000);
        await community.displayAccountName();
        await community.clickOnRRC();
    });
    await test.step('Click on My RRC', async () => {
        await page.waitForTimeout(20000);
        await page.click(community.clickOnMyRRCButton());
    });
});
