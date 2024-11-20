import PullRequestCard from './pull-request-card/index.js';
import { Widgets } from './models.js';

const widgets = {
    [Widgets.PullRequestCard]: PullRequestCard,
};

export default {
    widgets,
};
