export class SetupPage {
    constructor(page) {
        this.page = page;
        this.searchSetup = "//input[@title='Search Setup']";
        this.searchUsername = "//span[@title='${user}']";
        this.userFrame = "iframe[title*='${user}']";
        this.loginButton = "#topButtonRow input[title='Login']";
        this.profileIcon = "[class='uiImage']";
        this.logoutButton = "//a[text()='Log Out']";
        this.userNameInput = '#username';
    }
    async searchUser(user) {
        await this.page.waitForSelector(this.searchSetup, { state: 'visible' });
        await this.page.fill(this.searchSetup, user);
        // Dynamically replace ${user} with the actual user value
        const dynamicUsername = this.searchUsername.replace("${user}", user);
        await this.page.waitForSelector(dynamicUsername, { state: 'visible' });
        await this.page.locator(dynamicUsername).click();
    }
    async clickOnLogin(user) {
        // Dynamically replace ${user} with the actual user value
        const dynamicUserFrame = this.userFrame.replace("${user}", user);
        await this.page.waitForSelector(dynamicUserFrame, { state: 'visible' });
        const frame = await this.page.frameLocator(dynamicUserFrame);
        await frame.locator(this.loginButton).waitFor({ state: 'visible' });
        await frame.locator(this.loginButton).click();
    }
    async logoutAsAdmin() {
        await this.page.waitForSelector(this.profileIcon, { state: 'visible' });
        await this.page.click(this.profileIcon);
        await this.page.waitForSelector(this.logoutButton, { state: 'visible' });
        await this.page.click(this.logoutButton);
        await this.page.waitForSelector(this.userNameInput, { state: 'visible' });
        await this.page.close();
    }
}