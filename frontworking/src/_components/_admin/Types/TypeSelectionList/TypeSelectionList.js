import React, { Component } from 'react';
import { ButtonToolbar, ButtonGroup, Button} from 'reactstrap';
import { typeService } from '_services/type.services';
import { Popover, OverlayTrigger, ListGroup} from 'react-bootstrap'


export default class TypeSelectionList extends Component {
	
	constructor(props){
		super(props)
		this.state = {
			rootProductCategorySubtypes: [],
			includeRootTypeInSelection: false,
			loading: true,
			
			// the default selected type
			selectedType: this.props.currentSelectedType,
		}
		
		this.selectType = this.selectType.bind(this)
	}
	/**
	 * Load subtypes if typeSelectionRootType changes from undefined 
	 * to new value (Has change page).
	 */
	componentDidUpdate(prevProps, prevState, snapshot){
		if(prevProps.typeSelectionRootType === undefined || prevProps.typeSelectionRootType === null){
			if(this.props.typeSelectionRootType !== null && this.props.typeSelectionRootType !== ''){
				this.loadSubtypes();
			}
		}
	}
	componentDidMount(){
		this.loadSubtypes();
	}
	loadSubtypes(){
		if(this.props.typeSelectionSingleNavigation === true){
			this.setState({
				rootProductCategorySubtypes: [],
				selectedType: this.props.typeSelectionRootTypeCategoryType,
				loading: false,
			});
		}
		else {
		
			if(this.props.typeSelectionRootTypeId){
				typeService
				.getSubtypeOfRecursive(this.props.typeSelectionRootTypeId, true, this.props.containerId)
				.then(response => {
					//console.log("this.state.rootType.attributes.instanciable : " + this.state.rootType.attributes.instanciable)
					if(response){
						let selectedType = response.data[0]
						if(this.props.typeSelectionRootType 
								&& this.props.typeSelectionRootType.attributes.instanciable !== true){
							
							// redisplay previous selected type if no null
							let selectedType = response.data[0]
							if(this.props.currentSelectedType){
								let id = this.props.currentSelectedType.attributes.id
								response.data.map(e => {
									if(e.attributes.id === id){
										selectedType = e	
									}
								})
							}
						}
						
						if(this.props.displayAllSelector === true){
							this.setState({
								rootProductCategorySubtypes: response.data,
								selectedType: this.props.displaySelectorLabel,
								loading: false,
							})
						}
						else {
							this.setState({
								rootProductCategorySubtypes: response.data,
								selectedType: selectedType,
								loading: false,
							})
						}
						
						// load all type of object
						if(this.props.displayAllSelector === true){
							if(this.props.onSelectedTypeChange){
								this.props.onSelectedTypeChange('')
							}	
						}
						
						// loads selected type only
						else{
							if(this.props.onSelectedTypeChange){
								this.props.onSelectedTypeChange(selectedType)
							}
						}
						
						
					}
					else {
						this.setState({
							loading: false,
						})
					}
				})
			}
		}
	}
	selectType(type){
		this.setState({
			selectedType: type
		})
		document.body.click()
		
		if(this.props.onSelectedTypeChange){
			this.props.onSelectedTypeChange(type)
		}
	}
	selectableSubtypesTabs(){
		if(this.state.rootProductCategorySubtypes.length > 0){
		  let typesDisplay = []
		  
		  if(this.props.displayAllSelector === true){
			  let label = this.props.displaySelectorLabel
			  typesDisplay.push(
				 <ButtonGroup className="mr-2">
				 	<Button onClick={e=>this.selectType(label)} color="info">
				 		<h5>{this.props.displaySelectorLabel}</h5>
				 		<div className="hal-opacity"><i>No filters, display all types</i></div>
				 	</Button>
				 </ButtonGroup>
			  )
		  }
		  
		  this.state.rootProductCategorySubtypes.map(type => {
			  if(type.attributes.instanciable === true){
				  typesDisplay.push(
					 <ButtonGroup className="mr-2">
					 	<Button onClick={e=>this.selectType(type)} color="info">
					 		<h5>{type.attributes.displayName}</h5>
					 		<div className="hal-opacity"><i>{type.attributes.description}</i></div>
					 	</Button>
					 </ButtonGroup>
				  )
			  }
		  })
		  
		  if(this.state.includeRootTypeInSelection === true 
				  && this.state.rootType 
				  && this.state.rootType.attributes.instanciable === true){
			  typesDisplay.push(
				 <ButtonGroup>
				 	<Button color="info">
				 		<div>
				 			{this.state.rootType.attributes.displayName}
				 		</div>
				 		<div className="hal-opacity"><i>{this.state.rootType.attributes.description}</i></div>
				 	</Button>
				 </ButtonGroup>
			  )
		  }
		  
		  return <ButtonToolbar>
		  	{typesDisplay}
		  </ButtonToolbar>
	  }
	  else {
		  return (
			 <center>
			 	<div>
			 		No content
			 	</div>
			 </center>
		  )
	  }
	}
	selectableSubtypes(){
	  if(this.state.rootProductCategorySubtypes.length > 0){
		  let typesDisplay = []
		  
		  if(this.props.displayAllSelector === true){
			  let label = this.props.displaySelectorLabel
			  typesDisplay.push(
				 <div>
				 	<ListGroup.Item action onClick={e=>this.selectType(label)}>
				 		<h5>{this.props.displaySelectorLabel}</h5>
				 		<div className="hal-opacity"><i>No filters, display all types</i></div>
				 	</ListGroup.Item>
				 </div>
			  )
		  }
		  
		  this.state.rootProductCategorySubtypes.map(type => {
			  if(type.attributes.instanciable === true){
				  typesDisplay.push(
					 <div>
					 	<ListGroup.Item action onClick={e=>this.selectType(type)}>
					 		<h5>{type.attributes.displayName}</h5>
					 		<div className="hal-opacity"><i>{type.attributes.description}</i></div>
					 	</ListGroup.Item>
					 </div>
				  )
			  }
		  })
		  
		  if(this.state.includeRootTypeInSelection === true 
				  && this.state.rootType 
				  && this.state.rootType.attributes.instanciable === true){
			  typesDisplay.push(
				 <div>
				 	<ListGroup.Item action>
				 		<div>
				 			{this.state.rootType.attributes.displayName}
				 		</div>
				 		<div className="hal-opacity"><i>{this.state.rootType.attributes.description}</i></div>
				 	</ListGroup.Item>
				 </div>
			  )
		  }
		  
		  return <ListGroup  variant='flush'>
		  	{typesDisplay}
		  </ListGroup>
	  }
	  else {
		  return (
			 <center>
			 	<div>
			 		No content
			 	</div>
			 </center>
		  )
	  }
    }
	
	render(){
		if(this.props.viewMode === 'tabs'){
			return this.selectableSubtypesTabs();
		}
		else {
			let popover = (
			  <Popover id="popover-basic">
			    <Popover.Title as="h1">Please select a type</Popover.Title>
			    <Popover.Content>
			      {this.selectableSubtypes()}
			    </Popover.Content>
			  </Popover>
		)
		
		let label = 'Loading... '
		if(this.state.loading !== true){
			if(this.state.selectedType) {
				if(this.state.selectedType.attributes && this.state.selectedType.attributes.instanciable === true){
					label = this.state.selectedType.attributes.displayName
				}
				else{
					label = 'No content'
				} 
			}	
			else {
				label = 'No content'
			}
		}
		
	   let popoverTrigger = <OverlayTrigger trigger="click" placement="right" overlay={popover} rootClose>
	  		<Button className="half-opacity katappult-link no-padding" color="white" size="sm">
	  			<h5>&nbsp;{label}&nbsp;<i className="fa fa-caret-down"></i></h5>
	  		</Button>
	   </OverlayTrigger>
	   
	   return popoverTrigger
		}
	}
}
