import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { lifecycleService } from '_services/lifecycle.services';
import { lifecycleManagedService } from '_services/lifecycleManaged.services';
import {WizardConfirm} from '_components/_common';
import { DropdownButton} from 'react-bootstrap'
import {StatusHelper} from '_helpers/StatusHelper';

const propTypes = {
		lifecycleManagedId: PropTypes.string.isRequired,
		byActionName: PropTypes.string.isRequired,
		currentState: PropTypes.string.isRequired,
		refreshCallBack: PropTypes.func,
}
const defaultProps = {
		refreshCallBack: null,
		byActionName: 'USER_SET_STATE'
}
/**
 * Actions for LifecycleManaged entity
 */
class LifecycleManagedActions extends Component {

	constructor(props){
		super(props)
		this.state = {
			modal: '',
			reachableStates: [],
		}

		this.loadReachableState = this.loadReachableState.bind(this)
		this.confirmModalSetState = this.confirmModalSetState.bind(this)
		this.onCommentChange = this.onCommentChange.bind(this)
	}
	/**
	 * Toggle the modal
	 */
	toggleModal(state) {
		this.setState(prevState => ({
    		modal: state
		})
	  )
	}

	componentWillUpdate(nextProps, prevstate){
		if(nextProps.currentState !== this.props.currentState){
			this.loadReachableState(nextProps.currentState)
		}
	}

	componentDidMount(){
		this.loadReachableState(this.props.currentState)
	}

	loadReachableState(status){
		lifecycleManagedService.statesByAction(this.props.lifecycleManagedId, status, this.props.byActionName, this.props.containerId).then(response => {

			let reachableStates = [];
			if(response && response.data && response.data.attributes){

				if(response.data.attributes.statesByAction !== null &&
					response.data.attributes.statesByAction !== undefined){

					response.data.attributes.statesByAction.split(";").map(state => {
						let realState = state;
						if(realState.startsWith(';')){
							realState = realState.slice(1, realState.length);
						}
						if(realState.endsWith(';')){
							realState = realState.slice(0, realState.length - 1);
						}
						if(realState && realState.trim().length > 0){
							reachableStates.push(realState);
						}
					});
				}
			}

			this.setState({reachableStates: reachableStates})
		})
	}

	onCommentChange(e){
		this.setState({
			comment: e.target.value
		})
	}

	confirmDialogContent(){
		return <textarea rows={10}
						 maxLength={500}
						 onChange={e => this.onCommentChange(e)}
						 name={'comment'}
						 placeholder={'Votre commentaire'}/>
	}

	confirmModalSetState(state, label, length){
		const status = StatusHelper.getDisplay(state);
		const className = this.props.inlineButtons ? '' : 'lifecycle-confirm-each';
		return <WizardConfirm
					modalSize='md'
					dialogContent={()=>this.confirmDialogContent()}
					buttonSize={this.props.lifecycleAction && this.props.lifecycleAction.buttonSize ? this.props.lifecycleAction.buttonSize : "sm"}
					buttonClassName={className}
					buttonColor={this.props.lifecycleAction && this.props.lifecycleAction.buttonColor ? this.props.lifecycleAction.buttonColor : "outline-secondary"}
					buttonTitle={status.toUpperCase()}
					onConfirm={() => this.doSetState(state)}
					dialogMessage="Commentaire"
					bodyClassName={'lifecycle-confirm'}
					dialogTitle={status.toUpperCase()}/>
	}

	doSetState(state){
		this.toggleModal()
		this.setState({
			loaded: false
		})

		const form = {
			comment: this.state.comment
		}

		let lifecycleManagedId = this.props.lifecycleManagedId
		lifecycleService.setStateWithComment(lifecycleManagedId, state, form, this.props.containerId).then(response => {
			if(this.props.refreshCallBack){
				this.props.refreshCallBack(response)
			}
		})
	}

	lifecycleManagedActions(){
		let lifecycleBySetStateActions = []
		if(this.state.reachableStates.length > 1 ) {
			this.state.reachableStates.map(state => {
				if(state && state.trim().length > 0){
					lifecycleBySetStateActions.push(
						this.confirmModalSetState(state, state, this.state.reachableStates.length)
					)
				}
			})
		}

		if(this.state.reachableStates.length === 1 ) {
			const status = this.state.reachableStates[0];
			lifecycleBySetStateActions.push(
				<WizardConfirm
					modalSize='md'
					dialogContent={()=>this.confirmDialogContent()}
					buttonSize={"sm"}
					buttonClassName={"btn btn-primary"}
					buttonTitle={status.toUpperCase()}
					onConfirm={() => this.doSetState(status)}
					dialogMessage="Commentaire"
					bodyClassName={'lifecycle-confirm'}
					dialogTitle={status.toUpperCase()}/>
			)
		}

		if(lifecycleBySetStateActions.length > 0){
			if(lifecycleBySetStateActions.length === 1){
				return lifecycleBySetStateActions;
			}

			let size = this.props.buttonSize ? this.props.buttonSize : "sm";

			if(this.props.inlineButtons){
				return lifecycleBySetStateActions;
			}
			else {
				const suite = <>
					<span>Suite</span>&nbsp;&nbsp;
					<i className={'fa fa-lg fa-angle-down'}></i>
				</>
				return  <>
					<DropdownButton title={suite}
						variant="outline-info"
						size={size}
						id="dropdown-basic-button">
					  	{lifecycleBySetStateActions}
					</DropdownButton>
				</>
			}
		}

		return <></>;
	}

	render(){
		return (<>
				{this.lifecycleManagedActions()}
			</>
		)
	}
}

LifecycleManagedActions.propTypes = propTypes;
LifecycleManagedActions.defaultProps = defaultProps;


export default LifecycleManagedActions;
