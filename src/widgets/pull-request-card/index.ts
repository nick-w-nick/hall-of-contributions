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
        query,
    } = configuration?.options;
    
    // TODO: update typing to force all options to come in as strings due
    // to how query parameters are parsed
    const pullRequestIndexInt = parseInt(pullRequestIndex.toString(), 10);
    
    // TODO: Add pagination support when fetching more pull requests than are allowed per page
    const pullRequests = await github.getPullRequests(octokit, {
        author: username,
        page: 1,
        perPage: pullRequestIndexInt === 0 ? 1 : pullRequestIndexInt + 1,
        query,
    });
    
    const selectedPullRequest = pullRequests[pullRequestIndexInt];
    
    const widget = PullRequestCard(selectedPullRequest);
    return widget;
}

export default {
    generate,
};