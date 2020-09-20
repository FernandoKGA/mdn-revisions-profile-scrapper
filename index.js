//Imports
require('dotenv').config();
const fetch = require('node-fetch');
const { Builder, By } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

const translations = {};

const cookies = {
  _ga: process.env.GA,
  _gid: process.env.GID,
  _gat: process.env.GAT,
  csrftoken: process.env.CSRFTOKEN,
  sessionid: process.env.SESSIONID,
  dwf_sg_task_completion: process.env.DWF_SG_TASK_COMPLETION,
};

const addCookies = async (driver) => {
  await driver.manage().addCookie({ name: '_ga', value: cookies._ga, domain: 'mozilla.org' });
  await driver.manage().addCookie({ name: '_gid', value: cookies._gid, domain: 'mozilla.org' });
  await driver.manage().addCookie({ name: '_gat', value: cookies._gat, domain: 'mozilla.org' });
  await driver.manage().addCookie({ name: 'csrftoken', value: cookies.csrftoken, domain: 'developer.mozilla.org' })
  await driver.manage().addCookie({ name: 'sessionid', value: cookies.sessionid, domain: 'developer.mozilla.org' })
  await driver.manage().addCookie({ name: 'dwf_sg_task_completion', value: cookies.dwf_sg_task_completion, domain: 'developer.mozilla.org' });
  return driver;
};

const firstPage = () => {
  return `https://developer.mozilla.org/${process.env.LOCALE}/dashboards/revisions?user=${process.env.MOZILLA_USER}&page=1`;
};

const readRowsAndInsertInTranslationsObject = async (rows, translations) => {
  for (const row of rows) {
    const textFromRow = await row.getText();
    const textsFromRow = textFromRow.split(/\n/g);
    const translatedArticle = textsFromRow[2];

    if (!translations[translatedArticle]) {
      translations[translatedArticle] = 1;
    } else {
      translations[translatedArticle] += 1;
    }
  }
};

const findNextPageReference = async (driver) => {
  let pagination = await driver.findElement(By.className('pagination'));
  let nextPages = await pagination.findElements(By.className('next'));
  if (nextPages.length === 0) return null;
  
  let nextPage = await pagination.findElement(By.className('next'));
  let nextPageATag = await nextPage.findElement(By.css('a'));
  return await nextPageATag.getAttribute('href');
};

const readPageAndExtractInformation = async (driver, url) => {
  await driver.get(url); // calls page again, now with cookies

  await driver.wait(() => {
    return driver.findElement(By.className('dashboard-table'))
  }, 10000);

  let rows = await driver.findElements(By.className('dashboard-row ')); //get rows from dashboard

  await readRowsAndInsertInTranslationsObject(rows, translations);

  const nextPageRef = await findNextPageReference(driver);
  if (!nextPageRef) return null;

  return nextPageRef;
};

const main = async () => {
  const options = new firefox.Options();
  options.headless();

  let driver = await new Builder()
    .forBrowser('firefox')
    //.setFirefoxOptions(options)
    .build();

  try {

    await driver.get(firstPage()); //get page to set cookies
    driver = await addCookies(driver);
    
    let nextPageUrl = firstPage();

    while(nextPageUrl !== null) {
      nextPageUrl = await readPageAndExtractInformation(driver, nextPageUrl);
    }
    
    let amountTranslations = 0;
    for (const translation in translations) {
      amountTranslations += 1;
    }

    console.log('Amount of unique translations: ' + amountTranslations);

    //close webdriver
    await driver.quit();

  } catch (error) {
    console.error(error);
    await driver.quit();
  }

  //TODO: print results

  return 'Teste';
};

main().then(() => process.exit(0));
