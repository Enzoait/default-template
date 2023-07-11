import React, {Component} from 'react';
import {AttributeListGroup, WaitingPane} from "_components/_common";
import {DataExportService} from "_services/DataExport.services";
import {toast} from "react-toastify";
import {enTemplateService} from "_services/entemplates.services";
import {commons} from "_helpers/commons";

class DataExportAdd extends Component {

    constructor(props) {
        super(props)
        this.state = {
            formData: {},
            errors: [],
            configs: []
        }

        this.create = this.create.bind(this)
        this.attributesList = this.attributesList.bind(this);
    }

    create(formData) {
        this.setState({formData: formData, loading: true})
        formData.containerId = this.props.containerId;

        DataExportService.createEntity(formData, this.props.containerId).then(response => {
            if (commons.isRequestError(response)) {
                toast.error(commons.toastError(response))
            } else {
                this.setState({loading: false})
                this.props.onCreateSuccess();
            }
        })
    }

    componentDidMount() {
        DataExportService.getAllConfigs(this.props.containerId).then(response => {
            this.setState({configs: response.data})
        })

        enTemplateService.listAllInContainer(this.props.containerId).then(response => {
            this.setState({emails: response.data})
        })
    }

    emailConfigs() {
        let emailConfigs = []
        if (this.state.emails && this.state.emails.length > 0) {
            this.state.emails.map(config => {
                emailConfigs.push({
                    key: config.attributes.internalName,
                    value: config.attributes.displayName
                })
            })
        }

        return emailConfigs
    }

    exportConfigs() {
        let result = []
        if (this.state.configs && this.state.configs.length > 0) {
            this.state.configs.map(config => {
                result.push({
                    key: config.attributes.id,
                    value: config.attributes.name
                })
            })
        }

        return result
    }

    attributesList() {
        const attributesList = {
            formId: 'dt-form',
            saveButtonTitle: 'CRÉER',
            onSubmit: (formData) => this.create(formData),
            attributes: [
                {name: 'Nom', dataField: 'name', required: true, placeHolder: 'Nom'},
                {
                    name: 'Données',
                    dataField: 'configId',
                    required: true,
                    type: 'select',
                    placeHolder: 'Configuration',
                    enumProvider: () => this.exportConfigs()
                },
                {name: 'Périodicité', dataField: 'execution', required: false},
                {
                    name: 'Email à envoyer',
                    dataField: 'emailTemplate',
                    required: false,
                    placeHolder: 'Email à envoyer',
                    type: 'select',
                    enumProvider: () => this.emailConfigs()
                },
                {
                    name: 'Notifier les utilisateurs',
                    dataField: 'notifications',
                    required: false,
                    placeHolder: 'Emails séparés par (;)'
                },
            ]
        }

        return attributesList;
    }

    render() {
        if (this.state.loading) {
            return <WaitingPane/>
        }

        let errors = []
        if (this.state.errors.length > 0) {
            this.state.errors.map(error => {
                errors.push(<p>{error}</p>)
            })
        }

        let formData = {...this.state.formData}
        return (
            <div className="container-create-root">
                <div id="form-errors-section" className="form-error">
                    {errors}
                </div>
                <AttributeListGroup
                    attributesListConfig={this.attributesList()}
                    data={formData}
                    standardFooterActions="true"
                    formMode='create_object'/>
            </div>
        )
    }
}

export default DataExportAdd;
