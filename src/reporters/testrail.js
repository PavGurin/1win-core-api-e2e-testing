import axios from 'axios';

const config = {
    domain: '1win.testrail.io',
    runName: `${process.env.CI_COMMIT_REF_NAME}:${process.env.TEST_URL}#${process.env.CI_PIPELINE_ID}`,
    username: process.env.CYPRESS_TESTRAIL_USER,
    password: process.env.CYPRESS_TESTRAIL_PASSWORD,
    projectId: process.env.CYPRESS_TESTRAIL_PROJECT_ID,
    filter: process.env.TEST_FILTER
};

const statusId = (mochaState) => ({
    passed: 1,
    blocked: 2,
    failed: 5
}[mochaState]);

const fullTitle = (suite) => {
    const titles = []
    while (suite && suite.title) {
        titles.push(suite.title)
        suite = suite.parent
    }
    return titles.reverse().join(' ')
}

const titleToCaseId = testTitle => (/\bT?C(\d+)\b/g.exec(testTitle) || [-1])[1];

class TestrailReporter {
    constructor(runner) {
        this.results = [];

        this.instance = axios.create({
            baseURL: `https://${config.domain}/index.php?/api/v2`,
            headers: {'Content-Type': 'application/json'},
            auth: {
                username: config.username,
                password: config.password
            }
        });

        runner
            .on('pass', this.addResult.bind(this))
            .on('fail', this.addResult.bind(this))
            .on('end', this.publish.bind(this));
    }

    addResult(test, error) {
        if (fullTitle(test).includes(config.filter)) test.state = 'blocked'
        this.results.push({
            status_id: statusId(test.state),
            case_id: titleToCaseId(test.title) || -1,
            comment: String(error || ''),
            elapsed: test.duration && `${test.duration / 1000}s`,
        })
    }

    async publish() {
        const { data: { id } } = await this.instance.post(`add_run/${config.projectId}`, {
            name: config.runName,
            include_all: true,
        })
        this.results = this.results
            .filter(({ case_id }) => case_id !== -1)
        for (const result of this.results) {
            try {
                await this.instance.post(`/add_results_for_cases/${id}`, { results: [result] })
            } catch (e) {
                console.log(e)
            }
        }

    }
}

module.exports = TestrailReporter;
