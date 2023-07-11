import React, {Component} from 'react';
import {Button, ButtonToolbar,} from 'reactstrap';
import {batchService} from '_services/batch.services';
import {AttributesGroup, PersistenceInfo,} from '_components/_common';
import queryString from 'query-string';

/**
 * DataLoaderHistoryDetails details page
 */
class DataLoaderHistoryDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            item: null,
            wc: false,
            mode: 'view',
            historyId: this.getRootObjectForDetailsId(),
        }

        this.updateDatas = this.updateDatas.bind(this)
        this.getRootObjectForDetailsId = this.getRootObjectForDetailsId.bind(this)
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
            this.loadDatas()
        }
    }

    componentDidMount() {
        this.loadDatas()
    }

    loadDatas() {
        let id = this.getRootObjectForDetailsId();
        batchService
            .getById(id, this.props.containerId)
            .then(response => {
                this.setState({
                    item: response.data
                })
            })
    }

    updateDatas(formData) {

    }

    showMasterFile(e, id) {
        if (e) e.preventDefault()

        batchService
            .downloadMasterFile(id, this.props.containerId)
            .then(response => {
                let blob = new Blob([response], {type: 'text/plain'});
                let blobUrl = URL.createObjectURL(blob);
                let w = window.open(blobUrl)
            })
    }

    showLogFile(e, id) {
        if (e) e.preventDefault()

        batchService
            .downloadLogFile(id, this.props.containerId)
            .then(response => {
                let blob = new Blob([response], {type: 'text/plain'});
                let blobUrl = URL.createObjectURL(blob);
                let w = window.open(blobUrl)
            })
    }

    render() {
        const attributesList = {
            items: [
                {
                    title: 'Résumé',
                    //onSubmit: (formData) => this.updateDatas(formData),
                    attributes: [
                        {name: 'Job', dataField: 'attributes.jobType'},
                        {name: 'Statut', dataField: 'attributes.status'},
                        {
                            name: 'Date de début',
                            dataField: 'attributes.startTime',
                            dateFormat: 'DD/MM/YYYY hh:mm:ss',
                            type: 'date'
                        },
                        {
                            name: 'Date de fin',
                            dataField: 'attributes.endTime',
                            dateFormat: 'DD/MM/YYYY hh:mm:ss',
                            type: 'date'
                        },
                        {name: 'Execution id', dataField: 'attributes.executionId'},
                        {name: 'Type', dataField: 'attributes.type'},
                        {name: 'App name', dataField: 'attributes.appName'},
                        {name: 'App version', dataField: 'attributes.appVersion'},
                    ]
                }
            ]
        };

        if (this.state.item) {
            const data = this.state.item;
            return (<div className={'data-loader-history'}>
                <div className="admin-details-header">
                    <p className="page-title">{data.attributes.jobType}</p>
                    <ButtonToolbar>
                        <Button onClick={e => this.showMasterFile(e, data.attributes.id)}>
                            <i className="fa fa-download fa-md"></i>&nbsp;{'Master file'.toUpperCase()}</Button>
                        <Button onClick={e => this.showLogFile(e, data.attributes.id)}>
                            <i className="fa fa-download fa-md"></i>&nbsp;{'Log file'.toUpperCase()}</Button>
                    </ButtonToolbar>
                </div>

                <div className="bordered-panel">
                    <AttributesGroup
                        attributesGroup={attributesList}
                        data={data}
                        items={data}
                        canEdit={true}
                        standardFooterActions={false}
                        displayHeader={true}/>
                </div>

                <div className="bordered-panel">
                    <PersistenceInfo
                        {...this.props}
                        data={data}
                        displayHeader={true}
                        addHeaderMargin="true"/>
                </div>
            </div>);
        }
        return (<div></div>);
    }
}


export default DataLoaderHistoryDetails;
