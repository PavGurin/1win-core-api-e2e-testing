/* eslint no-console: off */

const stripAnsi = require('strip-ansi');
const axios = require('axios');

const config = {
  domain: '1win.testrail.io',
  runName: `${process.env.CI_COMMIT_REF_NAME || new Date()} : ${process.env.TEST_URL || process.env.SCRIPT_NAME || ' '} #${process.env.CI_PIPELINE_ID || 1}`,
  username: process.env.CYPRESS_TESTRAIL_USER,
  password: process.env.CYPRESS_TESTRAIL_PASSWORD,
  projectId: process.env.CYPRESS_TESTRAIL_PROJECT_ID,
  filter: process.env.TEST_FILTER,
};

const titleToCaseId = testTitle => (/\bT?C(\d+)\b/g.exec(testTitle) || [-1])[1];

/* eslint quote-props: 'off' */
const statusId = status => ({
  'passed': 1,
  'blocked': 2,
  'failed': 5,
}[status]);

class TestrailReporter {
  constructor(globalConfig, options) {
    /* eslint no-underscore-dangle: 'off' */
    this._globalConfig = globalConfig;
    this._options = options;
    this.axiosInstance = axios.create({
      baseURL: `https://${config.domain}/index.php?/api/v2`,
      headers: { 'Content-Type': 'application/json' },
      auth: {
        username: config.username,
        password: config.password,
      },
    });
    this.testRunId = -1;
    this.res = [];
    this.casesIds = [];
  }

  onTestResult(testRunConfig, testResults, runResults) {
    testResults.testResults.forEach((result, i, results) => {
      if (titleToCaseId(result.title)) {
        // eslint-disable-next-line no-param-reassign
        if (result.fullName.includes(config.filter)) result.status = 'blocked';
        if (statusId(result.status) !== undefined) {
          this.casesIds.push(titleToCaseId(result.title));
          this.res.push({
          /* eslint quote-props: 'off' */
            'status_id': statusId(result.status),
            'case_id': titleToCaseId(result.title),
            'comment': stripAnsi(result.failureMessages[0]),
            'elapsed': result.duration && `${result.duration / 1000}s`,
          });
        }
      }
    });
  }

  onRunComplete(test, runResults) {
    this.expToTestrail();
  }

  async expToTestrail() {
    try {
      const { data: { id } } = await this.axiosInstance.post(`add_run/${config.projectId}`, {
        name: config.runName,
        include_all: false,
        case_ids: this.casesIds,
      });
      this.testRunId = id;
    } catch (e) { console.log(e.response.data); }

    try {
      await this.axiosInstance.post(`/add_results_for_cases/${this.testRunId}`, { 'results': this.res });
    } catch (e) {
      await this.axiosInstance.post(`/close_run/${this.testRunId}`, {});
      console.log(e.response.data);
    }
    try {
      await this.axiosInstance.post(`/close_run/${this.testRunId}`, {});
    } catch (e) {
      console.log(e.response.data);
    }
  }
}

module.exports = TestrailReporter;
