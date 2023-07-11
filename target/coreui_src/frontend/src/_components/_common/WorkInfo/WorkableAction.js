import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { workableService } from '_services/workable.services';
import { WizardConfirm } from '_components/_common';
import Button from 'react-bootstrap/Button'
import {commons} from "_helpers/commons";
import {toast} from "react-toastify";

const propTypes = {
	workInfo: PropTypes.object,
	workableId: PropTypes.string,
	canCheckin: PropTypes.bool,
	canCheckout: PropTypes.bool,
	canUndoCheckout: PropTypes.bool,
	toWcCallBack: PropTypes.func,
}
const defaultProps = {
	canCheckin: false,
	canCheckout: false,
	canUndoCheckout: false,
	toWcCallBack: null
}
/**
 * Actions for workable
 */
class WorkableAction extends Component {

	constructor(props){
		super(props)
		this.state = {
		}

		this.checkin = this.checkin.bind(this)
		this.checkout = this.checkout.bind(this)
		this.undoCheckout = this.undoCheckout.bind(this)
		this.toWorkingCopy = this.toWorkingCopy.bind(this)
		this.toOriginalCopy = this.toOriginalCopy.bind(this)
	}

	componentDidUpdate(prevProps){
		if(prevProps.workableId !== this.props.workableId){
			this.setState({
				wc: this.props.workInfo.isWorkingCopy,
				locked: this.props.workInfo.lockedBy !== '' && !this.props.workInfo.isWorkingCopy,
				workableId: this.props.workableId
			})
		}
	}

	async toOriginalCopy(e){
		if(e) e.preventDefault()
		if(this.props.setLoading) this.props.setLoading();
		const idOnly = this.props.idOnly ? this.props.idOnly : false;
		workableService.originalCopy(this.props.workableId, idOnly, this.props.containerId).then(response => {
			if(commons.isRequestError(response)){
				toast.error(commons.toastError(response))
			}
			else {
				this.props.loadDatas(response.data.attributes.id, false);
			}
		})
	}
	/**
	 * toWorkingCopy
	 */
	async toWorkingCopy(e, id){
		if(e)e.preventDefault();
		if(this.props.setLoading) this.props.setLoading();
		const idOnly = this.props.idOnly ? this.props.idOnly : false;
		workableService.workingCopy(id ? id : this.props.workableId, idOnly, this.props.containerId).then(response => {
			if(commons.isRequestError(response)){
				toast.error(commons.toastError(response))
			}
			else {
				this.props.loadDatas(response.data.attributes.id, false);
			}
		})
	}
	/**
	 * Checkin
	 */
	async checkin(e){
		if(e)e.preventDefault();
		if(this.props.setLoading) this.props.setLoading();

		workableService.checkin(this.props.workableId, '', this.props.containerId).then(response => {
			if(commons.isRequestError(response)){
				toast.error(commons.toastError(response))
			}
			else {
				this.props.loadDatas(this.props.workableId, false);
				if(this.props.refreshListView){
					this.props.refreshListView('viewDetails');
				}
			}
		})
	}
	/**
	 * Checkout
	 */
	async checkout(e){
		if(e)e.preventDefault();
		if(this.props.setLoading) this.props.setLoading();

		const idOnly = this.props.idOnly ? this.props.idOnly : false;
		workableService.checkout(this.props.workableId, idOnly,'', this.props.containerId).then(response => {
			if(commons.isRequestError(response)){
				toast.error(commons.toastError(response))
			}
			else {
				const wcid = response.data.attributes.id
				this.props.loadDatas(wcid, false);
			}
		})
	}
	/**
	 * Undo checkout
	 */
	async undoCheckout(e){
		if(e)e.preventDefault();
		if(this.props.setLoading) this.props.setLoading();
		const idOnly = this.props.idOnly ? this.props.idOnly : false;
		workableService.originalCopy(this.props.workableId, idOnly, this.props.containerId).then(response => {
			if(commons.isRequestError(response)){
				toast.error(commons.toastError(response))
			}
			else {
				const original = response.data.attributes.id;
				workableService.undoCheckout(this.props.workableId, '', this.props.containerId).then((res) => {
					if(commons.isRequestError(res)){
						toast.error(commons.toastError(res))
					}
					else {
						if(this.props.loadDatas){
							this.props.loadDatas(original);
						}

						if(this.props.refreshListView){
							this.props.refreshListView();
						}
					}
				})
			}
		})
	}

