import React from 'react';
import {Form, Input} from 'reactstrap';
import {accountService} from '_services/account.services.js';
import LostPassSuccess from './LostPassSuccess.js'
import ApplicationCopyright from '_components/_common/ApplicationVersion/ApplicationCopyright.js';
import './LostPass.css'
import {coreUri} from "_helpers/CoreUri";

/**
 * LostPass component
 */
class LostPass extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            formValid: false,
            emailValid: false,
            displaySuccessSend: false,
            formData: {},
            formErrors: {'email': ''}
        };

        this.doSendUpdatePasswordLink = this.doSendUpdatePasswordLink.bind(this);
        this.validateField = this.validateField.bind(this)
        this.backToLogin = this.backToLogin.bind(this)
        this.handleUserInput = this.handleUserInput.bind(this)
        this.validateForm = this.validateForm.bind(this)
    }

    handleUserInput(e) {
        const name = e.target.name;
        const value = e.target.value;
        let formdata = this.state.formData;
        formdata[name] = value
        this.setState({formData: formdata},
            () => {
                this.validateField(name, value)
            });
    }

    /**
     * Handle form change
     */
    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);

        fieldValidationErrors.email = emailValid ? '' : ' is invalid';
        this.setState({
            formErrors: fieldValidationErrors,
            emailValid: emailValid,
        }, this.validateForm);
    }

    /**
     * Update the state form valid
     */
    validateForm() {
        this.setState({
            formValid: this.state.emailValid
        });
    }

    /**
     * Send an email whatever the provided email.
     * Do not tell hacker that an account does not exists in database.
     */
    doSendUpdatePasswordLink(e) {
        let email = this.state.formData.email
        accountService.lostPassword(email);
        this.setState({
            displaySuccessSend: true
        })
    }

    /**
     * Go back to login page
     */
    backToLogin() {
        const loginUrl = coreUri.clientSideRenderedURL('/login');
        window.location.href = coreUri.clientSideRenderedURL('/login');
    }

    /**
     * Render the view
     */
    render() {
        let content, buildVersion = process.env.REACT_APP_BUILD_VERSION,
            buildDate = process.env.REACT_APP_BUILD_DATETIME;

        if (this.state.displaySuccessSend) {
            let email = this.state.formData.email
            content = <LostPassSuccess email={email}/>
        } else {
            content = <>
                <Form>
                    <div>{this.state.formError}</div>
                    <Input type="text" required="true"
                           name="email" placeholder="Votre email"
                           autoComplete="login"
                           onChange={(e) => this.handleUserInput(e)}/>
                </Form>
                <div className={'btn-toolbar'} style={{marginTop: '2rem'}}>
                    <button type="submit" disabled={!this.state.formValid}
                            onClick={(e) => this.doSendUpdatePasswordLink(e)}>ENVOYER</button>
                    <button onClick={(e) => this.backToLogin(e)}>ANNULER</button>
                </div>
            </>
        }

        return <div id={'loginpage'} className={'login-page_root'}>
            <div className="loginpage-root">
                <h2 className="main-title">Mot de passe oublié</h2>
                <div className="new-filter">
                    {content}
                </div>
            </div>
            <div className={'footer-app-version'}>
                <ApplicationCopyright/>
            </div>
        </div>;
    }
}

export default LostPass;

