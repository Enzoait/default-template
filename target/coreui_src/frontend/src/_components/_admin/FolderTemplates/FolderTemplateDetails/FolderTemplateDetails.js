import React, { Component } from 'react';
import { 
    ButtonToolbar,  Col,  
    Row,
    Button,
    ButtonGroup,
} from 'reactstrap';
import { commons } from '_helpers/commons';
import PropTypes from 'prop-types';
import { 
	AttributeListGroup, 
	PersistenceInfo,
} from '_components/_common';
import { toast } from 'react-toastify';
import { folderTemplateService } from '_services/folder.template.services';
import { contentHolderService } from '_services/contentHolder.services';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/themes/prism-dark.css';


const propTypes = {
	item: PropTypes.object,
};

const defaultProps = {
};

/**
 * Folder Template details page
 */
class FolderTemplateDetails extends Component {

    constructor(props){
        super(props);
        this.state = {
        	item: {},
            mode: 'view',
            xml: '<PleaseWait>Loading...</PleaseWait>',
        }

        this.saveEditorContent = this.saveEditorContent.bind(this)
		this.setXMLContent = this.setXMLContent.bind(this)
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
    		folderTemplateService
    		.getById(templateId, this.props.containerId)
    		.then(json => {
    			let location = json.data.attributes.displayName;
				if(this.props.pushBreadCrumb){
					let item = {'href': '#', title: location}
					this.props.pushBreadCrumb(item)
				}
    			this.setState({item: json, id: templateId});
            })
            
             contentHolderService
			.downloadPrimaryContent(templateId, this.props.containerId)
			.then(blob => {
				this.setState({
					xml: blob
				})
			});
    	}
    }
    commonActions(){
	    return (
			<React.Fragment>
				<ButtonToolbar>
					<div>&nbsp;</div>
					<ButtonGroup>
	                	<Button ><i className="fa fa-cloud-download"></i>&nbsp;DOWNLOAD CONTENT</Button>
                    </ButtonGroup>
                    <div>&nbsp;</div>
                    <ButtonGroup>    
	                	<Button ><i className="fa fa-cloud-upload"></i>&nbsp;REPLACE CONTENT</Button>
	                </ButtonGroup>
	                <div>&nbsp;</div>
	            </ButtonToolbar> 
	        </React.Fragment>
		)
    }
    saveEditorContent(){
    	let rawcontent = this.state.xml;
    	//console.log(rawcontent);
    	
    	let contentHolderId = this.getTemplateId();
    	let file = new Blob([rawcontent], {type: 'text/plain'});
		let formData = new FormData();
		formData.append('file', file);
		
		contentHolderService
		.setPrimaryContentFile(contentHolderId, formData, this.props.containerId)
		.then( response => {
			
			let errors = [];
			if(commons.isRequestError(response)){
	    		errors.push(commons.getRestErrorMessage(response));
	    		toast.error('Update template error');
	    		this.setState({
    				errors: errors,
    				loading: false
    			})
	    	}
	    	else {
	    		toast.success('Content updated.')
    				this.setState({
    				errors: [],
    				loading: false,
    			})
	    	}
    	})
    }
	setXMLContent(contentXml){
		this.setState({
    		xml: contentXml
    	})
	}
	render() {
        const summaryAttributesList = {
            title: 'Summary',
            icon: 'fa fa-info float-right',
            attributes: [
                {name: 'Name', dataField: 'attributes.displayName'},
                {name: 'Internal name', dataField: 'attributes.internalName'},
                {name: 'Description', dataField: 'attributes.logicalName'},
                {name: 'Reference', dataField: ''},
            ]
        };

        if(this.state.item && this.state.item.data){
            const data = this.state.item.data;
            if(data){
                const d = commons.toJSONObject(data);
                return ( <>
                		<Row>
                			<Col xs="12" sm="12" md="12">
	                			<div className="admin-details-header">
		                    		<p className="page-title mt-2">{d.attributes.displayName}</p>
								</div>
							</Col>
                		</Row>
                	
                       	 <Row className="mb-3 mt-4">
								<Col xs="12" sm="12" md="6">
									<div className="shadowed-pane shadowed-pane-info">
                                        <AttributeListGroup 
                                        	attributesListConfig={summaryAttributesList} 
                                        	data={d} 
                                        	canEdit={true}
                                        	displayHeader={true} />
                                    </div>
                                </Col>
                                <Col xs="12" sm="12" md="6">
                                	<div className="shadowed-pane shadowed-pane-info">
                                        <PersistenceInfo  
                                        	data={d} {...this.props} 
                                        	displayHeader={true}/>
                                   </div>
	                            </Col>
	                     </Row>
	                     <Row>
	                     	<Col>
	                     		<div className="shadowed-pane shadowed-pane-info">
										<Editor onValueChange={this.setXMLContent}
										        value={this.state.xml}
										        highlight={code => highlight(code, languages.markup, 'markup')}
										        padding={10}
										        style={{
										          fontFamily: '"Fira code", "Fira Mono", monospace',
										          fontSize: 12,
										        }}/>
										<Button className="mt-4 mb-4" variant="warning" onClick={this.saveEditorContent}>SAVE CONTENT</Button>
								</div>
	                     	</Col>
	                     </Row>
               </> );
            }
        }
        return (<div></div>);
    }
}

FolderTemplateDetails.propTypes = propTypes;
FolderTemplateDetails.defaultProps = defaultProps;

export default FolderTemplateDetails;

