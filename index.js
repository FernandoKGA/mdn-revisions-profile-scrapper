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

const headers = {
  Cookie: `${cookies.dwf_sg_task_completion}; ${cookies._ga}; ${cookies.csrftoken}; ${cookies.sessionid}; ${cookies._gid}; ${cookies._gat}`,
};

const addCookies = async (driver) => {
  await driver.manage().addCookie({ name: '_ga', value: cookies._ga });
  await driver.manage().addCookie({ name: '_gid', value: cookies._gid });
  await driver.manage().addCookie({ name: '_gat', value: cookies._gat });
  await driver.manage().addCookie({ name: 'csrftoken', value: cookies.csrftoken });
  await driver.manage().addCookie({ name: 'sessionid', value: cookies.sessionid });
  await driver.manage().addCookie({ name: 'dwf_sg_task_completion', value: cookies.dwf_sg_task_completion });
  return driver;
};

const url = (page) => {
  return `https://wiki.developer.mozilla.org/${process.env.LOCALE}/dashboards/revisions?user=${process.env.USER}&page=${page}`;
}

const main = async () => {
  const options = new firefox.Options();
  options.headless();

  let driver = await new Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(options)
    .build();

  await driver.get(url(1));
  driver = await addCookies(driver);
  
  let dashboardTable = await driver.findElement(By.className('dashboard-table'));
  console.log(dashboardTable);
  // const resultFirstPage = await responseFirstPage.text();
  // const betterpage = resultFirstPage.replace(/\s{2,}/g,'').replace(/\n/g,'');
  
  //'/html/body/main/div[2]/div/div/table/tbody'
  //resultFirstPage.body.main  <div class="dashboard"> <li class="next"> <table class="dashboard-table" width="100%">

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
