import React from 'react';

class ApplicationVersion extends React.Component {

	render(){
		let buildVersion = process.env.REACT_APP_BUILD_VERSION;
    	return <span>Version: {buildVersion}</span>
	}
}

export default ApplicationVersion;