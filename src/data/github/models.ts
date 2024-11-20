export interface PullRequest {
    repositoryUrl: string;
    repositorySlug: string;
    title: string;
    number: number;
    isMerged: boolean;
    url: string;
    commentsCount: number;
    createdAt: string;
    closedAt: string | null;
}
