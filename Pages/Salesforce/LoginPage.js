import { expect } from '@playwright/test';

exports.LoginPage =
    class LoginPage {
        constructor(page) {
            this.page = page;
            this.userNameInput = '#username';
            this.passwordInput = '#password';
            this.loginButton = '#Login';
            this.agreeButton = "input[value='I Agree']";
        }
        async gotoLoginPage() {
            await this.page.goto('https://woolworths--phuat.sandbox.my.salesforce.com/');
            await expect(this.page).toHaveTitle('Login | Salesforce');

        }
        async login(username, password) {
            await this.page.fill(this.userNameInput, username);
            await this.page.fill(this.passwordInput, password);
            await this.page.click(this.loginButton);
            await this.page.click(this.agreeButton);
            await this.page.waitForLoadState('load');
        }
    }