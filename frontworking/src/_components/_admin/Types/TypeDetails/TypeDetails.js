import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {AttributesGroup} from '_components/_common';
import { typeService } from '_services/type.services';
import {Accordion, WaitingPane, Wizard} from "_components/_common";
import TypeAdd from "_components/_admin/Types/TypeAdd";
import {contentHolderService} from "_services/contentHolder.services";
import {toast} from "react-toastify";
import FileSaver from "file-saver";
import TypeSetLifecycle from "_components/_admin/Types/TypeSetLifecycle";
import {LifecycleTransitions} from "_components/_admin/Lifecycles";
import TypeUpdateBaseClass from "_components/_admin/Types/TypeUpdateBaseClass";
import {businessRulesService} from "_services/business.rule.services";
import TypeDetailsBusinessRules from './TypeDetailsBusinessRules.js'

const summaryAttributesList = {
    items: [
        {
            attributes: [
                {name: 'Nom', dataField: 'attributes.displayName'},
                {name: 'Nom logique', dataField: 'attributes.logicalName'},
				{name: 'Classe', dataField: 'attributes.baseClass'},
                {name: 'Path', dataField: 'attributes.logicalPath'},
                {name: 'Description',  dataField: 'attributes.description'},
                {name: 'Icone path',    dataField: 'attributes.iconPath'},
	            {name: 'Icone name',    dataField: 'attributes.iconName'},
	            {name: 'I18N',   dataField: 'attributes.i18nKey'},
            ]
        },
    ],
}

const localisationAttributesList = {
	items: [
		{
			attributes: [
				{name: 'Icon path',  dataField: 'attributes.iconPath'},
				{name: 'Icon name',  dataField: 'attributes.iconName'},
				{name: 'I18N key',   dataField: 'attributes.i18nKey'},
			]
		},
	],
}

const propTypes = {
	item: PropTypes.any,
};

const defaultProps = {
	item: {},
};


/**
 * Type info view
 */
class TypeDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeTab: '1',
            tabContent: null,
			loading: true,

            vetoableBusinessRulesItems: [],
            vetoableBusinessRulesItemsMetaData: {},

            afterCommitSuccessBusinessRulesItems: [],
            afterCommitSuccessBusinessRulesItemsMetaData: {},

            afterCommitErrorBusinessRulesItems: [],
            afterCommitErrorBusinessRulesItemsMetaData: {},
        }

		this.onCreateTypeSuccess = this.onCreateTypeSuccess.bind(this)
		this.newContainerWizardContent = this.newContainerWizardContent.bind(this)
		this.changeLifecycleWizardContent = this.changeLifecycleWizardContent.bind(this)
		this.downloadPrimaryContent = this.downloadPrimaryContent.bind(this)
		this.onChangeFile = this.onChangeFile.bind(this)
		this.onsetLifecyleSuccess = this.onsetLifecyleSuccess.bind(this)
		this.onUpdateSuccess = this.onUpdateSuccess.bind(this)
		this.updateBaseClassWizardContent = this.updateBaseClassWizardContent.bind(this)
    }

    getFormQuery(item, phase){
    	let form = new FormData()
    	form['businessClass']= item.attributes.id
    	form['vetoable'] = phase === '0' ? true : false
    	form['container'] = this.props.containerId
    	form['includeParentRules'] = 'true'
    	form['businessType'] = ''
    	form['phase'] = phase
    	return form
    }

    loadVetoableBusinessRule(item) {
    	if(item) {
			this.setState({loading: true})

	    	let form = this.getFormQuery(item, '0')
	    	businessRulesService.getApplicableRules(form, this.props.containerId).then(e => {
				this.setState({
					loading: false,
					vetoableBusinessRulesItems: e.data ? e.data : [],
					vetoableBusinessRulesItemsMetaData: e.metaData
				})
	    	})
    	}
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    	if(this.props.itemId && this.props.itemId !== prevProps.itemId && this.props.itemId !== 'root_node') {
			this.loadData(this.props.itemId)
		}
	}

	loadData(itemId) {
    	this.setState({loading: true})
    	typeService.getById(itemId, this.props.containerId).then(json => {
			let type = json.data
			this.setState({
				item: json.data,
				loading: false,
				lifecycleName: json.data.attributes.lifecycleName,
				lifecycle: json.data.attributes.lifecycle,
				lifecycleId: json.data.attributes.lifecycleId,
				lifecycleIterationId: json.data.attributes.lifecycleIterationId
			})

			return json
		}).then(json => {
			let type = json.data
			this.loadVetoableBusinessRule(type)
		})
    }

	onsetLifecyleSuccess(wizardCloseFunction){
		wizardCloseFunction();
		this.loadData(this.props.itemId)
	}

	onCreateTypeSuccess(wizardCloseFunction, isRootType){
		wizardCloseFunction();
		this.props.onCreateTypeSuccess(isRootType)
	}

	newContainerWizardContent(wizardCloseFunction, isRootType){
		return <TypeAdd containerId={this.props.containerId}
						rootType={isRootType}
						onCreateSuccess={() => this.onCreateTypeSuccess(wizardCloseFunction, isRootType)}
						parentTypeName={this.state.item.attributes.displayName}
						parentTypeId={this.props.itemId}
						userContext={this.props.userContext}/>
	}

	changeLifecycleWizardContent(wizardCloseFunction){
		return <TypeSetLifecycle containerId={this.props.containerId}
								 typeId={this.props.itemId}
								 onCreateSuccess={() => this.onsetLifecyleSuccess(wizardCloseFunction)}
								 userContext={this.props.userContext}/>
	}

	updateBaseClassWizardContent(wizardCloseFunction){
		return <TypeUpdateBaseClass containerId={this.props.containerId}
								 typeId={this.props.itemId}
								 onSuccess={() => this.onUpdateSuccess(wizardCloseFunction)}
								 userContext={this.props.userContext}/>
	}

	onUpdateSuccess(){
		this.loadData(this.props.itemId)
	}

	downloadPrimaryContent(e){
		if(e) e.preventDefault()
		contentHolderService.downloadPrimaryContentBlob(this.state.lifecycleIterationId, this.props.containerId).then( blob => {
			FileSaver.saveAs(blob, 'cycle_de_vie.txt');
		})
	}

	toolbar(){
    	let displayToolbar = false
    	if(displayToolbar){
    		return <div className={'btn-toolbar'}>
				<Wizard hideFooter={true}
						dialogSize="md"
						buttonIcon="fa fa-sm fa-plus"
						buttonTitle='Type racine'
						dialogTitle='Ajouter un type racine'
						dialogContentProvider={(wizardCloseFunction) => this.newContainerWizardContent(wizardCloseFunction, true)}/>
				<Wizard hideFooter={true}
						dialogSize="md"
						buttonIcon="fa fa-sm fa-plus"
						buttonTitle='Sous-type'
						dialogTitle='Ajouter un type sous-type'
						dialogContentProvider={(wizardCloseFunction) => this.newContainerWizardContent(wizardCloseFunction, false)}/>
				{this.state.lifecycleId && <button onClick={this.downloadPrimaryContent}>
					<i className={'fa fa-download fa-md'}></i>&nbsp;Cycle de vie</button>
				}
				<Wizard hideFooter={true}
						dialogSize="lg"
						buttonIcon="fa fa-sm fa-pencil"
						buttonTitle='Cycle de vie'
						dialogTitle='Veuillez selectionner le cycle de vie'
						dialogContentProvider={(wizardCloseFunction) => this.changeLifecycleWizardContent(wizardCloseFunction)}/>
				<Wizard hideFooter={true}
						dialogSize="lg"
						buttonIcon="fa fa-sm fa-pencil"
						buttonTitle='Classe'
						dialogTitle='Modifier la classe de base'
						dialogContentProvider={(wizardCloseFunction) => this.updateBaseClassWizardContent(wizardCloseFunction)}/>
			</div>
		}
	}

	onChangeFile(e) {
		e.preventDefault()
		let file = e.target.files[0]
		let formData = new FormData()
		formData.append('file', file)
		contentHolderService.setPrimaryContentFile(this.props.contentHolderId, formData, this.props.containerId).then( response => {
			if(response.ok){
				toast.success('Le cycle de vie a été mis à jour')
			}
			else {
				toast.error('Erreur lors de la mise à jour du cycle de vie!')
			}
		})
	}

    render() {
		const {item} = this.state;
		if (this.state.loading || !this.props.itemId) {
			return <div style={{padding: '4rem'}}>
				<WaitingPane />
			</div>
		}

		return <React.Fragment>
				{this.toolbar()}

				<div className={'type-details-title'}>
					<h1>{this.state.item.attributes.displayName}</h1>
					<p>{this.state.item.attributes.logicalPath}</p>
				</div>

				<Accordion title={'Règles métiers'} expanded={true} content={
					<>
						<TypeDetailsBusinessRules
							loading={this.state.loading}
							datas={this.state.vetoableBusinessRulesItems}
							metaData={this.state.vetoableBusinessRulesItemsMetaData}/>
					</>
					}
				/>

				<Accordion title={'Cycle de vie'} expanded={true} content={
							<LifecycleTransitions {...this.props}
										  lifecycleId={this.state.lifecycleId}
										  lifecycleName={this.state.lifecycleName}/>
					}
				/>

				<Accordion title={'Metadonnées'} expanded={true} content={
					<AttributesGroup
						attributesGroup={summaryAttributesList}
						data={item}
						orientation="horizontal"
						displayHeader={true}/>
				}
				/>
		</React.Fragment>
	}
}

TypeDetails.propTypes = propTypes;
TypeDetails.defaultProps = defaultProps;

export default TypeDetails;
