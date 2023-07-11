import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {identificationsService} from '_services/identifications.service';
import {DataTable, EmptyPane, Wizard} from "_components/_common";
import AddIdentification from "_components/_admin/IdentificationsInfo/AddIdentification";

const propTypes = {
	data: PropTypes.object,
};

const defaultProps = {
};
/**
 * Displays identification informations panel
 */
class IdentificationsInfo extends Component {

    constructor(props){
        super(props)
        this.state  = {
        	identifications: []
        }
    }

    componentDidMount(){
    	this.loadDatas()
    }

    loadDatas(wizardCloseFunction){
    	if(wizardCloseFunction)  wizardCloseFunction()
		identificationsService.getIdentifications(this.props.identifiedId, this.props.containerId).then(response => {
			this.setState({
				identifications: response.data
			})
		})
	}

	getCreatePage(wizardCloseFunction){
			return <AddIdentification {...this.props}
									  onCreateSuccess={()=>this.loadDatas(wizardCloseFunction)}/>
	}

	render() {
		if(this.state.identifications.length > 0){
			const tableConfig = {
				columnsConfig: [
					{name:'Comment', dataField: 'attributes.comment', headerClass: 'td-left', className: 'td-left'},
					{name:'Identification', dataField: 'attributes.identification', headerClass: 'td-left', className: 'td-left'},
					{name:'Master', dataField: 'attributes.master', headerClass: 'td-center', className: 'td-center', type: 'checkbox', displayComponent: (v,i) => master(v,i)},
				],
			}

			return <>
				<div style={{marginBottom: '2rem'}}>
					<Wizard
						dialogSize="md"
						hideFooter={true}
						buttonIcon="fa fa-sm fa-plus"
						buttonTitle='Ajouter une identification'
						dialogTitle="Ajouter une identification"
						dialogContentProvider={(wizardCloseFunction)=>this.getCreatePage(wizardCloseFunction)}/>
				</div>

				<DataTable items={JSON.stringify(this.state.identifications)}
						   tableConfig={tableConfig}
						   displayTotalElements={false}
						   paginate={false}/>

			</>

		}

		return <EmptyPane />
	}
}

IdentificationsInfo.propTypes = propTypes;
IdentificationsInfo.defaultProps = defaultProps;

export default IdentificationsInfo;


const master = (v,i) => {
	return <td className={'td-center'}>
		<input type={'checkbox'} value={v} checked={v} disabled/>
	</td>
}
