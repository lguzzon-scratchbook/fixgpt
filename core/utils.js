import {input} from '@inquirer/prompts';

function constructPrompt(object) {
	let prompt = '';

	for (const k in object) {
		if (object[k].trim() !== '') {
			prompt += `${k}:\n${object[k]}\n\n`;
		}
	}

	return prompt.trim();
}

async function injectVariables({
	text,
	variables,
	responses,
	shouldInsertInline = true,
}) {
	let nextText = text;
	// For (const variableName in variables) {
	//   nextText = nextText.replaceAll(
	//     `[[variables.${snakeCase(variableName)}]]`,
	//     variables[variableName].body.trim()
	//   );
	// }

	if (shouldInsertInline) {
		nextText = await injectInlineVariables({text: nextText});
	}

	for (const responseIndex in responses) {
		const currentResponse = responses[responseIndex];
		for (const k in currentResponse) {
			nextText = nextText.replaceAll(
				`[[responses.${responseIndex}.${k}]]`,
				currentResponse[k],
			);
		}
	}

	return nextText;
}

async function injectInlineVariables({text}) {
	let nextText = text;

	const askRegexp = /\[\[ask\.([A-z\d-_]+)\.([A-z\d-_]+)]]/g;
	const questions = [...nextText.matchAll(askRegexp)];
	const alreadyAsked = new Set([]);
	for (const match of questions) {
		const [string, type, name] = match;
		if (!alreadyAsked.has(name)) {
			nextText = nextText.replaceAll(string, await input({message: name}));
		}
	}

	return nextText;
}

export {constructPrompt, injectVariables, injectInlineVariables};
