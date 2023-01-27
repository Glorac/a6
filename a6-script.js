/**
 * a6-script.js
 * @author @MatthewEckart
 * @file A script that converts a CSV file into JSON format.
 */

// Load relevant modules.
const fs = require('fs');
const rl = require('readline').createInterface({ input: process.stdin, output: process.stdout });
const csvConverter = require('a6-csvConverter')

/**
 * @function csvToJson
 * @summary Converts a CSV file to a file containing JSON data.
 * @param {string} csvPath - the path to the source CSV file
 * @param {string} jsonPath - the path at which JSON data should be output
 * If csvPath or jsonPath are not provided via parameters, the user will be prompted to input them.
 * @requires fs
 * @requires readline
 */
const csvToJSON = async function (csvPath, jsonPath) {
	// Prompt user for file paths if they are not passed into the function.
	if (!csvPath)
		csvPath = await new Promise(cp => { rl.question('\nPlease provide a link or file path to your CSV file:  ', cp)});
	if (!jsonPath)
		jsonPath = await new Promise(jp => { rl.question('\nPlease provide a file path or file name to store the converted JSON data:  ', jp)});
	
	try {
		// Initialize
		const readStream = fs.createReadStream(csvPath);
		const writeStream = fs.createWriteStream(jsonPath);
		const converter = new csvConverter();
		const startTime = new Date().getTime();
		let data_start = true;
		
		// Read the CSV file as data enters buffer.
		readStream.on('readable', () => {		
			let d;
			
			// Loop while data exists in buffer.
			while (null !== (d = readStream.read())) {
				let json;
			
				// Grab Headers and initialize Converter Object.
				if (data_start) {
					let headers = d.toString().split('\n')[0].split(',');
					converter.setHeaders(headers);
					data_start = false;
					
					json = converter.toJSON(d, 1);
				} else json = converter.toJSON(d);
				
				// Write to JSON file.
				if (json) {
					writeStream.write(json, (err) => {
						if (err) console.log(err);
					});
				}
			}
		});

		// End gracefully.
		readStream.on('end', () => {
			const endTime = new Date().getTime();
			const processTime = endTime - startTime;
			const lineCount = converter.getLineCount();
			console.log(`\nThe operation has completed, and a JSON file has been written to ${jsonPath}.`);
			console.log(`${lineCount} lines were processed over ${processTime} milliseconds.`);
			end();
		});

		// Log Errors
		// (end not-so-gracefully)
		readStream.on('error', e => {
			end(e);
		});
		writeStream.on('error', e => {
			end(e);
		});
	} catch (e) {
		end(e);
	}
}

/**
 * @function end
 * @summary Ends and exits the process.
 * @param {error} e - any errors that may have caused the process to end.
 */
const end = function (e) {
	if (e) {
		console.log(e); 
		console.log("\nLooks like that didn't go quite according to plan...");
		process.exit(1);
	}
	process.exit(0);
}

// Run script.
csvToJSON();
