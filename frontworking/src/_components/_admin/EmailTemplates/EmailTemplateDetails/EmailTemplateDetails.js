import React  from 'react';
import {ButtonToolbar} from 'reactstrap';
import { commons } from '_helpers/commons';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
	AttributeListGroup,
	PersistenceInfo,
	ContentHolderAction,
	WizardConfirm,
	WaitingPane
} from '_components/_common';
import { enTemplateService } from '_services/entemplates.services';
import {contentHolderService} from '_services/contentHolder.services'
import Button from 'react-bootstrap/Button';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import Form from 'react-bootstrap/Form'
import { toast } from 'react-toastify';
import queryString from 'query-string';

const mapStateToProps = store => ({

});
const mapDispatchToProps = (disptach) => ({

})

const propTypes = {
    item: PropTypes.object,
    subviewMode: PropTypes.string
};

const defaultProps = {
    subviewMode: 'editor'
};

/**
 * Email Template details page
 */
class EmailTemplateDetails extends React.Component {

    constructor(props){
        super(props);

        this.state = {
        	loading:true,
        	item: {},
            subviewMode: 'editor',
            editorMode: 'html',
            messageTitle:'',
            errors: [],
            emailTemplateId: this.props.emailTemplateId ? this.props.emailTemplateId :
				this.props.match ? this.props.match.params.id : null,
        };

        this.saveEditorContent = this.saveEditorContent.bind(this);
        this.showSource = this.showSource.bind(this);
        this.showHtml = this.showHtml.bind(this);
				this.onEditorStateChange = this.onEditorStateChange.bind(this);
				this.getRootObjectForDetailsId = this.getRootObjectForDetailsId.bind(this);
    }

    showSource(){
     	this.setState({editorMode: 'source'})
    }

    showHtml(){
    	this.setState({editorMode: 'html'})
    }

