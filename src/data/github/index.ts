import type { Octokit, RestEndpointMethodTypes } from '@octokit/rest';
import { PullRequest } from './models.js';

const formatPullRequest = (pullRequest: RestEndpointMethodTypes['search']['issuesAndPullRequests']['response']['data']['items'][0]): PullRequest => {
    const {
        title,
        html_url,
        repository_url,
        state,
        number,
        pull_request,
        comments = 0,
        created_at,
        // updated_at,
        closed_at,
    } = pullRequest;
    
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

const getPullRequests = async (octokit: Octokit, { author, page = 1, perPage = 15, queryFilter }: { author: string, page: number, perPage: number, queryFilter?: string }) => {
    const data = await octokit.search.issuesAndPullRequests({
        q: `author:${author} type:pr ${queryFilter || ''}`,
        order: 'desc',
        sort: 'created',
        page: page,
        per_page: perPage,
    });
    
    const formattedPullRequests = data.data.items.map((pr) => formatPullRequest(pr));
    return formattedPullRequests;
};

const getAllPullRequests = async (octokit: Octokit, { author }: { author: string }) => {
    const data = await octokit.paginate({
        method: 'GET',
        url: `/search/issues?q=${encodeURIComponent(`author:${author} type:pr`)}`,
    }) as RestEndpointMethodTypes['search']['issuesAndPullRequests']['response']['data']['items'];
    
    const formattedPullRequests = data.map((pr) => formatPullRequest(pr));
    return formattedPullRequests;
};

export default {
    getPullRequests,
    getAllPullRequests,
};