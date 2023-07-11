import React, {Component} from 'react';
import {AttributeListGroup, WaitingPane} from "_components/_common";
import {CronTaskService} from "_services/CronTask.services";
import {toast} from "react-toastify";
import {enTemplateService} from "_services/entemplates.services";
import {commons} from "_helpers/commons";

class CronTaskAdd extends Component {

    constructor(props) {
        super(props)
        this.state = {
            formData: {},
            errors: []
        }

        this.create = this.create.bind(this)
        this.attributesList = this.attributesList.bind(this);
    }

    componentDidMount() {
        CronTaskService.taskBeans(this.props.containerId).then(response => {
            this.setState({
                beanSprings: response.data
            })
        });

        enTemplateService.listAllInContainer(this.props.containerId).then(response => {
            this.setState({emails: response.data})
        })
    }

    create(formData) {
        this.setState({formData: formData, loading: true})
        formData.containerId = this.props.containerId;

        CronTaskService.createEntity(formData, this.props.containerId).then(response => {
            if (commons.isRequestError(response)) {
                toast.error(commons.toastError(response))
                this.setState({
                    loading: false,
                    errors: [response.message]
                })
            } else {
                this.setState({loading: false})
                this.props.onCreateSuccess();
            }
        })
    }

    beanSprings() {
        let beans = []
        if (this.state.beanSprings && this.state.beanSprings.length > 0) {
            this.state.beanSprings.map(bean => {
                beans.push({
                    value: bean.attributes.name,
                    key: bean.attributes.bean
                })
            })
        }

        return beans;
    }

    attributesList() {
        const attributesList = {
            formId: 'dt-form',
            saveButtonTitle: 'CRÉER',
            onSubmit: (formData) => this.create(formData),
            attributes: [
                {name: 'Nom', dataField: 'name', required: true, placeHolder: 'Nom'},
                {
                    name: 'Tâche',
                    dataField: 'identifiant',
                    required: true,
                    type: 'select',
                    enumProvider: () => this.beanSprings()
                },
                {name: 'Périodicité', dataField: 'execution', required: true, placeHolder: 'Périodicité de la tâche'},
                {
                    name: "Email à envoyer",
                    dataField: 'emailTemplate',
                    required: true,
                    placeHolder: "Template à envoyer",
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

    render() {
        if (this.state.loading) {
            return <WaitingPane/>
        }

        let formData = {...this.state.formData}
        return (
            <div className="container-create-root">
                <div id="form-errors-section" className="form-error">
                    {this.state.errors}
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

export default CronTaskAdd;
