import React, {Component} from 'react';
import {AttributeListGroup, PersistenceInfo, WaitingPane} from "_components/_common";
import queryString from 'query-string';
import {DataExportService} from "_services/DataExport.services";
import DataExportInstanceList from "_components/_admin/DataExport/DataExportInstanceList";

class DataExportDetails extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            subviewMode: 'instances'
        }

        this.getRootObjectForDetailsId = this.getRootObjectForDetailsId.bind(this)
        this.loadDatas = this.loadDatas.bind(this)
        this.updateDatas = this.updateDatas.bind(this)
    }

    getRootObjectForDetailsId() {
        const queryUrlParams = queryString.parse(this.props.location.search);
        let objectforDetailsId = queryUrlParams.rootId;
        return objectforDetailsId
    }

    componentDidUpdate(prevProps, prevstate) {
        const prevQueryUrlParams = queryString.parse(prevProps.location.search);
        const queryUrlParams = queryString.parse(this.props.location.search);
        let rootId = queryUrlParams.rootId;
        let prevId = prevQueryUrlParams.rootId;
        if (prevId !== rootId && rootId) {
            this.loadDatas(rootId)
        }
    }

    componentDidMount() {
        let itemId = this.getRootObjectForDetailsId();
        this.loadDatas(itemId)
    }

    loadDatas(itemId) {
        if (itemId) {
            this.setState({loading: true})
            DataExportService.detailsEntity(itemId, this.props.containerId).then(response => {
                this.setState({
                    item: response.data,
                    loading: false
                });
            })
        }
    }

    updateDatas(formData) {
        let form = {};
        form.name = formData.attributes.name;
        form.description = formData.attributes.description;
        form.type = formData.attributes.type;

        let itemId = this.getRootObjectForDetailsId();
        DataExportService.updateEntity(itemId, form, this.props.containerId).then(response => {
            this.loadDatas(itemId)
        })
    }

    refreshList() {
        this.setState({refreshList: true})
        setTimeout(() => {
            this.setState({refreshList: false})
        }, 300)
    }

    headerActions() {
        let subviewMode = this.state.subviewMode;
        return <div className={'btn-toolbar btn-toolbar-right'}>
            {subviewMode !== 'list' &&
            <button onClick={() => this.setState({subviewMode: 'list'})}><i className={'fa fa-eye'}></i>&nbsp;Details
            </button>}
            {subviewMode !== 'instances' && <button onClick={() => this.setState({subviewMode: 'instances'})}><i
                className={'fa fa-list'}></i>&nbsp;Liste</button>}
            {subviewMode === 'instances' &&
            <button onClick={() => this.refreshList()}><i className={'fa fa-refresh'}></i>&nbsp;Recharger</button>}
        </div>
    }

    render() {
        const attributesList = {
            onSubmit: (formData) => this.updateDatas(formData),
            attributes: [
                {name: 'Nom', dataField: 'attributes.name', readOnly: true},
                {name: 'Périodicité', dataField: 'attributes.execution', readOnly: true},
                {name: 'Email à envoyer', dataField: 'attributes.emailTemplate'},
                {name: 'Mapping', dataField: 'attributes.dataExportConfig.forMappingFile'},
                {name: 'Script', dataField: 'attributes.dataExportConfig.scriptFile'},
                {name: 'Commande', dataField: 'attributes.dataExportConfig.command'},
                {name: 'Job', dataField: 'attributes.dataExportConfig.job'},
                {name: 'Type', dataField: 'attributes.dataExportConfig.type'},
                {name: 'Description', dataField: 'attributes.dataExportConfig.description'}
            ]
        }

        if (!this.state.item || this.state.loading) {
            return <WaitingPane/>
        }

        let content;
        if (this.state.subviewMode === 'instances') {
            content = <DataExportInstanceList {...this.props}
                                              refreshList={this.state.refreshList}
                                              dataExportId={this.getRootObjectForDetailsId()}/>
        } else {
            content = <>
                <div className="attributes-panel">
                    <p className=" form-error">{this.state.errors}</p>
                    <AttributeListGroup
                        containerId={this.props.containerId}
                        attributesListConfig={attributesList}
                        data={this.state.item}/>
                </div>

                <div className="attributes-panel">
                    <p className=" form-error">{this.state.errors}</p>
                    <PersistenceInfo
                        {...this.props}
                        data={this.state.item}
                        containerId={this.props.containerId}
                        displayHeader={true}/>
                </div>
            </>
        }

        return <div className={'entity-details'}>
            <div className="admin-details-header">
                <p className="page-title">{this.state.item.attributes.name}</p>
                {this.headerActions()}
            </div>
            {content}
        </div>
    }
}

export default DataExportDetails;
