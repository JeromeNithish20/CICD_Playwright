import { chromium } from 'playwright';
import fetch from 'node-fetch';

export async function solveCaptcha(page1) {
    // Step 1: Extract `labelSiteKey` from the page
    const frame = page1.frame({ url: '/apex/ReCaptcha' });
    const sitekey = await frame.evaluate(() => window.labelSiteKey);
    if (!sitekey) {
        throw new Error('Sitekey not found!');
    }
    console.log('Extracted Sitekey:', sitekey);

    // Step 2: Solve CAPTCHA using 2Captcha API
    const pageURL = page1.url(); // Use page1 (the provided page) to get the URL
    const apiKey = 'aefcad999ffc81dad1aafe1a4cb5fb16'; // Replace with your actual 2Captcha API Key

    const response = await fetch('https://2captcha.com/in.php', {
        method: 'POST',
        body: new URLSearchParams({
            key: apiKey,
            method: 'userrecaptcha',
            googlekey: sitekey,
            pageurl: pageURL,
        }),
    });

    const resultText = await response.text();
    const captchaId = resultText.split('|')[1];

    let solution = null;
    for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 5000)); // Wait 5 seconds
        const solutionResponse = await fetch(
            `https://2captcha.com/res.php?key=${apiKey}&action=get&id=${captchaId}`
        );
        const solutionText = await solutionResponse.text();
        if (solutionText.startsWith('OK|')) {
            solution = solutionText.split('|')[1];
            break;
        }
    }

    if (!solution) {
        throw new Error('Failed to solve CAPTCHA.');
    }
    console.log('CAPTCHA Solved:', solution);

    // Step 3: Inject the CAPTCHA solution
    await page1.evaluate(token => {
        document.querySelector('#g-recaptcha-response').value = token;
    }, solution);

    // Step 4: Submit the form
    await page1.click('#submit-button'); // Replace with the actual selector for the submit button

    console.log('Form submitted successfully!');
};
