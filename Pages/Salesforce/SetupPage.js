export class SetupPage {
    constructor(page) {
        this.page = page;
        this.searchSetup = "//input[@title='Search Setup']";
        this.searchUsername = "//span[@title='${user}']";
        this.userFrame = "iframe[title*='${user}']";
        this.loginButton = "#topButtonRow input[title='Login']";
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
        // const frameContent = await frame.contentFrame();
        await frame.locator(this.loginButton).waitFor({ state: 'visible' });
        await frame.locator(this.loginButton).click();
    }
}