'use strict'

module.exports = (logSources, printer) => {
	let helperList = [];
	let logSourcesDrained = 0;

	// Iterate through each logSource
	for (let i = 0; i < logSources.length; i++){
		let logSource = logSources[i];

		// For each logSource, loop through all last values until returns false
		const loop = index =>
		  logSource.popAsync().then(result => {

				// If promise returns a value, push it to helperList and loop again
		    if(result) {
					helperList.push(result);
					return loop(index + 1)

		    } else {
					logSourcesDrained++;
					helperList.sort(function(a, b){ return a.date - b.date }); // Sort
					// If the last log sources is drained, print and measure
					if (logSourcesDrained === logSources.length){
						printAndMeasureOutput(helperList);
					}
		    }
		  })

		loop(1); // Initiate first loop
	}

	// Print and measure efficiency of final result
	let printAndMeasureOutput = helperList => {
		for (let t = 0; t < helperList.length; t++){
			printer.print(helperList[t]);
		}
		printer.done();
	}
}
