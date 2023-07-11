import React, { Component } from 'react';
import {Navbar} from 'react-bootstrap'

/**
 * Default footer
 */
class DefaultFooter extends Component {
	render() {
		let buildVersion = process.env.REACT_APP_BUILD_VERSION;
		if(!buildVersion){
			buildVersion = process.env.REACT_APP_VERSION
		}

		return (<>
				<Navbar fixed="bottom" className="app-footer default-footer">
					{/*<div><a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
						<img alt="Licence Creative Commons" style={{'border-width':0}}
							 src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" />
					</a></div>
					<Nav>
		            		<center className="d-flex flex-column mx-auto">
								<div className="mb-1"><a href="https://nexitia.com">&nbsp;&copy;</a>&nbsp;2021 All rights reserved</div>
			            		<a href="https://nexitia.com">Designed and developed by NEXITIA TECHNOLOGIES&nbsp;&copy;&nbsp;</a>
			            	</center>
		            	</Nav>
					<div className="default-footer-version"><span>Designed and Developed by NEXITIA TECHNOLOGIES</span></div>
					*/}
				</Navbar>

			</>
		);
	}
}

export default DefaultFooter;
