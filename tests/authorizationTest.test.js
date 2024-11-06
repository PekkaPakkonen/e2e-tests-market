import { email } from "../functions/email.js";
import { password } from "../functions/password.js";

const { test, expect } = require('@playwright/test');

const marketMainPage = 'https://test-market.ekfgroup.com/';
const accountPage = 'https://test-market.ekfgroup.com/account/personal';
const registerPage = 'https://test-market.ekfgroup.com/register';

//auth modal selectors
const authBtn = '.header-nav-main  .d-none .btn.btn-header-rounded:not(.btn-header-cart)';
const emailAuthInput = '.modal-dialog.modal-dialog-centered .form-control[name=\'email\']';
const passwordAuthInput = '.modal-dialog.modal-dialog-centered .form-control[name=\'password\']';
const submitBtn = '.modal-dialog.modal-dialog-centered .btn.btn-submit';
const registerBtn = '.modal-dialog.modal-dialog-centered .btn[href="/register"]';

//register page selectors

//register page, legal entity
const legalEntityRadioBtn = '.bv-no-focus-ring .custom-control:nth-of-type(2) .custom-control-label';
const innInput = '.form-register-wrapper .form-control[name=\'inn\']';

//register page, general selectors
const nameRegInput = '.form-register-wrapper .form-control[name=\'name\']';
const phoneRegInput = '.form-register-wrapper .form-control[name=\'phone\']';
const emailRegInput = '.form-register-wrapper .form-control[name=\'email\']';
const passwordRegInput = '.form-register-wrapper .form-control[name=\'password\']';
const registerRegBtn = '.form-register-wrapper .btn[type = \'submit\']';
const fillByInnBtn = '.btn.btn-secondary';

test.describe('sign in tests', () => {

    test('basic auth', async ({ page }) => {

        await page.goto(marketMainPage);

        await page.locator(authBtn).click();
        await page.locator(emailAuthInput).fill(process.env.USER_ID);
        await page.locator(passwordAuthInput).fill(process.env.PASSWORD);
        await page.locator(submitBtn).click();

        await expect(page).toHaveURL(accountPage,{ timeout: 10000 });
    });

    test('empty credentials auth', async ({ page }) => {

        await page.goto(marketMainPage);

        await page.locator(authBtn).click();
        await page.locator(submitBtn).click();

        await expect(page.locator('.modal-dialog .form-group:nth-of-type(1) .invalid-feedback')).toBeVisible();
        await expect(page.locator('.modal-dialog .form-group:nth-of-type(2) .invalid-feedback')).toBeVisible();

    });

    test('wrong credentials auth', async ({ page }) => {

        await page.goto(marketMainPage);

        await page.locator(authBtn).click();
        await page.locator(emailAuthInput).fill("test1@ya.ru");
        await page.locator(passwordAuthInput).fill("test");
        await page.locator(submitBtn).click();

        await expect(page.locator('.modal-dialog .form-group:nth-of-type(2) .invalid-feedback')).toBeVisible();

    });

});

test.describe('sign up tests', () => {

    const userCredentials = [
        'Mr. Test',
        '9101234567',
    ];

    test('sign up of individual', async ({ page }) => {

        await page.goto(marketMainPage);

        await page.locator(authBtn).click();
        await page.locator(registerBtn).click();
        await expect(page).toHaveURL(registerPage);

        await page.locator(nameRegInput).fill(userCredentials[0]);
        await page.locator(phoneRegInput).pressSequentially(userCredentials[1]);
        await page.locator(emailRegInput).fill(email());
        await page.locator(passwordRegInput).fill(password());
        await page.locator(registerRegBtn).click();

        await expect(page).toHaveURL(accountPage,{ timeout: 10000 });

    });

    //user with existing email shouldn't be created
    test('sign up of existing user', async ({ page }) => {

        await page.goto(marketMainPage);

        await page.locator(authBtn).click();
        await page.locator(registerBtn).click();
        await expect(page).toHaveURL(registerPage);

        await page.locator(nameRegInput).fill(userCredentials[0]);
        await page.locator(phoneRegInput).pressSequentially(userCredentials[1]);
        await page.locator(emailRegInput).fill(process.env.USER_ID);
        await page.locator(passwordRegInput).fill(password());
        await page.locator(registerRegBtn).click();

        await expect(page.locator('.form-group:nth-of-type(1) .invalid-feedback')).toBeVisible();

    });

    test('sign up of legal entity', async ({ page }) => {

        await page.goto(marketMainPage);

        await page.locator(authBtn).click();
        await page.locator(registerBtn).click();
        await expect(page).toHaveURL(registerPage);

        await page.locator(legalEntityRadioBtn).click();
        await page.locator(innInput).fill(process.env.USER_INN);
        await page.locator(fillByInnBtn).click();

        await page.locator(nameRegInput).fill(userCredentials[0]);
        await page.locator(phoneRegInput).pressSequentially(userCredentials[1]);
        await page.locator(emailRegInput).fill(email());
        await page.locator(passwordRegInput).fill(password());
        await page.locator(registerRegBtn).click();

        await expect(page).toHaveURL(accountPage,{ timeout: 10000 });

    });

});