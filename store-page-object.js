'use strict';
var CorePage = require('./core-page-object');
var corePage = new CorePage();
var Q = require('q');
var users = require('./users');

function StorePage() {
    this.address = 'http://store.demoqa.com/';
    this.goto = function() {
        browser.get(this.address);
    };

    this.productMenu = {};
    this.productMenu.menu = element(by.id('menu-item-33'));
    this.productMenu.iPhoneListItem = element(by.id('menu-item-37'));

    this.iPhoneOrderForm = {};
    this.iPhoneOrderForm.form = element(by.name('product_96'));
    this.iPhoneOrderForm.addToCartButton = this.iPhoneOrderForm.form.element(by.name('Buy'));

    this.fancyNotification = {};
    this.fancyNotification.container = element(by.id('fancy_notification'));
    this.fancyNotification.goToCheckoutButton = this.fancyNotification.container.element(by.css('a.go_to_checkout'));
    this.fancyNotification.continueShoppingButton = this.fancyNotification.container.element(by.css('a.continue_shopping'));

    this.checkoutPageContainer = {};
    this.checkoutPageContainer.container = element(by.id('checkout_page_container'));
    this.checkoutPageContainer.continueButton = this.checkoutPageContainer.container.all(by.tagName('a')).get(1);

    this.currentCountrySelect = element(by.id('current_country'));

    this.checkoutForm = {};
    this.checkoutForm.email = element(by.id('wpsc_checkout_form_9'));
    this.checkoutForm.firstName = element(by.id('wpsc_checkout_form_2'));
    this.checkoutForm.lastName = element(by.id('wpsc_checkout_form_3'));
    this.checkoutForm.address = element(by.id('wpsc_checkout_form_4'));
    this.checkoutForm.city = element(by.id('wpsc_checkout_form_5'));
    this.checkoutForm.state = element(by.id('wpsc_checkout_form_6'));
    this.checkoutForm.postalCode = element(by.id('wpsc_checkout_form_8'));
    this.checkoutForm.phone = element(by.id('wpsc_checkout_form_18'));
    this.checkoutForm.countrySelect = element(by.id('wpsc_checkout_form_7'));
    this.checkoutForm.shippingSameAsBilling = element(by.id('shippingSameBilling'));
    this.checkoutForm.purchaseButton = element(by.css('.wpsc_make_purchase'));
    this.checkoutForm.calculateShippingButton = element(by.name('wpsc_submit_zipcode'));

    this.orderSummary = {};
    this.orderSummary.container = element(by.id('post-30'));
    this.orderSummary.total = this.orderSummary.container.all(by.tagName('p')).get(2);

    this.account = {};
    this.account.myAccountButton = element(by.css('a.account_icon'));
    this.account.loginButton = element(by.id('login'));
    this.account.userName = element(by.id('log'));
    this.account.password = element(by.id('pwd')); 
    this.account.userProfileLinks = element(by.css('div.user-profile-links'));
    this.account.zip = element(by.id('wpsc_checkout_form_8'));
    this.account.saveProfileButton = element(by.name('submit'));
    this.account.yourDetailsLink = this.account.userProfileLinks.all(by.tagName('a')).get(1);
    this.account.logoutLink = element(by.css('div.widget-wrapper')).all(by.tagName('a')).get(1);
    this.account.otherLoginForm = element(by.id('loginform'));


    this.cart = {};
    this.cart.cartButton = element(by.css('a.cart_icon'));
    this.cart.removeButton = element.all(by.xpath('//*[@value="Remove"]'));
    this.cart.entryContent = element(by.css('div.entry-content'));

    this.hoverElement = function(element) {
        browser.actions()
            .mouseMove(element)
            .perform();
        browser.sleep(corePage.shortSleep);
    };

    this.orderIphone4SIMFreeBlack = function() {
        this.selectIphone4SimFree();
        corePage.createEC(this.fancyNotification.goToCheckoutButton, corePage.longSleep);
        this.fancyNotification.goToCheckoutButton.click();
        corePage.createEC(this.checkoutPageContainer.continueButton, corePage.longSleep);
        this.checkoutPageContainer.continueButton.click();
        browser.sleep(corePage.longSleep);
        this.calculateShipping();
        corePage.createEC(this.checkoutForm.email, corePage.longSleep);
        this.fillOutOrderForm();
        this.checkoutForm.shippingSameAsBilling.click();
        this.checkoutForm.purchaseButton.click();
        corePage.createEC(this.orderSummary.total,5000);
    };

    this.fillOutOrderForm = function() {
        this.checkoutForm.email.sendKeys('me@here.com');
        this.checkoutForm.firstName.sendKeys('Tyler');
        this.checkoutForm.lastName.sendKeys('Durden');
        this.checkoutForm.address.sendKeys('123 Paper St.');
        this.checkoutForm.city.sendKeys('Los Angeles');
        this.checkoutForm.state.sendKeys('CA');
        this.selectCountry(this.checkoutForm.countrySelect);
        this.checkoutForm.postalCode.sendKeys('90916');
        this.checkoutForm.phone.sendKeys('5555555555');
    };

    this.selectIphone4SimFree = function() {
        this.hoverElement(this.productMenu.menu);
        this.productMenu.iPhoneListItem.click();
        this.iPhoneOrderForm.addToCartButton.click();
    };

    this.calculateShipping = function() {
        this.selectCountry(this.currentCountrySelect);
        this.checkoutForm.calculateShippingButton.click();
    };

    this.selectCountry = function(element) {
        element.click();
        element.sendKeys('USA');
        element.sendKeys(protractor.Key.ESC);
    };

    this.login = function() {
        this.goto();
        this.account.myAccountButton.click();
        corePage.createEC(this.account.loginButton, 5000);
        this.account.userName.sendKeys(users.lance.userName);
        this.account.password.sendKeys(users.lance.password);
        this.account.loginButton.click();
    };

    this.logout = function() {
        this.account.logoutLink.click();
    };

    this.updateAccount = function(newValues) {
        this.login();
        corePage.createEC(this.account.userProfileLinks, 5000);
        corePage.createEC(this.account.yourDetailsLink, 5000);
        this.account.yourDetailsLink.click();
        corePage.createEC(this.account.zip, 5000);
        this.account.zip.clear();
        this.account.zip.sendKeys(newValues.zip);
        this.account.saveProfileButton.click();
    };

    this.emptyCart = function() {
        this.cart.cartButton.click();
        corePage.createEC(this.checkoutPageContainer.container, corePage.longSleep);
    };
    
    this.removeItem = function(removeButtons) {
        var deferred = Q.defer();
        this.cart.removeButton
            .then(function(removeButtons) {
                if(removeButtons.length > 0) {
                    removeButtons[0].click();
                    corePage.createEC(this.checkoutPageContainer.container, corePage.longSleep);
                    return this.cart.removeButton;
                }
            })
            .then(function(removeButtons) {
                deferred.resolve(removeButtons.length);
            });

            return deferred.promise;
        };

}

module.exports = StorePage;