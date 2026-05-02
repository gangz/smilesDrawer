/**
 * Generate readme/polymer-check/*.svg for README / PR figures.
 * Run manually: npm exec -- vitest run test/manual/export-polymer-overlay-svg.test.js
 */
import {describe, it, expect} from 'vitest';
import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {JSDOM} from 'jsdom';
import Parser from '../../src/Parser.js';
import SvgDrawer from '../../src/SvgDrawer.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '../../readme/polymer-check');

function setupDOM() {
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;
    return dom;
}

function renderSvg(smiles, options = {}) {
    const dom = setupDOM();
    const svg = dom.window.document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    dom.window.document.body.appendChild(svg);
    const tree = Parser.parse(smiles);
    expect(tree).toBeDefined();
    const drawer = new SvgDrawer({
        isomeric: true,
        width: 440,
        height: 280,
        bondLength: 22,
        explicitHydrogens: false,
        terminalCarbons: false,
        ...options,
    });
    drawer.draw(tree, svg, 'light', false);
    return sanitizeSvgForStandaloneFile(svg.outerHTML);
}

function sanitizeSvgForStandaloneFile(html) {
    return html.replace(/<svg(\b[^>]*?)>/, (full, attrs) => {
        let a = attrs;
        if (!/\sxmlns\s*=/.test(a)) {
            a = ` xmlns="http://www.w3.org/2000/svg"${a}`;
        }
        if (!/\swidth\s*=/.test(a)) {
            a = ` width="440" height="280"${a}`;
        }
        return `<svg${a}>`;
    });
}

describe('manual export polymer overlay svg', () => {
    it('writes readme/polymer-check/*.svg', () => {
        mkdirSync(outDir, {recursive: true});

        const figures = [
            ['01-pmma-none.svg', '[*]CC(C(=O)OC)[*]', {polymerRepeatUnitStyle: 'none'}],
            ['02-pmma-bracket-n.svg', '[*]CC(C(=O)OC)[*]', {polymerRepeatUnitStyle: 'bracket-n'}],
            ['03-ester-bracket-n.svg', '*CC(=O)O*', {polymerRepeatUnitStyle: 'bracket-n'}],
            ['04-internal-wildcards.svg', 'C[*]CC[*]', {polymerRepeatUnitStyle: 'bracket-n'}],
        ];

        for (const [name, smiles, opts] of figures) {
            const body = renderSvg(smiles, opts);
            const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<!-- SMILES: ${smiles} options: ${JSON.stringify(opts)} -->\n${body}\n`;
            writeFileSync(join(outDir, name), xml, 'utf8');
        }
    });
});
