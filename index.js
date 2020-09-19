require('dotenv').config();
const fetch = require('node-fetch');
const { Builder, By } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

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

const url = (page) => {
  return `https://developer.mozilla.org/${process.env.LOCALE}/dashboards/revisions?user=${process.env.MOZILLA_USER}&page=${page}`;
}

const main = async () => {
  const options = new firefox.Options();
  options.headless();

  let driver = await new Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(options)
    .build();
  await driver.get(url(1)); //get page to set cookies
  driver = await addCookies(driver);

  // calls page again, now with cookies
  await driver.get(url(1));
  
  await driver.wait(() => {
    return driver.findElement(By.className('dashboard-table'))
  }, 10000);

  let dashboardTable = await driver.findElement(By.className('dashboard-table'));
  console.log(await dashboardTable.getText());

  //TODO: get rows to get unique translations and their references
  // to get next page, should find href from li class="next"
  //TODO: get next page and repeat previous steps
  //TODO: print results
  return 'Teste';
};

main()
  .then((message) => {
    console.log(message);
    process.exit(0);
  });
