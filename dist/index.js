import core from '@actions/core';
import github from '@actions/github';
import widgets from './widgets/index.js';
function getWidgetImageElements(widgets) {
    const elements = widgets.map((widget) => {
        const { id, svg, href, } = widget;
        return `
            <a href="${href}" target="_blank" rel="noopener noreferrer">
                <img id="${id}" src="data:image/svg+xml,${encodeURIComponent(svg)}" />
            </a>
        `;
    });
    return elements.join('\n');
}
;
// TODO: allow for custom placing of widgets by using multiple sections
// with the order of the widgets in the configuration file
function insertWidgets(readmeData, widgets) {
    const tag = '<!-- hall-of-contributions -->';
    const startIndex = readmeData.indexOf(tag);
    const endIndex = readmeData.indexOf(tag, startIndex + 1);
    if (startIndex === -1 || endIndex === -1) {
        core.setFailed('Failed to find the tag in README.md');
        return readmeData;
    }
    const widgetElements = getWidgetImageElements(widgets);
    const updatedReadme = `${readmeData.slice(0, startIndex + tag.length)}\n${widgetElements}\n${readmeData.slice(endIndex)}`;
    return updatedReadme;
}
;
async function generateWidgets(configuration, octokit) {
    const widgetPromises = configuration.map(async (entry) => {
        const widget = widgets.widgets[entry.name];
        if (!widget) {
            core.setFailed(`Widget ${entry.name} not found`);
            return;
        }
        const generatedWidgets = widget.generate({ octokit, configuration: entry }); // TODO: fix any
        return generatedWidgets;
    });
    const generatedWidgets = await Promise.all(widgetPromises);
    return generatedWidgets.flat().filter((widget) => widget !== undefined);
}
async function run() {
    try {
        const githubToken = process.env.GITHUB_TOKEN || '';
        const configurationFilePath = process.env.CONFIGURATION_FILE || '';
        if (!githubToken) {
            core.setFailed('GitHub token not provided, please set the GITHUB_TOKEN in the workflow file');
            return;
        }
        const octokit = github.getOctokit(githubToken);
        const { owner, repo } = github.context.repo;
        console.log(`Fetching current state of README.md for ${owner}/${repo}`);
        const readme = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: 'README.md',
        });
        if (!readme) {
            core.setFailed('Failed to fetch README.md');
            return;
        }
        console.log('readme state:', JSON.stringify(readme.data, null, 2));
        // TODO: if the configuration file does not exist and one was not provided,
        // create a default configuration and fail the action with a message telling the user to add configuration options
        const configuration = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: configurationFilePath,
        });
        // @ts-ignore
        console.log('config data:', JSON.stringify(configuration.data.content, null, 2));
        const configurationData = JSON.parse(configuration.data.toString() || '[]');
        if (!configurationData || !Array.isArray(configurationData)) {
            core.setFailed('Invalid configuration file');
            return;
        }
        console.log('Using the following configuration:', JSON.stringify(configurationData, null, 2));
        const readmeData = readme.data.toString();
        const widgets = await generateWidgets(configurationData, octokit.rest);
        const updatedReadme = insertWidgets(readmeData, widgets);
        console.log('Updating README.md with new widgets');
        await octokit.rest.repos.createOrUpdateFileContents({
            owner,
            repo,
            content: Buffer.from(updatedReadme).toString('base64'),
            message: 'hall-of-contributions: Update README.md',
            path: 'README.md',
        });
        console.log('Successfully updated README.md');
    }
    catch (error) {
        console.error('Error running action:', error);
        core.setFailed('Error running action');
    }
}
await run();
//# sourceMappingURL=index.js.map