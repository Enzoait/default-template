import React from 'react';
import {AddPeople} from '_components/_common';
import LoginFooter from "pages/CommonPages/LoginPage/LoginFooter";

class PeopleRegisterPage extends React.Component {
	
	render() {
		return (<div id={'loginpage'} className={'login-page_root'}>
			<div className="loginpage-root">
				<h2 className="main-title">Créer un compte</h2>
				<div className="new-filter">
					<div className="people-register-form">
						<AddPeople {...this.props} setProcessing={this.setLoading}/>
					</div>
				</div>
			</div>

			<LoginFooter />
		</div>)
	}
}
					
export default PeopleRegisterPage;

