import React, { createContext, useState, useContext } from 'react';

const MeetupUpdateContext = createContext({
	triggerRefetch: () => {},
	shouldRefetch: false
});

export const MeetupUpdateProvider: React.FC<{ children: React.ReactNode }> = ({
	children
}) => {
	const [shouldRefetch, setShouldRefetch] = useState(false);

	const triggerRefetch = () => {
		setShouldRefetch(prev => !prev); // меняется значение → useEffect отработает
	};

	return (
		<MeetupUpdateContext.Provider value={{ shouldRefetch, triggerRefetch }}>
			{children}
		</MeetupUpdateContext.Provider>
	);
};

export const useMeetupUpdate = () => useContext(MeetupUpdateContext);
