import React, { Component } from 'react';
import {
	Col,
	Row,
}
from 'reactstrap';
import { listValuesService } from '_services/listvalues.services';
import {
	AttributeListGroup,
	PersistenceInfo,
}
from '_components/_common';
/**
 * Lifecycle details page
 */
class Enumeration extends Component {

	constructor(props){
		super(props);
		this.state = {
			mode: 'view',
		}
		// no update for configuration data
		// do a load to force export/update
		//this.update = this.update.bind(this)
	}
	componentDidMount(){
		const id = this.props.match.params.id
		listValuesService.details(id, this.props.containerId).
		then(e => {
			let location = e.data.attributes.value
			document.getElementsByClassName('active breadcrumb-item')[0].innerHTML = location

			this.setState({
				item: e.data
			})
		})
	}

	render() {
		const attributesList = {
		    title: 'Résumé',
		    attributes: [
		    	{name: 'Valeur', dataField: 'attributes.value', type: 'text'},
		    	{name: 'Saved value', dataField: 'attributes.savedValue', type: 'text'},
		    	{name: 'Nom', dataField: 'attributes.name', type: 'text'},
		    	{name: 'Description', dataField: 'attributes.description', type: 'text'},
		        {name: 'Locale', dataField: 'attributes.locale', type: 'text'},
		    ]
		};

		const item = this.state.item;
		if(item && item.status != 404){
			return (
				<div className="flex-row align-items-center">
					<Row>
						<Col xs="0" sm="0" md="1" lg="1" xl="2"></Col>
						<Col xs="12" sm="12" md="10" lg="10" xl="8">
							<Row>
								<Col xs="12" md="12" lg="12" xl="12">
									<div className="">
	                            		<h3 className="float-left, katappult-table-title">{item.attributes.value} </h3>
	                                </div>
		                        </Col>
							</Row>
							<Row>
								<Col>
									<div className="spacer-20"></div>
								</Col>
							</Row>
				            <Row>
				                <Col xs="12" md="12" lg="12" xl="12">
				                    <div>
				                        	<AttributeListGroup attributesListConfig={attributesList}
				                        		data={item}
				                        		addHeaderMargin="true"
				                        		displayHeader='true'/>

				                            <PersistenceInfo   {...this.props}
				                        		data={item}
				                            	displayHeader='true' addHeaderMargin="true"/>
				                    </div>
				                </Col>
				            </Row>
			            </Col>
			            <Col xs="0" sm="0" md="1" lg="1" xl="2"></Col>
		            </Row>
		        </div>

			);
		}
		return (<div>Loading...</div>);
	}
 }

export default Enumeration;