    saveEditorContent(){
    	this.setState({
    		loading: true
    	})

    	let title = this.state.messageTitle;
    	if(!title || 0 === title.length){
    		this.setState({
    			errors: ['Message title is mandatory! Please provide one.']
    		})
    		return;
    	}

    	let rawcontent = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));

    	let id = this.state.item.data.attributes.id;
    	let file = new Blob([rawcontent], {type: 'text/plain'});
		let formData = new FormData();
		formData.append('file', file);

		contentHolderService.setPrimaryContentFile(this.state.emailTemplateId, formData, this.props.containerId).then( response => {
			if(commons.isRequestError(response)){
				toast.error(commons.toastError(response))
			}
			else {
				let form = {};
				form.displayName = this.state.item.data.attributes.displayName;
				form.messageTitle = this.state.messageTitle;
				form.description = this.state.item.data.attributes.description;
				form.contentType = this.state.item.data.attributes.contentType;

				let id = this.state.item.data.attributes.id;
				enTemplateService.updateTemplate(id, form, this.props.containerId).then(res => {
					this.loadItem(id, false);
					if(commons.isRequestError(response)){
						toast.error(commons.toastError(response))
					}
				})
			}
		})
    }

    onEditorStateChange (editorState) {
	    this.setState({editorState});
	};

	onMessageTitleChange(e) {
		this.setState({messageTitle: e.target.value});
	};

	switchToSubView(subview) {
		this.setState({subviewMode: subview});
	};

    deleteItem(e){
    	if(e) e.preventDefault();
    	let id = this.state.emailTemplateId

    	enTemplateService.deleteTemplate(id, this.props.containerId).then(response => {
			if(commons.isRequestError(response)){
				toast.error(commons.toastError(response))
			}
			else {
    			this.props.history.goBack();
    		}
    	})
    }

    componentDidUpdate(prevprops, prevstate){
				const prevQueryUrlParams = queryString.parse(prevprops.location.search);
				const queryUrlParams = queryString.parse(this.props.location.search);
				let rootId = queryUrlParams.rootId;
				let prevId = prevQueryUrlParams.rootId;
				if(prevId !== rootId && rootId){
					this.loadItem(rootId, false)
				}
    }

    componentDidMount(){
			let rootId = this.getRootObjectForDetailsId()
			this.loadItem(rootId, true);
		}

		getRootObjectForDetailsId(){
			const queryUrlParams = queryString.parse(this.props.location.search);
			let objectforDetailsId = queryUrlParams.rootId;
			return objectforDetailsId
		}

    loadItem(templateId, updateBread){
    	if(templateId){
			enTemplateService.getById(templateId, this.props.containerId).then(json => {
				this.setState({
					loading:false,
	                item: json,
	                errors: [],
	                emailTemplateId: templateId,
	                messageTitle: json.data.attributes.messageTitle
	            });
	        })

	        contentHolderService.downloadPrimaryContent(templateId, this.props.containerId).then( response => {
				let blob = new Blob([response], { type: 'text/plain' });
				const reader = new FileReader();

				// This fires after the blob has been read/loaded.
				reader.addEventListener('loadend', (e) => {
				  const text = e.srcElement.result;
				  //console.log(text);

				  //const contentBlock = htmlToDraft(text);
				  const contentBlock = htmlToDraft(text);
				  if(contentBlock){
				  	const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      			  	const editorState = EditorState.createWithContent(contentState);
      			  	this.setState({editorState})
				  }

				});

				// Start reading the blob as text.
				reader.readAsText(blob);
			})
    	}
    }
    updateTemplate(formData){
    	this.setState({
			loading: true
		})

    	let form = {};
		form.displayName = formData.attributes.displayName;
		form.messageTitle = formData.attributes.messageTitle;
		form.description = formData.attributes.description;
		form.contentType = formData.attributes.contentType;

    	let id = this.state.item.data.attributes.id;
    	enTemplateService.updateTemplate(id, form, this.props.containerId).then(res => {
    		if(commons.isRequestError(res)){
    			this.setState({
    				errors: commons.getRestErrorMessage(res),
    				loading: false
    			})
    		}
    		else {
    			this.loadItem(id, false);
    		}
    	})
    }
    headerActions(){
    	if(this.state.item && this.state.item.data){
    		let data = this.state.item.data;
    		let deleteButton =	<WizardConfirm
				buttonColor="danger"
				buttonTitle="SUPPRIMER"
				onConfirm={() => this.deleteItem()}
				dialogMessage="VOULEZ SOUS SUPPRIMER CE TEMPLATE DE MAIL?"
				dialogTitle="SUPPRIMER UN TEMPLATE DE MAIL"/>
			let chActions = <ContentHolderAction
								canUpload={false}
								rawDownload={false}
								contentHolderId={data.attributes.id}/>

			return <div className="admin-filters-root" style={{marginBottom: '12px'}}>
				<div className={'btn-toobar btn-toolbar-right'}>
					{this.state.subviewMode === 'editor' &&
						<Button onClick={()=>this.switchToSubView('admin')}>INFOS</Button>
					}
					{this.state.subviewMode === 'admin' &&
						<Button onClick={()=>this.switchToSubView('editor')}>ÉDITEUR</Button>
					}
					{chActions}
					{/*deleteButton*/}
				</div>
			</div>
    	}

    	return <></>
    }
    userView(){
    	let content;
    	if(this.state.item && this.state.item.data){

    		if(this.state.editorMode === 'source'){
    			let source = this.state.editorState ? draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())) : 'ERROR';
    			content = <div className="">
    				<div className="html-editor html-source-editor">{source}</div>
					<div className={'btn-toolbar'}>
    					<Button className="btn-toolbar" onClick={e=>this.showHtml()}>VUE HTML</Button>
					</div>
    			</div>
    		}

    		else if(this.state.editorMode === 'html'){
	    		const data = this.state.item.data;
	    		const { editorState } = this.state;

	    		content = <div className={'accordion-pane'} style={{padding: '16px'}}>
					<strong className="form-error">{this.state.errors}</strong>

					<Form.Control size="md" type="text"
							className="admin-hover-input form-control"
							placeholder="Email object"
							value={this.state.messageTitle} onChange={this.onMessageTitleChange}/>

					<div className="panel bordered-panel html-editor">
						<Editor localization={{ locale: 'fr' }}
							wrapperClassName="html-editor-wrapper"
							editorClassName=""
							onEditorStateChange={this.onEditorStateChange}
							editorState={editorState}/>
					</div>

					<ButtonToolbar className={'footer-btn-toolbar'}>
						<Button onClick={e=>this.saveEditorContent()}>SAUVEGARDER</Button>
						<Button onClick={e=>this.showSource()}>VUE SOURCE</Button>
					</ButtonToolbar>
	    		</div>
	    	}
    	}

    	return content
    }
    adminView(){
    	if(this.state.item && this.state.item.data){
    	 const d = commons.toJSONObject(this.state.item.data);
    	 const summaryAttributesList = {
            onSubmit: (formData) => this.updateTemplate(formData),
            attributes: [
				{name: 'Nom interne', dataField: 'attributes.internalName', readOnly: true},
				{name: 'Type', dataField: 'attributes.type', readOnly: true},
                {name: 'Nom', dataField: 'attributes.displayName'},
                {name: 'Description', dataField: 'attributes.description', type: 'textarea'},
                {name: 'Titre du message', dataField: 'attributes.messageTitle'},
                {name: 'Type du contenu', dataField: 'attributes.contentType'},
            ]
        };

    	return <div>
				<AttributeListGroup {...this.props}
					attributesListConfig={summaryAttributesList}
					canEdit={true}
					standardFooterActions="true"
					data={d}
					displayHeader={true}
					addHeaderMargin='true'/>
				<PersistenceInfo  {...this.props}
					data={d}
					displayHeader={true}
					addHeaderMargin='true'/>
			</div>
		}

		return <></>
    }
	render() {
		let hasDatas = this.state.item && this.state.item.data;
		if(!hasDatas && this.state.loading === true){
			return <WaitingPane />
		}

        if(this.state.item && this.state.item.data) {
            const data = this.state.item.data;
            let view;
            if(this.state.loading === true){
            	view = <WaitingPane />
            }
            else {
            	view = this.state.subviewMode === 'editor' ? this.userView() : this.adminView();
            }

            return <>
					<div className="admin-details-header">
						<p className="page-title">{data.attributes.displayName}</p>
					</div>
					{this.headerActions()}
					<div>{view}</div>
            </>
        }
    }
}

EmailTemplateDetails.propTypes = propTypes;
EmailTemplateDetails.defaultProps = defaultProps;

export default connect(mapStateToProps, mapDispatchToProps) (EmailTemplateDetails);
