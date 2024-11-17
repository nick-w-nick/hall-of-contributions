import core from '@actions/core';
// import github from '@actions/github';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { ConfigurationEntry } from './models.js';

function getConfiguration(path: string): ConfigurationEntry[] | undefined {
    console.log('config path:', path);
    
    try {
        const filePath = resolve(process.cwd(), path);
        console.log(`Reading configuration file from path: ${filePath}`);
        
        if (existsSync(filePath)) {
            const fileData = readFileSync(filePath, 'utf8').toString();
            
            if (!fileData) {
                console.error('Invalid configuration file schema');
            }
            
            return JSON.parse(fileData) as ConfigurationEntry[];
        } else {
            console.error(`Configuration file not found at path: ${filePath}`);
        }
    } catch (error) {
        console.error(`Error reading configuration file: ${error}`);
    }
    
    return undefined;
}

async function run() {
    try {
        // const token = core.getInput('github_token');
        // const octokit = github.getOctokit(token);
        
        console.log('running action');
        
        const configurationFilePath = process.env.CONFIGURATION_FILE || '';
        
        const configuration = getConfiguration(configurationFilePath);
        console.log('configuration', configuration);
        
        
        if (!configuration) {
            core.setFailed('Invalid configuration file');
            return;
        }
        
        // const { owner, repo } = github.context.repo;
    } catch (error) {
        
    }
}

await run();