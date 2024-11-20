import type { VercelRequest, VercelRequestQuery } from '@vercel/node'
import { WidgetConfiguration, Widgets } from '../../src/widgets/models.js';

export interface WidgetRequest<T extends Widgets> extends VercelRequest {
    query: VercelRequestQuery & WidgetConfiguration[T]['options'];
}