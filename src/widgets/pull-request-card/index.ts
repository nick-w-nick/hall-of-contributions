import PullRequestCard from './widget.js';
import github from '../../data/github/index.js';
import { type Widget, WidgetParameters } from '../models.js';
import { Configuration } from './models.js';

async function generate(parameters: WidgetParameters<Configuration>): Promise<Widget> {
    const {
        octokit,
        configuration,
    } = parameters;
    
    console.log('configuration', configuration);
    
    const {
        username,
        pullRequestIndex = 0,
    } = configuration?.options;
    
    console.log(`Generating pull request cards for ${username}`);
    
    const pullRequests = await github.getPullRequests(octokit, { author: username, page: 1, perPage: 5 });
    const selectedPullRequest = pullRequests[pullRequestIndex];
    
    const widget = PullRequestCard(selectedPullRequest);
    return widget;
}

export default {
    generate,
};