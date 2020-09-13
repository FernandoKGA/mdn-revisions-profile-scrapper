require('dotenv').config();
const fetch = require('node-fetch');

const cookies = {
    dwf_sg_task_completion = `dwf_sg_task_completion=${process.env.DWF_SG_TASK_COMPLETION}`,
    _ga = `_ga=${process.env.GA}`,
    csrftoken = `csrftoken=${process.env.CSRFTOKEN}`,
    sessionid = `sessionid=${process.env.SESSIONID}`,
    _gid = `_gid=${process.env.GID}`,
    _gat = `_gat=${process.env.GAT}`,
};

const headers = {
    Cookie: `${cookies.dwf_sg_task_completion}; ${cookies._ga}; ${cookies.csrftoken}; ${cookies.sessionid}; ${cookies._gid}; ${cookies._gat}`,
};

const url = (page) => {
    return `https://wiki.developer.mozilla.org/${process.env.LOCALE}/dashboards/revisions?user=${process.env.USER}&page=${page}`;
}

const main = async () => {
    //TODO: get first page of revisions page
    //TODO: get rows to get unique translations and their references
    // to get next page, should find href from li class="next"
    //TODO: get next page and repeat previous steps
    //TODO: print results
};

main()
  .then((message) => {
    console.log(message);
    process.exit(0);
  })
  .catch((error) => {
    console.error(JSON.stringify(error, null, 2));
    process.exit(1);
  });