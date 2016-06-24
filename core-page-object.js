function CorePage() {
    this.shortSleep = 500;
    this.standardSleep = 1000;
    this.longSleep = 7500;

    this.createEC = function(element, duration) {
        var EC = protractor.ExpectedConditions;
        browser.driver.wait(EC.visibilityOf(element), duration || 5000);
    };
}

module.exports = CorePage;