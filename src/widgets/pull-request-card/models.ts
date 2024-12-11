import { PullRequest } from '../../data/github/models.js';
import { WidgetConfigurationEntry, Widgets } from '../models.js';

export interface Data extends PullRequest {
}

export interface ConfigurationOptions {
    username: string;
    pullRequestIndex: number;
    query?: string
}

export interface Configuration extends WidgetConfigurationEntry {
    name: Widgets.PullRequestCard;
    options: ConfigurationOptions;
}