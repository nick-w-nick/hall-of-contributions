import PullRequestCard from './widget.js';
import github from '../../data/github/index.js';
import { type Widget, WidgetParameters } from '../models.js';
import { Configuration } from './models.js';

async function generate(parameters: WidgetParameters<Configuration>): Promise<Widget> {
    const {
        octokit,
        configuration,
    } = parameters;
    
    const {
        username,
        pullRequestIndex = 0,
    } = configuration?.options;
    
    const pullRequestIndexInt = parseInt(pullRequestIndex.toString(), 10);
    
    console.log(`Generating pull request cards for ${username}`);
    
    // TODO: Add pagination support when fetching more pull requests than are allowed per page
    const pullRequests = await github.getPullRequests(octokit, {
        author: username,
        page: 1,
        perPage: pullRequestIndexInt === 0 ? 1 : pullRequestIndexInt
    });
    
    const selectedPullRequest = pullRequests[pullRequestIndexInt];
    
    const widget = PullRequestCard(selectedPullRequest);
    return widget;
}

export default {
    generate,
};