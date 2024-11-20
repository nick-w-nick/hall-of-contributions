import { WidgetConfiguration, Widgets } from './widgets/models.js';
import widgets from './widgets/index.js';
import octokit from './data/github/client.js';

async function generateWidget<T extends Widgets>(widgetName: T, widgetConfiguration: WidgetConfiguration[T]) {
    const widget = widgets.widgets[widgetName];
    
    const result = await widget.generate({
        configuration: widgetConfiguration,
        octokit,
    });
    
    return result;
};

export {
    generateWidget,
};