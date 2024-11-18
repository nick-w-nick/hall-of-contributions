import { icons, colors } from '../constants.js';
function PullRequestCard(parameters) {
    const { title, url, repositorySlug, isMerged, commentsCount, createdAt, 
    // closedAt,
    number, repositoryUrl, } = parameters;
    const svg = `
            <svg x="0" y="0" width="100%" xmlns="http://www.w3.org/2000/svg">
                <style>
                    .bg { fill: #12171e; }
                    .border { fill: none; stroke: #30363d; }
                    .text-main { fill: #c9d1d9; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; }
                    .text-main:hover { fill: #58a6ff; }
                    .text-secondary { fill: #8b949e; font-family: Arial, sans-serif; font-size: 14px; }
                    .footer-text { fill: #8b949e; font-family: Arial, sans-serif; font-size: 14px; }
                    .text-secondary:hover { fill: #58a6ff; }
                    .merged-icon { fill: ${colors.merged}; }
                    .open-icon { fill: ${colors.open}; }
                    .comment-icon { fill: #${colors.comment}; }
                </style>
                
                <!-- Background -->
                <rect x="0" y="0" width="425" height="90" class="bg" rx="6" />
                <rect x="0" y="0" width="425" height="90" class="border" rx="6" />
                
                <!-- Repository info -->
                <a href="${repositoryUrl}">
                    <text x="16" y="26" class="text-secondary">${repositorySlug} #${number}</text>
                </a>
                
                <!-- PR Title -->
                <a href="${url}">
                    <text x="16" y="50" class="text-main">${title.length > 50 ? `${title.slice(0, 50).trimEnd()}...` : title}</text>
                </a>
                
                <!-- Footer -->
                <!-- Merged Icon and Text -->
                <g transform="translate(16, 65)">
                    ${isMerged ? icons.merged.element('merged-icon') : icons.open.element('open-icon')}
                    <text x="24" y="5" class="footer-text" dy="0.5em">${isMerged ? 'Merged' : 'Open'}</text>
                </g>
                
                <!-- Comment Icon and Count -->
                <g transform="translate(165, 65)">
                    ${icons.comment.element('comment-icon')}
                    <text x="24" y="5" class="footer-text" dy="0.5em">${commentsCount} comment${commentsCount === 1 ? '' : 's'}</text>
                </g>
                
                <!-- Date -->
                <text x="340" y="76" class="footer-text">${new Date(createdAt).toLocaleDateString()}</text>
            </svg>
        `;
    return {
        href: url,
        id: `pull-request-${parameters.number}`,
        svg,
    };
}
;
export default PullRequestCard;
//# sourceMappingURL=index.js.map