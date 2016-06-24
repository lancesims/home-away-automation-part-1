# Home Away Automation Exercise
Prepared By Lance Sims
### Version
0.0.1

### Tech
* [Protractor]
* [Selenium]
* [Jasmine]
* [lodash]
### Installation
```sh
$ npm test
```
This will run npm install, instruct protractor to update the stand alone WebDriver and then begin running the test suite.

If this fails for some reason (it shouldn't)

```sh
$npm install
```

```sh
$./node_modules/protractor/bin/webdriver-manager update --standalone
```

```sh
$./node_modules/protractor/bin/protractor protractor.conf.js
```