import {test, expect} from '@playwright/test';
import { supplierPage } from '../Pages/supplierPage';

test('Supplier Onboarding', async ({page}) => {
    const supplier = new supplierPage(page);
    await supplier.gotoSupplierPage();
    await supplier.clickOnStartApplication();

    await supplier.enterAbn('47640086282');
    await supplier.clickOnLookup();
});