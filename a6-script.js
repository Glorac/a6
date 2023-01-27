/**
 * a6-script.js
 * @author @MatthewEckart
 * @file A script that converts a CSV file into JSON format.
 */

// Load relevant modules.
const csvConverter = require('a6-csvToJSON')
const rl = require('readline').createInterface({ input: process.stdin, output: process.stdout });

/**
 * @function getFilePaths
 * @summary Prompts user for file paths via CLI.
 * @requires readline
 * @returns {string} csvPath, jsonPath
 */
const getFilePaths = async function () {
	let csvPath = await new Promise(cp => { rl.question('\nPlease provide a link or file path to your CSV file:  ', cp)});
	let jsonPath = await new Promise(jp => { rl.question('\nPlease provide a file path or file name to store the converted JSON data:  ', jp)});
	
	return [csvPath, jsonPath];
};

// Run.
(async () => {
	let [csvPath, jsonPath] = await getFilePaths();
	csvConverter(csvPath, jsonPath);
})().catch(e => {});
