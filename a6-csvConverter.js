/**
 * a6-CsvConverter.js
 * @author @MatthewEckart
 * @file A script that converts a CSV file into JSON format.
 */

/**
 * @class CsvConverter
 * @summary Contains methods for converting CSV files to other data outputs.
 */
class CsvConverter {
	/**
	 * @constructs CsvConverter
	 * @param {array} headers - an array of header values to use for this CsvConverter.
	 */
	constructor(headers) {
		if (!this.headers) this.headers = headers;
		this.lineCount = 0;
		this.overflow = null;
	}
	
	/** 
	 * @summary Sets the headers for this CsvConverter.
	 * @param {array} headers - an array of header values.
	 */
	setHeaders(headers) {
		this.headers = headers;
	}
	
	/** @returns {array} headers */
	getHeaders() {
		return this.headers;
	}
	
	/** @returns {number} number of lines processed */
	getLineCount() {
		return this.lineCount;
	}
	
	/**
	 * @summary Takes CSV data and converts it to JSON.
	 * @param {buffer} data - the CSV data to process.
	 * @param {number} skipRows - the number of rows to skip from the beginning of the data. 0 if null.
	 * @returns {string} a string of JSON data.
	 */
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
	
	/**
	 * @summary Takes CSV data and converts it to XML. Data should be enclosed by <document> tags externally.
	 * @param {buffer} data - the CSV data to process.
	 * @param {number} skipRows - the number of rows to skip from the beginning of the data. 0 if null.
	 * @returns {string} A string of XML data.
	 */
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
	
	/**
	 * @summary Takes CSV data and converts it to TSV. Does not update lineCount.
	 * @param {buffer} data - the CSV data to process.
	 * @returns {string} A string of TSV data.
	 */
	toTSV(data) {
		return data.toString().replaceAll(',', '\t');
	}
}

module.exports = CsvConverter;
