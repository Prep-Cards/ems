const fs = require('fs');
const files = fs
    .readdirSync('./src/svg')
    .filter((x) => x.endsWith('.svg'))
    .map((f) => f.replace('.svg', ''));

const snakeToCamel = (s) =>
    s
        .replace(/(-\w)/g, (k) => k[1].toUpperCase())
        .replace(/^\w/, (k) => k.toUpperCase());

const SVGs = files.map((svg) => ({
    component: snakeToCamel(svg),
    svg,
}));

const data = `${SVGs.map(
    ({ svg, component }) =>
        `import { ReactComponent as ${component} } from '../svg/${svg}.svg';`
).join('\n')}

const SVGs = {
${SVGs.map(({ component }) => `    ${component},`).join('\n')}
} as const;

export default SVGs;
`;

fs.writeFileSync('./src/shared/SVG.tsx', data);