	workingCopyActions(){
		let VALIDATE_LABEL = this.props.VALIDATE_LABEL ? this.props.VALIDATE_LABEL :  'Valider';
		let DELETE_WC_LABEL = this.props.DELETE_WC_LABEL ? this.props.DELETE_WC_LABEL :  'Supprimer';
		const validateIcon = this.props.validateIcon ? this.props.validateIcon : 'fa fa-check fa-md';
		const deleteIcon = this.props.deleteIcon ? this.props.deleteIcon : 'fa fa-md fa-trash';
		let firstIteration = this.props.iterationInfo.iterationNumber === 1;

		return <>
			<WizardConfirm
				needsConfirmation={this.props.confirmSave === true}
				buttonIcon={validateIcon}
				buttonTitle={VALIDATE_LABEL}
				onConfirm={() => this.checkin()}
				dialogMessage="Validate modifications?"
				dialogTitle={VALIDATE_LABEL}/>

			<WizardConfirm
				needsConfirmation={this.props.confirmCancel === true}
				buttonIcon={deleteIcon}
				disabled={firstIteration}
				buttonTitle={DELETE_WC_LABEL}
				onConfirm={() => this.undoCheckout()}
				dialogMessage="Cancel modifications?"
				dialogTitle={DELETE_WC_LABEL}/>
		</>
	}
	/**
	 * Workable actions
	 */
	workabaleActions() {
		let workingCopy = this.props.workInfo.isWorkingCopy === true;

		let hasWorkingCopy = this.props.workInfo.lockedSince !== null &&
			this.props.workInfo.lockedSince !== undefined &&
			this.props.workInfo.lockedSince !== '';

		let firstIteration = this.props.iterationInfo.iterationNumber === 1;
		let canForwardToWc = hasWorkingCopy && !workingCopy;
		let canForwardToOriginalCopy = hasWorkingCopy && workingCopy;

		let canCheckout = false;
		if(this.props.iterationInfo.isLatestIteration === true && !hasWorkingCopy){
			canCheckout = true;
		}

		if(this.props.versionInfo && !this.props.versionInfo.isLatestVersion){
			canCheckout = false;
		}

		let actions = [];
		let CLONE_LABEL= this.props.CLONE_LABEL ? this.props.CLONE_LABEL :  'CLONE';
		const cloneIcon = this.props.cloneIcon ?  this.props.cloneIcon : 'fa fa-md fa-clone';
		if(canCheckout){
			actions.push(
				<WizardConfirm
					needsConfirmation={this.props.confirmEdit === true}
					buttonIcon={cloneIcon}
					buttonTitle={CLONE_LABEL}
					onConfirm={() => this.checkout()}
					dialogMessage="Create a working copy?"
					dialogTitle={CLONE_LABEL}/>
			)
		}

		if(workingCopy){
			actions.push(this.workingCopyActions());
		}

		let WC_LABEL = this.props.WC_LABEL ? this.props.WC_LABEL :  'WORKING COPY'
		let OC_LABEL = this.props.WC_LABEL ? this.props.OC_LABEL :  'ORIGINAL COPY'
		let OC_ICON = this.props.OC_ICON ? this.props.OC_ICON : 'fa fa-backward fa-md';
		let WC_ICON = this.props.WC_ICON ? this.props.WC_ICON : 'fa fa-forward fa-md';

		return (
			<React.Fragment>
				<Button hidden={!canForwardToWc}  onClick={this.toWorkingCopy}>
					<i className={WC_ICON}></i>&nbsp;{WC_LABEL}</Button>
				<Button hidden={!canForwardToOriginalCopy} disabled={firstIteration}  onClick={this.toOriginalCopy}>
					<i className={OC_ICON}></i>&nbsp;{OC_LABEL}</Button>
				{actions}
			</React.Fragment>
		)
	}

	render(){
		return (<div>{this.workabaleActions()}</div>)
	}
}

WorkableAction.propTypes = propTypes;
WorkableAction.defaultProps = defaultProps;


export default WorkableAction;
