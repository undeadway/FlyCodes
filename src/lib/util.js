
exports.compireH5Video = (input, args) => {

	return compireH5Object(input, args, 'iframe', 'h5video');
};

exports.compireH5Audio = (input, args) => {
	return input;
}

function compireH5Object(input, args, tag, className) {

	let result = compireObjectToXmlAtruibute(args);

	return `<${tag} class="${className}" src="${input}" ${result}></${tag}>`;
}

exports.parseEqualToObject = (input, obj) => {
	for (let item of input) {
		let kv = item.split("=");
		obj[kv[0]] = kv[1];
	}
};

function compireObjectToXmlAtruibute(input) {

	let str = String.BLANK;

	for (let k in input) {
		let v = input[k];
		str += ` ${k}="${v}"`;
	}

	return str;
}

exports.compireObjectToXmlAtruibute = compireObjectToXmlAtruibute;

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