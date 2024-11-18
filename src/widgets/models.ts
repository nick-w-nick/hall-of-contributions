import type { Octokit } from "@octokit/rest";

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