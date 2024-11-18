import { PullRequest } from '../../data/models.js';
import { WidgetConfigurationEntry } from '../models.js';

export interface Data extends PullRequest {
}

export interface Configuration extends WidgetConfigurationEntry {
    name: 'pull-request-card';
    options: {
        username: string;
        numberOfCards?: number;
    };
}