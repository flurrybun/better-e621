//convert number to string with 3 significant digits and suffix
export const numberToAbbreviatedString = (number) => {
	if (number == null) return;
	if (Math.abs(number) < 100) return number.toString();

	const suffixes = ['', 'k', 'M', 'B', 'T'];
	let suffixIndex = 0;

	while (Math.abs(number) >= 1000) {
		number /= 1000;
		suffixIndex++;
	}

	return number.toPrecision(3) + suffixes[suffixIndex];
};
