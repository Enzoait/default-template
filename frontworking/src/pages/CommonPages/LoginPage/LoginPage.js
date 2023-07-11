import React, { Component } from 'react';
import { connect } from 'react-redux';
import Form from "react-jsonschema-form";
import { loginService } from '_services/login.services';
import { commons } from '_helpers/commons';
import ApplicationCopyright  from '_components/_common/ApplicationVersion/ApplicationCopyright.js';
import {coreUri} from "_helpers/CoreUri";
import logo from 'assets/logo.png';

/**
 * Format is 'store.reducer.state'
 */
const mapStateToProps = store => ({
	userContextRX: store.userContext,

});

const mapDispatchToProps = (disptach) => ({

});

const LOGIN_JSON_UISCHEMA = {
	"login": {
		"ui:autofocus": "true",
		"ui:emptyValue": "",
		"ui:help": "Email or nickname",
		"ui:placeholder": "me@me.com"
	},
	"password": {
		"ui:widget": "password",
		"ui:emptyValue": ""
	}
}

const LOGIN_JSON_SCHEMA = {
	"required": ["login", "password"],
	"type": "object",
	"properties": {
		"login": {
			"type": "string",
			"title": "Login"
		},
		"password": {
			"type": "string",
			"title": "Password",
			"minLength": 3
		}
	}
}

class LoginPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			submitted: false,
			loading: false,
			error: '',
			uischema: LOGIN_JSON_UISCHEMA,
			jsonschema: LOGIN_JSON_SCHEMA
		}

		this.handleResponseError = this.handleResponseError.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.lostPass = this.lostPass.bind(this);
	}

	async onSubmit(form, e){
		this.setState({processing: true})

		if(e) e.preventDefault();
		let jsonstring = JSON.stringify(form);
		let jsonobject = JSON.parse(jsonstring);
		let formData = jsonobject.formData;

		let response = await loginService.login(formData);
		if(response && response.status === 200) {
			let authorization = await response.text();
			commons.setSessionId(authorization);
			window.location.href = coreUri.backOfficeHomeURL();
		}
		else {
			this.setState({
				processing: false,
				error: 'Login ou mot de passe invalide'
			})
		}
	}

	handleResponseError(json){
		this.setState({
			processing: false,
			error: 'Login error: Bad credentials.'
		})
	}

	componentDidMount(){
		commons.katappult_core_logout();
	}

	lostPass(e){
		if(e) e.preventDefault();
		this.props.history.push('/lostPass');
	}

	render () {
		if(this.state.formRegister === true){
			return <center>Loading...</center>
		}

		let message;
		return <div id={'loginpage'} className={'login-page_root'}>
			<div className="loginpage-root">

				<img src={logo} width="120" className="d-inline-block align-top" alt="katappult"/>

				<div className="new-filter">
					<center>
						<p className="form-error">{this.state.error}</p>
						<p style={{color: 'red','font-size':'0.9rem','font-weight':'bold'}}>{message}</p>
					</center>

					{!this.state.loading && <>
							<Form schema={this.state.jsonschema}
								  uiSchema={this.state.uischema}
								  onSubmit={this.onSubmit}
								  formData={formData}
								  onError={onerror} >

								<button className="login-button" type="submit">Login&nbsp;<i class="fa fa-lock"></i></button>
							</Form>
						</>
					}

					{ this.state.loading && <div>
						<i class="fa fa-spinner"></i>
					</div>
					}
				</div>
			</div>

			<div className={'footer-app-version login-page-footer'}>
				<div style={{display: 'flex', flexDirection: 'column'}}>
					<ApplicationCopyright />
				</div>
			</div>
		</div>
	}
}

const formData = {login: "", password: ""};
const onerror = ({formData}, e) => {
	console.debug(e);
}


export default connect(mapStateToProps, mapDispatchToProps) (LoginPage);
