import React, {Component} from 'react';
import {AttributeListGroup} from '_components/_common';
import {containerService} from '_services/container.services';
import {commons} from '_helpers/commons';
import {WaitingPane} from "_components/_common";

class ContainerCreate extends Component {

    constructor(props) {
        super(props)
        this.state = {
            formData: {},
            errors: []
        }

        this.createContainer = this.createContainer.bind(this)
        this.attributesList = this.attributesList.bind(this);
    }

    async createContainer(formData) {
        this.setState({loading: true})

        let workingContainer = this.props.containerId;

        formData.parentContainerId = this.props.parentContainerId;
        formData.currentContainerId = workingContainer;
        formData.ownerId = commons.getCurrentUserAccountOwnerId(this.props.userContext);
        formData.typePath = 'com.katappult.Container/StandardContainer/PeopleOwnedContainer';

        //formData.type = 'com.katappult.Container/StandardContainer/OrganizationOwnedContainer';

        // if the user is connected, no user email in the form
        // if the user is no connected, user email must be in form
        // in order to create an account for this owner.
        if (!formData.ownerEmail) {

        }

        containerService.createContainer(formData, this.props.parentContainerId).then(response => {
            if (commons.isRequestError(response)) {
                this.setState({
                    loading: false,
                    errors: [response.message],
                    formData: formData
                })
            } else {
                this.props.onCreateContainerSuccess(response.data.attributes.id);
            }
        })
    }

    /**
     * Attributes list
     */
    attributesList() {
        const attributesList = {
            saveButtonTitle: 'CRÉER',
            onSubmit: (formData) => this.createContainer(formData),
            attributes: [
                {name: 'Nom', dataField: 'name', required: true, placeHolder: 'Nom', pattern: "[-_ a-zA-Z0-9]+"},
                {
                    name: 'Description',
                    dataField: 'description',
                    type: 'textarea',
                    required: true,
                    placeHolder: 'Description'
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

export default ContainerCreate;
