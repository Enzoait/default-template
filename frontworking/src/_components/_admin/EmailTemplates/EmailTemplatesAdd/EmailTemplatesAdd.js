import React, { Component } from 'react';
import { AttributeListGroup} from '_components/_common';
import {WaitingPane} from "_components/_common";
import {toast} from "react-toastify";
import {enTemplateService} from "_services/entemplates.services";
import {commons} from "_helpers/commons";

class EmailTemplatesAdd extends Component {

    constructor(props) {
        super(props)
        this.state = {
            formData: {},
            errors:[]
        }

        this.create = this.create.bind(this)
    }

    async create(formData) {
        this.setState({loading:true})

        formData.containerId = this.props.containerId;

        enTemplateService.create(formData, this.props.containerId).then(response => {
            if(commons.isRequestError(response)){
                toast.error(commons.toastError(response))
            }
            else {
                this.setState({loading: false})
                this.props.onCreateSucess();
            }
        })
    }

    /**
     * Attributes list
     */
    attributesList(){
        const attributesList = {
            saveButtonTitle: 'CRÉER',
            onSubmit: (formData) => this.create(formData),
            attributes: [
                {name: 'Nom', dataField: 'displayName', required:true,  placeHolder: 'Nom'},
                //{name: 'Nom interne', dataField: 'internalName',  required: true, placeHolder: 'Nom interne', pattern:"[-_A-Z0-9]+"},
                {name: 'Titre du mail', dataField: 'messageTitle',  required: true, placeHolder: 'Titre du mail'},
                //{name: 'Contenu', dataField: 'primary', type:'file', placeHolder: 'Contenu'},
            ]
        }

        return attributesList;
    }

    render() {
        if(this.state.loading){
            return <WaitingPane/>
        }

        let errors = []
        if(this.state.errors.length > 0) {
            this.state.errors.map(error => {
                errors.push(<p>{error}</p>)
            })
        }

        let formData ={...this.state.formData}
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

export default EmailTemplatesAdd;
