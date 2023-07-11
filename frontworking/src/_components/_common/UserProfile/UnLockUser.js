/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { accountService } from '_services/account.services';
import { toast } from 'react-toastify';
import * as actions from '_actions/actions';
import { WizardConfirm } from '_components/_common';

const propTypes = {
	accountId: PropTypes.string.isRequired,
};

const defaultProps = {
};
const mapStateToProps = store => ({
})
const mapDispatchToProps = (disptach) => ({
	onAccountUnLocked: (payload) => disptach(actions.userAccountUnLocked(payload)),
});

/**
 * Unlock user
 */
class UnLockUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
	  modal: false,
	  accountId: props.accountId
    };

	this.toggle = this.toggle.bind(this);
	this.doUnlockUser = this.doUnlockUser.bind(this);
	this.unlockSuccess = this.unlockSuccess.bind(this)
  }
  /**
   * Toggle the modal
   */
  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }
  /**
   * Unlock user
   */
  doUnlockUser(){
	accountService
	.unlock(this.state.accountId, '', this.props.containerId)
	.then(response => {
		this.unlockSuccess()
	})
	.catch(error => {
		this.toggle();
		toast.error('Error occurs when locking user!')
		console.error(error)
	});
  }
  /**
   *
   */
  unlockSuccess(){
	  try {
		  this.toggle()
		  toast.success('Unlock success')

		  const payload = {'locked': false}
		  this.props.onAccountUnLocked(payload);

		  if(this.props.afterUpdate){
		  	this.props.afterUpdate(true);
		  }
	  }
	  catch(error) {
		  console.error(error);
	  }
  }
  /**
   * Render
   */
  render() {
    return (<div>
    	<WizardConfirm
    		buttonSize="sm"
    		buttonColor='secondary'
    		buttonTitle={"Débloquer utilisateur".toUpperCase()}
			onConfirm={() => this.doUnlockUser()}
			dialogMessage="Débloquer utilisateur?"
			dialogTitle={"Débloquer utilisateur".toUpperCase()}/>
      </div>
    );
  }
}

UnLockUser.propTypes = propTypes;
UnLockUser.defaultProps = defaultProps;

export default connect(mapStateToProps, mapDispatchToProps) (UnLockUser);
