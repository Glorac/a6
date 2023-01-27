/**
 * a6-script.js
 * @author @MatthewEckart
 * @file A script that converts a CSV file into JSON format.
 */

// Load relevant modules.
const convert = require('a6-csvToX')
const rl = require('readline').createInterface({ input: process.stdin, output: process.stdout });

/**
 * @function getFilePaths
 * @summary Prompts user for file paths via CLI.
 * @requires readline
 * @returns {string} [csvPath, outputPath, dataType]
 */
const getFilePaths = async function () {
	let dataType = await new Promise(dt => { rl.question('\nWould you like to convert the file to JSON, XML, or TSV?  ', dt)});
	dataType = dataType.toUpperCase();
	
	while (dataType != 'JSON' && dataType != 'XML' && dataType != 'TSV') {
		dataType = await new Promise(dt => { rl.question('\nSorry, that wasn\'t valid input. Please try again.\nWould you like to convert the file to JSON, XML, or TSV?  ', dt)});
		dataType = dataType.toUpperCase();
	}
	
	let csvPath = await new Promise(cp => { rl.question('\nPlease provide a link or file path to your CSV file:  ', cp)});
	let outputPath = await new Promise(op => { rl.question('\nPlease provide a file path or file name to store the converted data:  ', op)});
	
	return [csvPath, outputPath, dataType];
};

// Run.
(async () => {
	let [csvPath, outputPath, dataType] = await getFilePaths();
	convert(csvPath, outputPath, dataType);
})().catch(e => {});
