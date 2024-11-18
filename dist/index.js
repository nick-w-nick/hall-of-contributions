import core from '@actions/core';
// import github from '@actions/github';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
// TODO: if the configuration file does not exist and one was not provided,
// create a default configuration and fail the action with a message telling the user to add configuration optons
function getConfiguration(path) {
    try {
        const filePath = resolve(process.cwd(), path);
        console.log(`Reading configuration file from path: ${filePath}`);
        if (existsSync(filePath)) {
            const fileData = readFileSync(filePath, 'utf8').toString();
            // TODO: use zod to validate the configuration file schema
            if (!fileData) {
                console.error('Invalid configuration file schema');
                return undefined;
            }
            // TODO: fail if the configuration file is empty or has no valid widget entries
            console.log('Found configuration file at path:', filePath);
            return JSON.parse(fileData);
        }
        else {
            console.error(`Configuration file not found at path: ${filePath}`);
        }
    }
    catch (error) {
        console.error(`Error reading configuration file: ${error}`);
    }
    return undefined;
}
async function run() {
    try {
        // const token = core.getInput('github_token');
        // const octokit = github.getOctokit(token);
        const githubToken = process.env.GITHUB_TOKEN || '';
        const configurationFilePath = process.env.CONFIGURATION_FILE || '';
        if (!githubToken) {
            core.setFailed('GitHub token not provided, please set the GITHUB_TOKEN in the workflow file');
            return;
        }
        const configuration = getConfiguration(configurationFilePath);
        if (!configuration) {
            core.setFailed('Invalid configuration file');
            return;
        }
        console.log('Using the following configuration:', JSON.stringify(configuration, null, 2));
        // const { owner, repo } = github.context.repo;
    }
    catch (error) {
        console.error('Error running action:', error);
    }
}
await run();
//# sourceMappingURL=index.js.map