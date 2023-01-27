/**
 * a6-script.js
 * @author: @MatthewEckart
 * @description: A script that converts a CSV file into JSON format.
 */

// Load relevant modules.
const fs = require('fs');
const rl = require('readline').createInterface({ input: process.stdin, output: process.stdout });

/**
 * @function csvToJson
 * Converts a CSV file to a file containing JSON data.
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
		const startTime = new Date().getTime();
		let data_start = true;
		let headers, overflow;
		let lineCount = 0;
		
		// Read the CSV file as data enters buffer.
		readStream.on('readable', () => {		
			let d;
			
			// Loop while data exists in buffer.
			while (null !== (d = readStream.read())) {
				// Parse Rows
				let rows = d.toString().split('\n');
				
				// Grab Headers
				if (data_start) headers = rows[0].split(',');
			
				// Loop through rows, converting data to JSON.
				for (let i = 0; i < rows.length; i++) {
					// Shift down a row if just beginning to process.
					if (data_start && i == 0) { i = 1 }				
				
					// Check for overflow data from previous chunk and reset overflow.
					if (overflow) {
						rows[i] = overflow + rows[i];
						overflow = false;
					}
				
					// Grab comma-separated values and validate against headers.
					let values = rows[i].split(',');
					if (values.length == headers.length) {
						// Initialize object to hold formatted data.
						let json = {};
						
						// Loop through columns.
						for (let j = 0; j < headers.length; j++) {
							json[headers[j]] = values[j];
							if (!values[j] || values[j] == '') console.log(rows[i]);
						}
					
						// Write to JSON file.
						writeStream.write(JSON.stringify(json), (err) => {
							if (err) console.log(err);
						});
						
						lineCount++;
					} else {
						// Store overflow data for the next chunk.
						overflow = rows[i];
					}
				}
			
				// End Header checking
				if (data_start) data_start = false;
			}
		});

		// End gracefully.
		readStream.on('end', () => {
			const endTime = new Date().getTime();
			const processTime = endTime - startTime;
			console.log(`\nThe operation has completed, and a JSON file has been written to ${jsonPath}.`);
			console.log(`${lineCount} lines were processed over ${processTime} milliseconds.`);
			
			process.exit(0);
		});

		// Log Errors
		// (end not-so-gracefully)
		readStream.on('error', e => {
			console.log(e);
			console.log("\nLooks like that didn't go quite according to plan...");
			process.exit(1);
		});
		writeStream.on('error', e => {
			console.log(e);
			console.log("\nLooks like that didn't go quite according to plan...");
			process.exit(1);
		});
	} catch (e) {
		console.log(e); 
		console.log("\nLooks like that didn't go quite according to plan...");
		process.exit(1);
	}
}

// Run script.
csvToJSON();