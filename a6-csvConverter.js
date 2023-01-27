/**
 * a6-CsvConverter.js
 * @author: @MatthewEckart
 * @description: A script that converts a CSV file into JSON format.
 */

/**
 * @class csvConverter
 * Contains methods for converting CSV files to other data outputs.
 */
class CsvConverter {
	// Set up converter by passing Header values.
	constructor(headers) {
		if (!this.headers) this.headers = headers;
		this.lineCount = 0;
		this.overflow = null;
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
	
	// Convert data to JSON format.
	toJSON(data, skipRows) {
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
	
	// Convert data to XML format.
	toXML(data, skipRows) {
		// If Headers have not been set, return null.
		if (!this.headers) return null;
		
		// Set row skip default.
		if (!skipRows) skipRows = 0;
	
		// Initialize objects to hold formatted data.
		let xml = '';
		
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
				xml += '<entry>';
			
				// Loop through columns.
				for (let j = 0; j < this.headers.length; j++) {
					xml += `<${this.headers[j]}>${values[j]}</${this.headers[j]}>`;
				}
				
				xml += '</entry>';
				this.lineCount++;
			} else {
				// Store overflow data for the next chunk.
				this.overflow = rows[i];
			}
		}
		
		return xml;
	}
	
	// Convert data to TSV format.
	toTSV(data) {
		return data.toString().replaceAll(',', '\t');
	}
}

module.exports = CsvConverter;
