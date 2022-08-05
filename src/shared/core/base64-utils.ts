// export const getBase64ImageFromUrl = async (imageUrl) : Promise<string | ArrayBuffer> => {
//     var res = await fetch(imageUrl);
//     var blob = await res.blob();

//     return new Promise((resolve, reject) => {
//         var reader  = new FileReader();
//         reader.addEventListener('load', function () {
//                 resolve(reader.result);
//         }, false);

//         reader.onerror = () => {
//             return reject(this);
//         };
//         reader.readAsDataURL(blob);
//     })
// }

/**
 * Inspired by
 * https://stackoverflow.com/questions/15327959/get-height-and-width-dimensions-from-base64-png/15327984
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toInt32 = (bytes : any) : number => {
	return (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getDimensions = (data : any) : { width : number, height : number } => {
	return {
		width: toInt32(data.slice(16, 20)),
		height: toInt32(data.slice(20, 24)),
	};
};

const base64Characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

// eslint-disable-next-line func-style, @typescript-eslint/no-explicit-any, jsdoc/require-jsdoc
function base64Decode(data : string) : any[] {
	const result = [];
	let current = 0;

	/* eslint-disable-next-line no-var, no-cond-assign */
	for (var i = 0, c; c = data.charAt(i); i++) {
		if (c === '=') {
			if (i !== data.length - 1 && (i !== data.length - 2 || data.charAt(i + 1) !== '=')) {
				throw new SyntaxError('Unexpected padding character.');
			}

			break;
		}

		const index = base64Characters.indexOf(c);

		if (index === -1) {
			throw new SyntaxError('Invalid Base64 character.');
		}

		current = (current << 6) | index;

		if (i % 4 === 3) {
			result.push(current >> 16, (current & 0xFF00) >> 8, current & 0xFF);
			current = 0;
		}
	}

	if (i % 4 === 1) {
		throw new SyntaxError('Invalid length for a Base64 string.');
	}

	if (i % 4 === 2) {
		result.push(current >> 4);
	} else if (i % 4 === 3) {
		current <<= 6;
		result.push(current >> 16, (current & 0xFF00) >> 8);
	}

	return result;
}

const supportedBase46Prefixes : RegExp = /(data:image\/(png|jpeg);base64,)(.*)/;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getFileFormat = (dataUri : string) : 'png' | 'jpeg' => {
	const regexReturnArray = dataUri.match(supportedBase46Prefixes);
	if (regexReturnArray === null) throw new Error('No match');
	if (regexReturnArray.length !== 4) throw new Error('Unsupported data URI format');
	if (regexReturnArray[2] !== 'png' && regexReturnArray[2] !== 'jpeg') throw new Error('Unsupported data URI format');
	return regexReturnArray[2];
};
const base64PrefixLength = (dataUri : string) : number => {
	const regexReturnArray = dataUri.match(supportedBase46Prefixes);
	if (regexReturnArray === null) throw new Error('No match');
	if (regexReturnArray.length !== 4) throw new Error('Unsupported data URI format');
	return regexReturnArray[1].length;
};
const base64WithoutPrefix = (dataUri : string) : string => {
	const regexReturnArray = dataUri.match(supportedBase46Prefixes);
	if (regexReturnArray === null) throw new Error('No match');
	if (regexReturnArray.length !== 4) throw new Error('Unsupported data URI format');
	return regexReturnArray[3];
};


export const getBase64Dimensions = (dataUri : string) : { width : number, height : number } => {
	const base64Content = base64WithoutPrefix(dataUri);

	// 32 base64 characters encode the necessary 24 bytes
	return getDimensions(base64Decode(base64Content.substr(0, 32)));

};

export const getBase64DimensionsAsync = (dataUri : string) : Promise<{ width : number, height : number }> => {
	// const base64Content = base64WithoutPrefix(dataUri);

	return getImageDimensions(dataUri);
};

export const getPngFileSize = (dataUri : string) : number => {
	const stringLength = dataUri.length - base64PrefixLength(dataUri);
	const sizeInBytes = 4 * Math.ceil((stringLength / 3)) * 0.5624896334383812;
	return sizeInBytes / 1000;
};


const getImageDimensions = (dataUri : string) : Promise<{
	width : number,
	height : number,
}> => {
	return new Promise((resolve, _reject) => {
		const i = new Image();
		// eslint-disable-next-line unicorn/prefer-add-event-listener
		i.onload = () => {
			resolve({width: i.width, height: i.height});
		};
		i.src = dataUri;
	});
};
