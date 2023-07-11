import React, { Component } from 'react';
import { commons } from '_helpers/commons';
import PropTypes from 'prop-types';
import { 
	AttributeListGroup, 
	PersistenceInfo,
	ContentHolderAction,
} from '_components/_common';
import { teamTemplateService } from '_services/team.templates.services';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/themes/prism-dark.css';


const propTypes = {
	item: PropTypes.object,
};

const defaultProps = {
};

/**
 * Team Template details page
 */
class TeamTemplateDetails extends Component {

    constructor(props){
        super(props);
        this.state = {
        	item: {},
        	xml: '<PleaseWait>Loading...</PleaseWait>',
        }
    }
    getTemplateId(){
		return this.props.templateId ? this.props.templateId : 
			this.props.match ? this.props.match.params.templateId : null;
	}
    componentDidUpdate(prevProps, prevstate){
		if(prevProps.templateId !== this.getTemplateId()){
			this.loadDatas(this.getTemplateId())
		}
	}
    componentDidMount(){
		const templateId = this.getTemplateId();
		this.loadDatas(templateId)
    }
    loadDatas(templateId){
    	if(templateId){
    		teamTemplateService
    		.getById(templateId, this.props.containerId)
    		.then(json => {
    			let location = json.data.attributes.displayName;
				if(this.props.pushBreadCrumb){
					let item = {'href': '#', title: location}
					this.props.pushBreadCrumb(item)
				}
				
    			this.setState({item: json, id: templateId});
            })
    	}
    }
    
    saveEditorContent(){
    }
    
	render() {
        const summaryAttributesList = {
            title: 'Summary',
            icon: 'fa fa-info float-right',
            attributes: [
                {name: 'Name', dataField: 'attributes.displayName'},
                {name: 'Internal name', dataField: 'attributes.internalName'},
                {name: 'Description', dataField: 'attributes.logicalName'},
            ]
        };

        if(this.state.item && this.state.item.data){
            const data = this.state.item.data;
            if(data){
                const d = commons.toJSONObject(data);
                return (<>
            		<div className="admin-details-header">
                        <p className="page-title">{d.attributes.displayName}</p>
						<ContentHolderAction contentHolderId={data.attributes.id}/>
					</div>
                     <div className="bordered-panel">
                            <AttributeListGroup 
                            	attributesListConfig={summaryAttributesList} 
                            	data={d} 
                            	canEdit={true}
                            	displayHeader={true} />
                     </div>   
                     <div className="bordered-panel">
                            <PersistenceInfo  
                            	data={d} {...this.props} 
                            	displayHeader={true}/>
                     </div>   
                </>);
            }
        }
        return (<div></div>);
    }
}

TeamTemplateDetails.propTypes = propTypes;
TeamTemplateDetails.defaultProps = defaultProps;

export default TeamTemplateDetails;

