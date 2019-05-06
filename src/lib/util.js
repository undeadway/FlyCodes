
exports.compireH5Video = (input, args) => {

	let result = `<iframe class="h5video" src="${input}"`;

	result += compireObjectToEqualString(args) + ' frameborder="no"></iframe>';

	return result;
};

exports.compireH5Audio = (input, args) => {
	return input;
}

exports.parseEqualToObject = (input, obj) => {
	for (let item of input) {
		let kv = item.split("=");
		obj[kv[0]] = kv[1];
	}
};

function compireObjectToEqualString(input) {

	let str = String.BLANK;

	for (let k in input) {
		let v = input[k];
		str += ` ${k}="${v}"`;
	}

	return str;
}

exports.compireObjectToEqualString = compireObjectToEqualString;

exports.AspectBase = (key) => {

	let array = [];

	return {
		replace: (input, part, str) => {

			input = input.replace(part, `{${key}~${array.length}}`);
			array.push(str);

			return input;
		},
		after: (input) => {
			Array.forEach(array, (i, e) => {
				input = input.replace(`{${key}~${i}}`, e);
			});

			return input;
		}
	}

};