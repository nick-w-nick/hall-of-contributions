import core from '@actions/core';
import github from '@actions/github';
import { Widget, WidgetConfigurationEntry } from './widgets/models.js';
import widgets from './widgets/index.js';

function getWidgetImageElements(widgets: Widget[]) {
    const elements = widgets.map((widget) => {
        const {
            id,
            svg,
            href,
        } = widget;
        
        return `
<a href="${href}">
    <img id="${id}" src="data:image/svg+xml,${encodeURIComponent(svg)}" />
</a>
`;
    });
    
    return elements.join('\n');
};

// TODO: allow for custom placing of widgets by using multiple sections
// with the order of the widgets in the configuration file
function insertWidgets (readmeData: string, widgets: Widget[]): string {
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
};

// function convertBase64ToString(base64: string): string {
//     return Buffer.from(base64, 'base64').toString('utf-8');
// };

async function generateWidgets(configuration: WidgetConfigurationEntry[], octokit: any): Promise<Widget[]> {
    const widgetPromises = configuration.map(async (entry) => {
        const widget = widgets.widgets[entry.name as keyof typeof widgets.widgets];
        
        if (!widget) {
            core.setFailed(`Widget ${entry.name} not found`);
            return;
        }
        
        const generatedWidgets = widget.generate({ octokit, configuration: entry as any }); // TODO: fix any
        return generatedWidgets;
    });
    
    const generatedWidgets = await Promise.all(widgetPromises);
    return generatedWidgets.flat().filter((widget): widget is Widget => widget !== undefined);
}

async function clearTempImages(octokit: any, owner: string, repo: string, path: string = '.github/hall-of-contributions/images') {
    try {
      const { data: contents } = await octokit.repos.getContent({
        owner,
        repo,
        path,
      });
      
      console.log('temp file dir contents:', contents);
      
  
    //   for (const file of contents) {
    //     await octokit.repos.deleteFile({
    //       owner,
    //       repo,
    //       path: file.path,
    //       message: `Deleting old image: ${file.name}`,
    //       sha: file.sha, // Required for deletion
    //       branch,
    //     });
    //   }
    //   console.log('Cleared the temp_images directory');
    } catch (error) {
        console.error('Error clearing temp images:', error);
    }
  }
  
  // Function to upload the image to the 'temp_images' folder
//   async function uploadImage(octokit, owner, repo, base64ImageData, imageName, branch) {
//     try {
//       const result = await octokit.repos.createOrUpdateFileContents({
//         owner,
//         repo,
//         path: `temp_images/${imageName}`, // Path where image will be stored
//         message: `Upload ${imageName} image`,
//         content: base64ImageData.split(',')[1], // Extract base64 content (remove "data:image/..." prefix)
//         branch, // Specify the branch to upload the image
//       });
  
//       console.log(`Uploaded image to ${result.data.content.download_url}`);
//     } catch (error) {
//       core.setFailed(`Error uploading image: ${error.message}`);
//     }
//   }

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
        const rawReadme = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: 'README.md',
        });
        
        if (!rawReadme) {
            core.setFailed('Failed to fetch README.md');
            return;
        }
        
        const {
            content: readmeContent,
            sha: readmeSha,
        } = rawReadme.data as { content: string, sha: string };
        
        const readmeData = Buffer.from(readmeContent, 'base64').toString('utf-8');
        
        
        // TODO: if the configuration file does not exist and one was not provided,
        // create a default configuration and fail the action with a message telling the user to add configuration options
        const configuration = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: configurationFilePath,
            mediaType: {
                format: 'raw',
            },
        });
        
        const configurationFileContent = configuration.data.toString();
        const configurationData = JSON.parse(configurationFileContent || '[]') as WidgetConfigurationEntry[];
        if (!configurationData || !Array.isArray(configurationData)) {
            core.setFailed('Invalid configuration file');
            return;
        }
        
        console.log('Using the following configuration:', JSON.stringify(configurationData, null, 2));
        
        await clearTempImages(octokit.rest, owner, repo);
        
        const widgets = await generateWidgets(configurationData, octokit.rest);
        const updatedReadme = insertWidgets(readmeData, widgets);
        
        console.log('Updated README.md:', updatedReadme);
        
        
        console.log('Updating README.md with new widgets');
        await octokit.rest.repos.createOrUpdateFileContents({
            owner,
            repo,
            content: Buffer.from(updatedReadme).toString('base64'),
            message: 'hall-of-contributions: Update README.md',
            path: 'README.md',
            sha: readmeSha,
        });
        console.log('Successfully updated README.md');
    } catch (error) {
        console.error('Error running action:', error);
        core.setFailed('Error running action');
    }
}

await run();