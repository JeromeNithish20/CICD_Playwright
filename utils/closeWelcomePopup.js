export async function closeWelcomePopup(page) {
    const popupCloseButton = page.locator("[title='Stop Walk-thru']");
    try {
        // await popupCloseButton.waitFor({state: 'visible', timeout: 5000 });
        await popupCloseButton.click();
        await page.goBack();
    } catch (error) {

    }
}
