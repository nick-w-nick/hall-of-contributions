const formatPullRequest = (pullRequest) => {
    const { title, html_url, repository_url, state, number, pull_request, comments = 0, created_at, 
    // updated_at,
    closed_at, } = pullRequest;
    let isMerged = false;
    if (state === 'closed' && pull_request?.merged_at) {
        isMerged = true;
    }
    const repositorySlug = repository_url.replace('https://api.github.com/repos/', '');
    return {
        repositoryUrl: `https://github.com/${repositorySlug}`,
        repositorySlug,
        number,
        title,
        isMerged,
        url: html_url,
        commentsCount: comments,
        createdAt: created_at,
        closedAt: closed_at,
    };
};
export const getPullRequests = async (octokit, { author, page = 1, perPage = 15 }) => {
    const data = await octokit.search.issuesAndPullRequests({
        q: `author:${author} type:pr`,
        order: 'desc',
        sort: 'created',
        page: page,
        per_page: perPage,
    });
    const formattedPullRequests = data.data.items.map((pr) => formatPullRequest(pr));
    return formattedPullRequests;
};
export const getAllPullRequests = async (octokit, { author }) => {
    const data = await octokit.paginate({
        method: 'GET',
        url: `/search/issues?q=${encodeURIComponent(`author:${author} type:pr`)}`,
    });
    const formattedPullRequests = data.map((pr) => formatPullRequest(pr));
    return formattedPullRequests;
};
//# sourceMappingURL=github.js.map