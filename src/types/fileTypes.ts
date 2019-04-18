export const fileMimeMap: any = {
	csv: 'text/csv',
	doc: 'application/msword',
	docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	jpeg: 'image/jpeg',
	jpg: 'image/jpeg',
	png: 'image/png',
	pdf: 'application/pdf',
	ppt: 'application/vnd.ms-powerpoint',
	pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	rtf: 'application/rtf',
	txt: 'text/plain',
	xls: 'application/vnd.ms-excel',
	xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
};

export const validMimeTypes = [
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'image/jpeg',
	'image/png',
	'application/pdf',
	'application/vnd.ms-powerpoint',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	'application/rtf',
	'text/plain',
	'application/vnd.ms-excel',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

//text signature is blank
export const validFileHeaders = [
	'd0cf11e0', //xls
	'd0cf11e0', //doc
	'd0cf11e0', //ppt
	'7b5c7274', //rt
	'504b0304', //xlsx
	'504b0304', //docx
	'504b0304', //pptx
	'ffd8', //jpeg
	'ffd8ffe0', //jpeg
	'ffd8ffe1', //jpeg
	'ffd8ffe2', //jpeg
	'ffd8ffe3', //jpeg
	'ffd8ffe8', //jpeg
	'89504e47', //png
	'25504446', //pdf,
	'636f6e74', //csv
	'64617461' // text
];

export const validImageHeaders = [
	'ffd8ffe0', //jpeg
	'ffd8ffe1', //jpeg
	'ffd8ffe2', //jpeg
	'ffd8ffe3', //jpeg
	'ffd8ffe8', //jpeg
	'89504e47' //png
];

export const checkIfValidFileType = (fileType: string): boolean => {
	let exists: boolean = false;
	Object.keys(fileMimeMap).forEach((key: string, index: number) => {
		if (fileType === key) {
			exists = true;
		}
	});
	return exists;
};

export const checkIfValidImage = (header: string, fileType: string): boolean => {
	switch (header) {
		case 'ffd8':
		case 'ffd8ffe0':
		case 'ffd8ffe1':
		case 'ffd8ffe2':
		case 'ffd8ffe3':
		case 'ffd8ffe8':
			if (fileType === 'image/jpeg') {
				return true;
			} else return false;
		case '89504e47':
			if (fileType === 'image/png') {
				return true;
			} else return false;
		default:
			return false;
	}
};

export const getMimeType = (fileType: string): string => {
	return fileMimeMap[fileType];
};

export const mimeTypeErrMsg =
	'DeReader accepts jpeg, jpg, png, pdf, csv, doc, docx, ppt, pptx, rtf, txt, xls and xlsx files.';

export const maxSizeMsg = 'The max file size allowed is 20MB';

export const getFileType = (fileName: string): string => {
	const regex = /(?:\.([^.]+))?$/;
	const splitStrings: any = regex.exec(fileName);
	const fileType: string = splitStrings[1];

	return fileType.toLowerCase();
};

export const formatBytes = (bytes: number, decimals: number) => {
	if (bytes == 0) return '0 Bytes';
	var k = 1024,
		dm = decimals <= 0 ? 0 : decimals || 2,
		sizes = [ 'Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ],
		i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export function getBase64(img: any, callback: any) {
	const reader = new FileReader();
	reader.addEventListener('load', () => callback(reader.result));
	reader.readAsDataURL(img);
}

export function checkFileSize(size: number, maxSizeMB: number) {
	return size / 1024 / 1024 < maxSizeMB;
}

export const dummyRequest = ({ file, onSuccess }: { file: any; onSuccess: any }) => {
	setTimeout(() => {
		onSuccess('ok');
	}, 0);
};
