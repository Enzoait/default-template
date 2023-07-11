import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { accountService } from '_services/account.services';
import { toast } from 'react-toastify';
import * as actions from '_actions/actions';
import { WizardConfirm } from '_components/_common';

const propTypes = {
	accountId: PropTypes.string.isRequired,
}

const defaultProps = {
}

const mapStateToProps = store => ({
})

const mapDispatchToProps = (disptach) => ({
	onAccountLocked: (payload) => disptach(actions.userAccountLocked(payload)),
});

/**
 * Lock user component
 */
class LockUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
	  modal: false,
	  accountId: props.accountId
    };

	this.toggle = this.toggle.bind(this)
	this.doLockUser = this.doLockUser.bind(this)
	this.lockSuccess = this.lockSuccess.bind(this)
  }
  /**
   * Toogle the modal
   */
  toggle() {
    	this.setState(prevState => ({
      		modal: !prevState.modal
		})
	)
  }
  /**
   * Lock the user
   */
  doLockUser(){
	accountService
	.lock(this.state.accountId, this.props.containerId)
	.then(response => {
		this.lockSuccess()
	})
	.catch(error => {
		this.toggle();
		toast.error('Error occurs when locking user!')
		console.error(error)
	});
  }

  lockSuccess(){
	  try {
		  this.toggle()
		  toast.success('Lock success')
		  const payload = {'locked': true}

		  this.props.onAccountLocked(payload);
		  if(this.props.afterUpdate){
		  	this.props.afterUpdate(true);
		  }
	  }
	  catch(error) {console.error(error);}
  }

  render() {
    return (
    	<WizardConfirm
    		buttonColor='secondary'
    		buttonTitle={"Bloquer utilisateur".toUpperCase()}
			onConfirm={() => this.doLockUser()}
			dialogMessage="Les utilisateurs blockés ne peuvent pas se connecter au système."
			dialogTitle={"Bloquer utilisateur".toUpperCase()}/>
    );
  }
}

LockUser.propTypes = propTypes;
LockUser.defaultProps = defaultProps;

export default connect(mapStateToProps, mapDispatchToProps) (LockUser);
