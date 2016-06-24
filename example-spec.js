var StorePage = require('./store-page-object');
var storePage = new StorePage();
var CorePage = require('./core-page-object');
var corePage = new CorePage();
var _ = require('lodash');

describe('Home Away Automation Exercise', function() {
    beforeEach(function() {
        browser.ignoreSynchronization = true;
        storePage.goto();
    });

    describe('Emptying cart', function() {
        it('should update the cart to contain 0 items', function() {
            storePage.selectIphone4SimFree();
            corePage.createEC(storePage.fancyNotification.continueShoppingButton, corePage.longSleep);
            storePage.fancyNotification.continueShoppingButton.click();
            corePage.createEC(storePage.cart.cartButton, corePage.longSleep);
            //EC doesn't seem to work as expected, wait just a little longer
            browser.sleep(corePage.standardSleep);
            storePage.cart.cartButton.click();
            corePage.createEC(storePage.cart.removeButton.get(0), corePage.longSleep);
            storePage.cart.removeButton.get(0).click();
            corePage.createEC(storePage.cart.entryContent, corePage.longSleep);
            expect(storePage.cart.entryContent.getText()).toBe('Oops, there is nothing in your cart.');
        });
    });

    describe('Ordering iPhone 4 16GB SIM free black', function() { 
        it('the order total should be $282.00', function(){
            storePage.orderIphone4SIMFreeBlack();
            expect(storePage.orderSummary.total.getText()).toContain('Total: $282.00');
        });       
    });

    describe('Updating account information', function() {
        it('should persist updated information', function(){
            var newZip = _.random(90000, 90210).toString();
            storePage.updateAccount({zip:newZip});
            storePage.logout();
            storePage.login();
            corePage.createEC(storePage.account.yourDetailsLink, 5000);
            storePage.account.yourDetailsLink.click();
            corePage.createEC(storePage.account.zip, 5000);
            expect(storePage.account.zip.getAttribute('value')).toBe(newZip);
        }); 
    });
});