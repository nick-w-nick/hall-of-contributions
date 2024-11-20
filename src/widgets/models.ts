import type { Octokit } from '@octokit/rest';
import { Configuration as PullRequestConfiguration } from './pull-request-card/models.js';

export enum Widgets {
    PullRequestCard = 'pull-request-card',
}

export interface WidgetConfiguration {
    [Widgets.PullRequestCard]: PullRequestConfiguration;
}

export interface Widget {
    svg: string;
    href: string;
}

export interface WidgetConfigurationEntry {
    name: string;
    options: unknown;
}

export interface WidgetParameters<WidgetConfiguration> {
    octokit: Octokit;
    configuration: WidgetConfiguration;
}
