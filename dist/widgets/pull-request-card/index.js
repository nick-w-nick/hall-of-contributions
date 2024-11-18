import PullRequestCard from './widget.js';
import github from '../../data/index.js';
async function generate(parameters) {
    const { octokit, configuration, } = parameters;
    const { username, numberOfCards = 5, } = configuration?.options;
    const pullRequests = await github.getPullRequests(octokit, { author: username, page: 1, perPage: numberOfCards });
    const widgets = pullRequests.map((pullRequest) => PullRequestCard(pullRequest));
    return widgets;
}
export default {
    generate,
};
//# sourceMappingURL=index.js.map