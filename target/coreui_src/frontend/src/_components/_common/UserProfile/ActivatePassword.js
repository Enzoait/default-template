/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import { Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter ,
	Label,
	Form, Input,
	InputGroup, InputGroupAddon,
	InputGroupText
}
from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { accountService } from '_services/account.services';
import { toast } from 'react-toastify';

const propTypes = {
	accountId: PropTypes.string.isRequired,
};

const defaultProps = {
};

const mapStateToProps = store => ({
})

const mapDispatchToProps = (disptach) => ({

});
/**
 *
 */
class ActivatePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
	  modal: false,
	  accountId: props.accountId,
	  formData: {
		  newPassword: '',
		  newPasswordValidation: '',
	  },
	  formError: ''
    };

	this.doActivateAccount = this.doActivateAccount.bind(this);
	this.handleFormChange = this.handleFormChange.bind(this)
	this.updateSuccess = this.updateSuccess.bind(this)
  }

  handleFormChange(event) {
	let formadata = JSON.parse(JSON.stringify(this.state.formData))
	formadata[event.target.name] = event.target.value
	let emptypass = this.state.formData.newPassword === ''
		|| this.state.formData.newPasswordValidation === ''

	let samePass = this.state.formData.newPasswordValidation === this.state.formData.newPassword
	let formError = ''
	if(emptypass) {
		formError = 'Le mot de passe est obligatoire!'
	}
	else if(!samePass) {
		formError = 'Les mots de passe ne sont pas identiques!'
	}
	else {
		formError = '--'
	}

	this.setState({
		formData: formadata,
		formError: formError
	})
  }

  doActivatePassword(e) {
	e.preventDefault()
	accountService
	.activatePassword(this.state.accountId, this.state.formData, this.props.containerId)
	.then(response => {
		this.updateSuccess()
	})
	.catch(error => {
		this.toggle();
		console.error(error)
	});
  }

  updateSuccess(){
	  try {
		  this.toggle()
		  toast.info('Le mot de passe a été mis à jour.')
	  }
	  catch(error) {
		  console.error(error);
	  }
  }

  render() {
    return (
      <div>
        <Button className="activate-pass-modal" onClick={this.toggle}>Modifier mot de passe</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
			<ModalHeader toggle={this.toggle}>Modifier mot de passe</ModalHeader>
          	<ModalBody>

				<Label className="form-error">{this.state.formError}</Label>

				<Form>
					  <h1>Veuiller fournir un mot de passe pour activer votre compte</h1>
					  <InputGroup>
							<InputGroupAddon addonType="prepend">
								  <InputGroupText>
										<i className="icon-lock"></i>
								  </InputGroupText>
							</InputGroupAddon>
							<Input type="password" name="newPassword" placeholder="New password" autoComplete="new-password" onChange={(e) => this.handleFormChange(e)}/>
					  </InputGroup>
					  <InputGroup>
							<InputGroupAddon addonType="prepend">
									  <InputGroupText>
										<i className="icon-lock"></i>
									  </InputGroupText>
							</InputGroupAddon>
							<Input type="password" name="newPasswordValidation" placeholder="Repeat password" autoComplete="new-password" onChange={(e) => this.handleFormChange(e)}/>
					  </InputGroup>
				</Form>

	      </ModalBody>
          <ModalFooter>
            <Button onClick={(e) => this.doActivatePassword(e)}>Modifier</Button>{' '}
            <Button onClick={this.toggle}>Annuler</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

ActivatePassword.propTypes = propTypes;
ActivatePassword.defaultProps = defaultProps;

export default connect(mapStateToProps, mapDispatchToProps) (ActivatePassword);
