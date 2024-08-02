#!/usr/bin/env node
const fs = require('node:fs/promises');
const path = require('node:path');
const yargs = require('yargs/yargs');
const {hideBin} = require('yargs/helpers');
const {parseMarkdown} = require('./core/parse-markdown');

async function main() {
	const argv = yargs(hideBin(process.argv))
		.usage('Usage: $0 <file>')
		.demandCommand(1, 'Please provide a Markdown file to parse.')
		.argv;

	const filePath = path.resolve(argv._[0]);
	const markdownText = await fs.readFile(filePath, 'utf8');
	const parsedJson = parseMarkdown(markdownText);

	console.dir(parsedJson, {depth: 5, maxArrayLength: null});
}

main().catch(error => {
	console.error('An error occurred:', error.message);
	process.exit(1);
});
