import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { revControlledService } from '_services/revcontrolled.services';
import Button from 'react-bootstrap/Button'
import {WizardConfirm} from "_components/_common";
import {commons} from "_helpers/commons";
import {toast} from "react-toastify";

const propTypes = {
	versionInfo: PropTypes.string,
	iterationInfo: PropTypes.string,
	revControlledId: PropTypes.string,
}
const defaultProps = {
}
/**
 * Actions for revision controlled
 */
class RevControlledAction extends Component {

	constructor(props){
		super(props);

		this.revise = this.revise.bind(this);
		this.getNextIteration = this.getNextIteration.bind(this);
		this.getPreviousIteration = this.getPreviousIteration.bind(this);
		this.getLatestIteration = this.getLatestIteration.bind(this);
		this.onAllIterationsSelected = this.onAllIterationsSelected.bind(this);
	}

	async onAllIterationsSelected() {
		if(this.props.onAllIterationsSelected){
			this.props.onAllIterationsSelected()
		}
	}

	async revise(){
		let revControlledId = this.props.revControlledId;
		revControlledService.revise(revControlledId, this.props.containerId).then(response => {
			const error = commons.isRequestError(response)
			if(error){
				toast.error(commons.toastError(response));
			}
			else {
				if(this.props.loadDatas) this.props.loadDatas(response.data.attributes.id);
				if(this.props.refreshListView) this.props.refreshListView();
			}
		})
	}

	async getNextIteration(){
		let currentIteration = this.props.iterationInfo.iterationNumber,
			nextIteration = currentIteration + 1;

		let version = this.props.versionInfo ? this.props.versionInfo.versionId : 'not_versioned';
		let revControlledId = this.props.revControlledId;
		revControlledService.exactIterationAndVersionIdOnly(revControlledId, version, nextIteration, this.props.containerId).then(response => {
			const error = commons.isRequestError(response)
			if(!error){
				this.props.loadDatas(response.data.attributes.id);
			}
		})
	}

	async getPreviousIteration(){
		let currentIteration = this.props.iterationInfo.iterationNumber,
			previousIteration = currentIteration - 1;

		let version = this.props.versionInfo ? this.props.versionInfo.versionId : 'not_versioned';
		if(previousIteration >= 1){
			let revControlledId = this.props.revControlledId;
			if(revControlledId){
				revControlledService.exactIterationAndVersionIdOnly(revControlledId, version, previousIteration, this.props.containerId).then(response => {
					const error = commons.isRequestError(response)
					if(!error){
						this.props.loadDatas(response.data.attributes.id);
					}
				})
			}
		}
	}

	async getLatestIteration(){
		let revControlledId = this.props.revControlledId;
		revControlledService.latestIterationOfIdOnly(revControlledId, this.props.containerId).then(response => {
			const error = commons.isRequestError(response)
			if(!error){
				this.props.loadDatas(response.data.attributes.id);
			}
		})
	}

	rcActions() {
		let isLatestIteration = this.props.iterationInfo.isLatestIteration === true;
		let firstIndex = this.props.iterationInfo.iterationNumber === 1;
		const canRevise = this.props.iterationInfo.isLatestIteration && this.props.versionInfo
			&& this.props.versionInfo.isLatestVersion
			&& this.props.canRevise;
		let isLatestVersion = isLatestIteration

		if(this.props.versionInfo){
			isLatestVersion = isLatestIteration && this.props.versionInfo.isLatestVersion
		}

		return (
			<div>
				{this.props.onAllIterationsSelected && <Button onClick={this.onAllIterationsSelected}><i className="fa fa-list fa-sm"></i></Button>}
				<Button disabled={firstIndex}  onClick={this.getPreviousIteration}><i className="fa fa-backward fa-sm"></i></Button>
				<Button disabled={isLatestVersion} onClick={this.getLatestIteration}><i className="fa fa-sm"></i>&nbsp;DERNIÈRE VERSION</Button>
				<Button disabled={isLatestIteration} onClick={this.getNextIteration}><i className="fa fa-forward fa-sm"></i></Button>
				{this.props.versionInfo && canRevise && <WizardConfirm
					buttonTitle='Nouvelle version'
					onConfirm={() => this.revise()}
					dialogMessage="Créer une nouvelle version?"
					dialogTitle='Nouvelle version'/>
				}
			</div>
		)
	}

	render(){
		return (
			<div>{this.rcActions()}</div>
		)
	}
}

RevControlledAction.propTypes = propTypes;
RevControlledAction.defaultProps = defaultProps;


export default RevControlledAction;
