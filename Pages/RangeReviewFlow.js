export class RangeReviewFlow{
    constructor(page){
        this.page = page;
        this.GTINInput = 'input[placeholder="*Enter GTIN"]';
    }
    async enterGTIN(){
        await this.page.waitForSelector(this.GTINInput, { state: 'visible' });
        await this.page.fill(this.GTINInput, '9384737646267');
    }
}