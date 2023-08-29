export default {
	check,
	lookup,
};

var elements;
var symbols = {};

await loadPeriodicTable();


// ****************************

async function loadPeriodicTable() {
	elements = await (await fetch("periodic-table.json")).json();
	for (let element of elements) {
		symbols[element.symbol.toLowerCase()] = element
	}
}

function findCandidate(inputWord){
	var oneLetterSymbols = [];
	var twoLetterSymbols = [];

	for (let i = 0; i < inputWord.length; i++) {
		// collect one-letter candidate
		// we can't use Set in here because order is matter !
		// we don't need to worry about O(n) for includes since we know that candidate is small dataset
		if (inputWord[i] in symbols && !oneLetterSymbols.includes(inputWord[i])) {
			oneLetterSymbols.push(inputWord[i])
		}

		if (i <= (inputWord.length -2)) {
			const two = inputWord.slice(i, i+2);

			if (two in symbols && !twoLetterSymbols.includes(two))
			twoLetterSymbols.push(two)
		}
	}

	return [...twoLetterSymbols, ...oneLetterSymbols]
}

function spellWord(candidate, charsLeft){
	if (charsLeft.length == 0) {
		return []
	} else {
		// check for two letter symbols first
		if (charsLeft.length >= 2) {
			let two = charsLeft.splice(0, 2);
			let rest = charsLeft.slice(2);

			// found a match
			if (candidate.includes(two)) {
				// more characters to match ?
				if (rest.length > 0) {
					let result = [ two, ...spellWord(candidate, rest)]
					if (result.join('') == rest) {
						return result
					}
				} else {
					return [ two ]
				}
			}
		}

		// check for one letter symbols
		if (charsLeft.length >= 1) {
			let one = charsLeft[0];
			let rest = charsLeft.slice(1);
			if (candidate.includes(one)) {
				if (rest.length > 0) {
					let result = [ one, ...spellWord(candidate, rest)]
					if (result.join('') == rest) {
						return result
					}
				} else {
					return [one]
				}
			}
		}
	}
}

function check(inputWord) {
	var candidate = findCandidate(inputWord);
	return spellWord(candidate, inputWord)
}

function lookup(elementSymbol) {
	return symbols[elementSymbol]
}
