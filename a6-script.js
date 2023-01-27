/**
 * a6-script.js
 * @author: @MatthewEckart
 * @description: A script that converts a CSV file into JSON format.
 */

// Load relevant modules.
const fs = require('fs');
const rl = require('readline').createInterface({ input: process.stdin, output: process.stdout });

/**
 * @class csvToJsonConverter
 * Contains methods for converting CSV files to JSON output.
 */
class csvToJsonConverter {
	// Set up converter by passing Header values.
	constructor(headers) {
		if (!this.headers) this.headers = headers;
		this.lineCount = 0;
		this.overflow = null;
	}
	
	// Parse data as it is passed.
	parseData(data, skipRows) {
		// If Headers have not been set, return null.
		if (!this.headers) return null;
		
		// Set row skip default.
		if (!skipRows) skipRows = 0;
	
		// Initialize objects to hold formatted data.
		let json = {};
		let jsonString = '';
		
		// Seperate rows.
		let rows = data.toString().split('\n');
		
		// Loop through rows, converting data to JSON.
		for (let i = skipRows; i < rows.length; i++) {		
			// Check for overflow data from previous chunk and reset overflow.
			if (this.overflow) {
				rows[i] = this.overflow + rows[i];
				this.overflow = null;
			}
		
			// Grab comma-separated values and validate against headers.
			let values = rows[i].split(',');
			if (values.length == this.headers.length) {				
				// Loop through columns.
				for (let j = 0; j < this.headers.length; j++) {
					json[this.headers[j]] = values[j];
				}
				
				jsonString = jsonString + JSON.stringify(json);
				this.lineCount++;
			} else {
				// Store overflow data for the next chunk.
				this.overflow = rows[i];
			}
		}
		
		return jsonString;
	}
	
	// Set Header values.
	setHeaders(headers) {
		this.headers = headers;
	}
	
	// Return Header values.
	getHeaders() {
		return this.headers;
	}
	
	// Return lines processed.
	getLineCount() {
		return this.lineCount;
	}
}

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
		const converter = new csvToJsonConverter();
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
					
					json = converter.parseData(d, 1);
				} else {
					json = converter.parseData(d);
				}
				
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
