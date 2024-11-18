export interface Widget {
    id: string;
    svg: string;
    href: string;
}

interface WidgetConfigurationOptions {
    elementId: string;
}

export interface ConfigurationEntry {
    widgetName: string;
    options: WidgetConfigurationOptions;
}