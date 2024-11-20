import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
    const { name = 'World' } = req.query
    console.log('req', req);
    
    return res.json({
        message: `test: Hello ${name}!`,
    });
}