import React, { Component } from 'react';
import { AddOrg, AddPerson, WaitingPane } from '_components/_common';
import { Form } from 'react-bootstrap'
import { RiCheckboxCircleLine } from "react-icons/ri";

class AddPeople extends Component {

	constructor(props) {
		super(props)

		let initialFormData = this.props.initialData
		let peopleSimpleType = this.props.peopleMode === 'b2c' || this.props.peopleMode === 'b2bAndB2c' ? '0' : '2'
		if(initialFormData){
			const orgType = initialFormData.orgType
			if(orgType){
				peopleSimpleType = '2'
			}
		}

		this.state = {
			gender: '0',
			step: 0,
			errors: [],
			processing: false,
			success: false,
			peopleSimpleType: peopleSimpleType
		}

		this.handleSelectTypeChange = this.handleSelectTypeChange.bind(this)
		this.processing = this.processing.bind(this)
		this.onError = this.onError.bind(this)
		this.onSuccess = this.onSuccess.bind(this)
	}

	processing(value){
		this.setState({processing: value})
	}

	handleSelectTypeChange(event){
		this.setState({peopleSimpleType: event.target.value})
	}

	next(){
		this.setState({step: 1})
	}

	getStepContent(){
		let content;
		if(this.state.peopleSimpleType === '0' || this.state.peopleSimpleType === '1'){
			content = <AddPerson
				{...this.props}
				onProcessing={this.processing}
				onError={this.onError}
				onCreatePeopleSuccess={this.onSuccess}
				gender={this.state.gender}
				displayHeader={false}/>
		}
		else {
			content = <AddOrg
				{...this.props}
				onError={this.onError}
				onCreatePeopleSuccess={this.onSuccess}
				onProcessing={this.processing}
				gender={this.state.gender}
				displayHeader={false}/>
		}

		return content;
	}

	onError(error){
		let errors = []
		errors.push(error)
		this.setState({
			errors: errors,
			processing: false,
		})
	}

	onSuccess(){
		this.setState({success: true})
		this.props.onCreatePeopleSuccess()
	}

	peopleCreationOption(){
		let options = [];

		if(this.props.peopleMode === "b2c"){
			options.push(<option value="0">Mr</option>)
			options.push(<option value="1">Mme</option>)
		}
		else if(this.props.peopleMode === "b2b"){
			options.push(<option value="2">Société</option>)
		}
		else {
			options.push(<option value="0">Mr</option>)
			options.push(<option value="1">Mme</option>)
			options.push(<option value="2">Société</option>)
		}

		return options
	}

	render() {
		let homeUrl = "/";
		if(this.state.loading === true){
			return <WaitingPane />
		}

		let errors = [];
		if(this.state.errors.length > 0) {
			this.state.errors.map(error => {
				errors.push(<p>{error}</p>)
			})
		}

		if(this.state.success){
			return <div style={{'margin-left': '40%', 'margin-top':'2rem', 'margin-bottom':'2rem'}}>
				<RiCheckboxCircleLine color={"green"} size={'4rem'}/>
			</div>
		}

		let row0 = <Form.Group controlId="createPeopleType" className={'register-people-select'}>
			<Form.Label>Titre</Form.Label>
			<Form.Control as="select"
						  value={this.state.peopleSimpleType}
						  onChange={this.handleSelectTypeChange}
						  name="peopleSimpleType">
				{this.peopleCreationOption()}
			</Form.Control>
		</Form.Group>

		return <div>
			<center id="form-errors-section" className="form-error">
				{errors}
			</center>

			{this.state.processing && <>
				<p><WaitingPane/></p>
			</>
			}

			{!this.state.processing && row0}
			{	<>
				{this.getStepContent()}
				{!this.props.hideAgreements && <div className="footer-links">
					<button onClick={e=>window.location.href = process.env.PUBLIC_URL}>Page d'accueil</button>
					<span>&nbsp;&nbsp;</span>
					<button onClick={e => this.props.history.replace('/login')}>Connexion</button>
				</div>
				}
			</>
			}
		</div>
	}
}

export default AddPeople;
