import type { Octokit } from "@octokit/rest";
import { Configuration as PullRequestCardConfiguration } from "./pull-request-card/models.js";

export interface Widget {
    id: string;
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