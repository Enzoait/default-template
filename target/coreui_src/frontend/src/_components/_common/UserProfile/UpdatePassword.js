/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {
    Col,
    Form,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row
} from 'reactstrap';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {accountService} from '_services/account.services';
import * as actions from '_actions/actions';
import {toast} from 'react-toastify';
import {loginService} from '_services/login.services';
import {commons} from '_helpers/commons';
import Spinner from 'react-bootstrap/Spinner'
import {coreUri} from "_helpers/CoreUri";

const propTypes = {
    accountId: PropTypes.string.isRequired,
};

const defaultProps = {};

const mapStateToProps = store => ({})

const mapDispatchToProps = (disptach) => ({
    onUserAccountUpdatePass: (payload) => disptach(actions.userAccountUpdatePass(payload)),
});

class UpdatePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            modal: false,
            accountId: props.accountId,
            formData: {
                oldPassword: '',
                newPassword: '',
                newPasswordValidation: '',
            },

            processing: false,
            formError: '',
            canUpdate: false
        };

        this.toggle = this.toggle.bind(this);
        this.doUpdatePassword = this.doUpdatePassword.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this)
        this.updateSuccess = this.updateSuccess.bind(this)
        this.backHome = this.backHome.bind(this)
        this.userPostLogin = this.userPostLogin.bind(this)
    }

    backHome() {
        window.location.href = coreUri.clientSideRenderedURL('/');
    }

    handleFormChange(event) {
        let formadata = JSON.parse(JSON.stringify(this.state.formData))
        formadata[event.target.name] = event.target.value;

        let emptypass = formadata.newPassword === ''
            || formadata.newPasswordValidation === ''
            || formadata.newPassword === '';

        let samePass = JSON.stringify(formadata.newPasswordValidation) === JSON.stringify(formadata.newPassword)
        let canUpdate, formError = '';
        if (emptypass) {
            formError = 'Passwords can not be empty!';
            canUpdate = false;
        } else if (!samePass) {
            formError = 'Passwords are not same!';
            canUpdate = false;
        } else if (formadata.newPasswordValidation.length < 6) {
            formError = 'Too short';
            canUpdate = false;
        } else {
            formError = '';
            canUpdate = true;
        }

        this.setState({
            formData: formadata,
            formError: formError,
            canUpdate: canUpdate
        })
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    doResetPassword(e) {
        let token = this.props.match.params.lockToken;
        if (token) {

            this.setState({processing: true})
            accountService
                .updateLostPasswordByUser(token, this.state.formData, this.props.containerId)
                .then(response => {
                    if (response && response.status === 200) {
                        let json = response.json();
                        return json;
                    }
                    return null;
                })
                .then(response => {
                    if (response && response.data) {
                        if (response.data.attributes.updated === 'ok') {
                            let userEmail = response.data.attributes.userEmail;
                            this.updateSuccess2(userEmail);
                        } else {
                            this.updateError();
                        }
                    } else {
                        this.updateError();
                    }
                })
                .catch(error => {
                    toast.error('Error when updating password!')
                    console.error(error)
                });
        }
    }

    async updateSuccess2(userEmail) {
        if (!userEmail) {
            return
        }

        try {
            let formData = {};
            formData.login = userEmail;
            formData.password = this.state.formData.newPassword;

            let response = await loginService
                .login(formData)
                .then(response => {
                    return response;
                })

            if (!response) {
                this.updateError();
                return;
            }

            let authorization = await response.text();
            if (!authorization) {
                this.updateError();
            } else {
                commons.setSessionId(authorization);
                this.userPostLogin(authorization);
            }
        } catch (error) {
            alert(error);
        }
    }

    userPostLogin(authorization) {
        if (authorization) {
            loginService.postLogin(authorization)
                .then(json => {
                    return json;
                })
                .then(json => {
                    commons.katappult_core_loginSuccess(json);

                    let account = JSON.parse(json.data.links.account)
                    let active = account.active;
                    if (active) {
                        this.props.history.push('/home')
                    } else {
                        let login = account.nickName;
                        window.location.href = coreUri.clientSideRenderedURL('/activateAccount');
                    }
                });
        }
    }

    doUpdatePassword(e) {
        accountService
            .updatePassword(this.state.accountId, this.state.formData, this.props.containerId)
            .then(response => {
                if (response.status === 200) {
                    this.updateSuccess();
                } else {
                    this.updateError();
                }
            })
            .catch(error => {
                this.toggle();
                toast.error('Error when updating password!')
                console.error(error)
            });
    }

    updateSuccess() {
        try {
            this.toggle()
            toast.success('Password update success.')
        } catch (error) {
            console.error(error);
        }
    }

    updateError() {
        this.setState({
            formError: 'Incorrect or invalid passwords',
            processing: false
        })
    }

    reinitLostPass() {
        return <Form>
            <Row>
                <Col md="12" lg="12" xl="12">
                    <Label className="form-error">{this.state.formError}</Label>
                </Col>
            </Row>
            <InputGroup className="mb-3">
                <InputGroupAddon addonType="prepend">
                </InputGroupAddon>
                <Input type="password" name="newPassword" placeholder="New password" autoComplete="new-password"
                       onChange={(e) => this.handleFormChange(e)}/>
            </InputGroup>
            <InputGroup className="mb-4">
                <InputGroupAddon addonType="prepend">
                </InputGroupAddon>
                <Input type="password" name="newPasswordValidation" placeholder="Repeat password"
                       autoComplete="new-password" onChange={(e) => this.handleFormChange(e)}/>
            </InputGroup>
            <div className={'btn-toolbar'}>
                {!this.state.processing && <button disabled={!this.state.canUpdate} block
                                                   color="secondary"
                                                   onClick={(e) => this.doResetPassword(e)}>
                    Changer mot de passe
                </button>
                }

                {this.state.processing &&
                <Spinner animation="border" variant="primary"/>
                }

            </div>
        </Form>
    }

    formContent() {
        return <Form>
            <InputGroup className="mb-3">
                <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                        <i className="icon-lock"></i>
                    </InputGroupText>
                </InputGroupAddon>
                <Input type="password" name="oldPassword" placeholder="Old password" autoComplete="new-password"
                       onChange={(e) => this.handleFormChange(e)}/>
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                        <i className="icon-lock"></i>
                    </InputGroupText>
                </InputGroupAddon>
                <Input type="password" name="newPassword" placeholder="New password" autoComplete="new-password"
                       onChange={(e) => this.handleFormChange(e)}/>
            </InputGroup>
            <InputGroup className="mb-4">
                <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                        <i className="icon-lock"></i>
                    </InputGroupText>
                </InputGroupAddon>
                <Input type="password" name="newPasswordValidation" placeholder="Repeat password"
                       autoComplete="new-password" onChange={(e) => this.handleFormChange(e)}/>
            </InputGroup>
        </Form>
    }

    modalUpdatePassWord() {

        return <div>
            <button className="ml-1 mr-1" onClick={this.toggle} size="sm">CHANGER MOT DE PASSE</button>
            <Modal isOpen={this.state.modal} toggle={this.toggle} centered>
                <ModalHeader toggle={this.toggle}>Changer mot de passe</ModalHeader>

                <ModalBody>
                    <Label className="form-error">{this.state.formError}</Label>
                    <div className="">
                        {this.formContent()}
                    </div>
                </ModalBody>

                <ModalFooter>
                    <button color="primary" onClick={(e) => this.doUpdatePassword(e)}>Mettre à jour</button>{' '}
                    <button color="secondary" onClick={this.toggle}>Annuler</button>
                </ModalFooter>
            </Modal>
        </div>
    }

    render() {
        if (this.props.reinitLostPass === true) {
            return <div className={'reinit-password-page'}>
                {this.reinitLostPass()}
            </div>
        }

        return this.modalUpdatePassWord();
    }
}

UpdatePassword.propTypes = propTypes;
UpdatePassword.defaultProps = defaultProps;

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePassword);
