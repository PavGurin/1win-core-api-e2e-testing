import axios from 'axios';

const config = {
    domain: '1win.testrail.io',
    runName: `${process.env.CI_COMMIT_REF_NAME}:${process.env.TEST_URL}#${process.env.CI_PIPELINE_ID}`,
    username: process.env.CYPRESS_TESTRAIL_USER,
    password: process.env.CYPRESS_TESTRAIL_PASSWORD,
    projectId: process.env.CYPRESS_TESTRAIL_PROJECT_ID,
}

const statusId = (mochaState) => ({
    passed: 1,
    failed: 5
}[mochaState])

const titleToCaseId = testTitle => (/\bT?C(\d+)\b/g.exec(testTitle) || [-1])[1];

class TestrailReporter {
    constructor(runner) {
        this.results = []

        this.instance = axios.create({
            baseURL: `https://${config.domain}/index.php?/api/v2`,
            headers: { 'Content-Type': 'application/json' },
            auth: {
                username: config.username,
                password: config.password,
            },
        });

        runner
            .on('pass', this.addResult.bind(this))
            .on('fail', this.addResult.bind(this))
            .on('end', this.publish.bind(this))
    }

    addResult(test, error) {
        this.results.push({
            status_id: statusId(test.state),
            case_id: titleToCaseId(test.title) || -1,
            comment: String(error),
            elapsed: test.duration && `${test.duration / 1000}s`,
        })
    }

    async publish() {
        try {
            const { data: { id } } = await this.instance.post(`add_run/${config.projectId}`, {
                name: config.runName,
                include_all: true,
            })
            await this.instance.post(`/add_results_for_cases/${id}`, {
                results: this.results.filter(({ case_id }) => case_id !== -1),
            });
        } catch (e) {
            console.log(e)
        }

    }
}

module.exports = TestrailReporter;