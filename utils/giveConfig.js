export const giveConfig = token => {
	return {
		headers: {
			Authorization: `Bearer ${token.access}`
		}
	};
};

export const giveConfigWithContentType = token => {
	return {
		headers: {
			Authorization: `Bearer ${token.access}`,
			'Content-Type': 'multipart/form-data'
		}
	};
};