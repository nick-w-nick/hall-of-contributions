import PullRequestCard from './widget.js';
import github from '../../data/index.js';
import { type Widget, WidgetParameters } from '../models.js';
import { Configuration } from './models.js';

async function generate(parameters: WidgetParameters<Configuration>): Promise<Widget[]> {
    const {
        octokit,
        configuration,
    } = parameters;
    
    const {
        username,
        numberOfCards = 5,
    } = configuration?.options;
    
    const pullRequests = await github.getPullRequests(octokit, { author: username, page: 1, perPage: numberOfCards });
    const widgets = pullRequests.map((pullRequest) => PullRequestCard(pullRequest));
    
    return widgets;
}

export default {
    generate,
};