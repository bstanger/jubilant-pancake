'use strict'


////////////////////////////////////////////////////////////////////////////////
// BINARY SORT
////////////////////////////////////////////////////////////////////////////////

module.exports = (logSources, printer) => {
	let sortingHelperList = [];

	// Create "sortingHelperList" of lowest of logSources
	for (let i = 0; i < logSources.length; i++){
		logSources[i].last["logSourceIndex"] = i; // add index to "last" object
		sortingHelperList.push(logSources[i].last); // push "last" object to sortingHelperList
	}

	// Sort "sortingHelperList"
	sortingHelperList.sort(function(a, b){ return a.date - b.date });

	let currentLogSourceIndex;
	let currentLogSource;
	let newLog;
	let lowestOfSortingHelper;

	while(sortingHelperList.length){
		lowestOfSortingHelper = sortingHelperList[0];
		currentLogSourceIndex = lowestOfSortingHelper.logSourceIndex; // Store index of lowest
		printer.print(lowestOfSortingHelper); // Print lowest
		sortingHelperList.splice(0,1); // Delete lowest

		currentLogSource = logSources[currentLogSourceIndex]; // Focus on log source with same index as lowest value

		if(currentLogSource.pop()){

			// Create new object of "last" and add index
			newLog = currentLogSource.last;
			newLog["logSourceIndex"] = currentLogSourceIndex;

			/* Function that returns index of where to insert "newLog" in "sortingHelperList"
			using a binary search */
			let binarySearch = newLog => {
				let minIndex = 0;
				let maxIndex = sortingHelperList.length - 1;
				let comparisonIndex;
				let comparisonValue;

				while(minIndex <= maxIndex){
					comparisonIndex = (minIndex + maxIndex) / 2 | 0;
					comparisonValue = sortingHelperList[comparisonIndex];

					if(comparisonValue.date < newLog.date){
						minIndex = comparisonIndex + 1;
					} else if (comparisonValue.date > newLog.date){
						maxIndex = comparisonIndex - 1;
					}
				}

				return minIndex;
			}

			// Insert "newLog" in correct location in "sortingHelperList"
			sortingHelperList.splice(binarySearch(newLog), 0, newLog);
		}
	}

	// Measure efficiency
	printer.done();
}



////////////////////////////////////////////////////////////////////////////////
// MERGE SORT BY ROW
////////////////////////////////////////////////////////////////////////////////
/*
module.exports = (logSources, printer) => {
	let helperList = [];
	let drainedCt = 0;

	// While some logSources aren't drained
	while(drainedCt < logSources.length) {

		// Iterate through first item in each logSource
		for (let i = 0; i < logSources.length; i++){
			let logSource = logSources[i];

			// Add the item to the helperList, unless pop() returns false
			if(logSource.pop()){
				helperList.push(logSource.last);
				logSource.pop();
			} else {
				drainedCt++;
			}
		}

		//Sort entire list
		helperList.sort(function(a, b){ return a.date - b.date });
	}

	// After helperList created, iterate through and print
	for (let t = 0; t < helperList.length; t++){
		printer.print(helperList[t]);
	}

	// Measure efficiency
	printer.done()
}
*/


////////////////////////////////////////////////////////////////////////////////
// MERGE SORT BY COLUMN
////////////////////////////////////////////////////////////////////////////////

/*
module.exports = (logSources, printer) => {
	let helperList = [];

	// Iterate through each logSource
	for (let i = 0; i < logSources.length; i++){
		let logSource = logSources[i];

		// Add each log in logSource to helperList
		while(true){
			helperList.push(logSource.last);
			logSource.pop();

			// Once logSource.pop returns false, stop adding from current logSource
			if(!logSource.pop()){
				break;
			}
		}

		// Sort entire list
		helperList.sort(function(a, b){ return a.date - b.date });
	}

	// After helperList created, iterate through and print
	for (let t = 0; t < helperList.length; t++){
		printer.print(helperList[t]);
	}

	// Measure efficiency
	printer.done()
}
*/

////////////////////////////////////////////////////////////////////////////////
// BUBBLE SORT BY ROW, THEN TARGETED LOGSOURCE
////////////////////////////////////////////////////////////////////////////////

/*
module.exports = (logSources, printer) => {
	let helperList = [];

	// Iterate through first item in each logSource
	for (let i = 0; i < logSources.length; i++){
		let logSource = logSources[i];

		// Add the item to the helperList, unless pop() returns false
		if(logSource.pop()){
			logSource.last["logSourceIndex"] = i;
			helperList.push(logSource.last);
			logSource.pop();
		}
	}
	//Sort initial list
	helperList.sort(function(a, b){ return a.date - b.date });

	// Use first items to determine order of which logSources to iterate through first
	let indexOrderForLogSources = [];
	for (let r = 0; r < helperList.length; r++){
		indexOrderForLogSources.push(helperList[r].logSourceIndex);
		delete helperList[r].logSourceIndex;
	}

	// Using order of logSources from above, iterate through each logSource, append, and sort
	let currentIndex;
	for (let s = 0; s < indexOrderForLogSources.length; s++){
		currentIndex = indexOrderForLogSources[s];

		//Add each log in logSource to helperList
		while(true){
			helperList.push(logSources[currentIndex].last);
			logSources[currentIndex].pop();

			// Once logSource.pop returns false, stop adding from current logSource
			if(!logSources[currentIndex].pop()){
				break;
			}
		}

		// Sort after logSource entirely added
		helperList.sort(function(a, b){ return a.date - b.date });
	}

	// Print entire merged sort
	for (let t = 0; t < helperList.length; t++){
		printer.print(helperList[t]);
	}

	//Measure efficiency
	printer.done();
}
*/


// ////////////////////////////////////////////////////////////////////////////////
// // MERGE SORT BY ROW BUT TRACKING DRAINED SOURCES
// ////////////////////////////////////////////////////////////////////////////////
//

/*
module.exports = (logSources, printer) => {
	let helperList = [];

	let indexesOfRemainingLogSources = [];
	for (let t = 0; t < logSources.length; t++){
		indexesOfRemainingLogSources.push(t);
	}

	// While some logSources aren't drained
	while(indexesOfRemainingLogSources.length) {
		let drainedLogSources = [];
		let currentSource;

		// Iterate through first item in each logSource
		for (let i = 0; i < indexesOfRemainingLogSources.length; i++){
			currentSource = logSources[indexesOfRemainingLogSources[i]];

			// Add the item to the helperList, unless pop() returns false
			if(currentSource.pop()){
				helperList.push(currentSource.last);
				currentSource.pop();
			} else {
				drainedLogSources.push(indexesOfRemainingLogSources[i]);
				continue;
			}
		}

		// Remove drainedLogSources from sources left to check
		let indexDrainedSourceInMaster;
		for (let f = 0; f < drainedLogSources.length; f++){
			indexDrainedSourceInMaster = indexesOfRemainingLogSources.indexOf(drainedLogSources[f]);
			indexesOfRemainingLogSources.splice(indexDrainedSourceInMaster, 1);
		}

		//Sort entire list after row added
		helperList.sort(function(a, b){ return a.date - b.date });
	}

	// After helperList created, iterate through and print
	for (let t = 0; t < helperList.length; t++){
		printer.print(helperList[t]);
	}

	// Measure efficiency
	printer.done()
}
*/
