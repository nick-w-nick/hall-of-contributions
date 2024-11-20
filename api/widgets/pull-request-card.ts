import type { VercelResponse } from '@vercel/node'
import type { WidgetRequest } from '../widgets/models.js';
import { Widgets } from '../../src/widgets/models.js';
import { generateWidget } from '../../src/index.js';

export default async function handler(req: WidgetRequest<Widgets.PullRequestCard>, res: VercelResponse) {
    const {
        username,
        pullRequestIndex = 0,
    } = req.query;
    
    if (req.method !== 'GET') {
        return res.status(405).json({
            message: 'Method Not Allowed',
        });
    }
    
    if (!username) {
        return res.status(400).json({
            message: 'username is required',
        });
    }
    
    const widget = await generateWidget(Widgets.PullRequestCard, {
        name: Widgets.PullRequestCard,
        options: {
            username,
            pullRequestIndex,
        },
    });
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-cache');
    
    return res.status(200).send(`
        <svg width="425" height="90" xmlns="http://www.w3.org/2000/svg">
            ${widget.svg}
        </svg>
    `);
}