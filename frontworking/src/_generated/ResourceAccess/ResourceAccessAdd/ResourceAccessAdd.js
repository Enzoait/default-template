import React, {useEffect, useState} from 'react';
import {AttributeListGroup, WaitingPane} from "_components/_common";
import {ResourceAccessService} from "_services/_generated/ResourceAccess.services";
import {toast} from "react-toastify";
import {commons} from "_helpers/commons";
// IMPORT

function ResourceAccessAdd(props) {

    const[formData, setFormData] = useState()
    const[loading, setLoading] = useState(false)
    const[errors, setErrors] = useState([])
// CONST

    const findFormErrors = (form) => {
        const { name,location,description/*FORM ERRORS ATTR*/} = form
        const newErrors = {}

if (!name || name === '') newErrors.name = 'Champs invalide';
if (!location || location === '') newErrors.location = 'Champs invalide';
if (!description || description === '') newErrors.description = 'Champs invalide';
/*FORM ERRORS VALIDATION*/
        return newErrors;
    }

    const create = (formData) => {
        setFormData(formData)
        setLoading(true)

        formData.containerId = props.containerId;
// ADDITIONAL_ATTRIBUTES

        ResourceAccessService.createEntity(formData, props.containerId).then(response => {
            const error = commons.isRequestError(response)
            if(error) {
                setLoading(false)
                let message = response.errorFamily + ' - ' + response.message
                toast.error(commons.toastError(response));
                setErrors([message])
            }
            else {
                setLoading(false)
                props.onCreateSuccess();
                toast(commons.toastSuccess("Un élément a été créé"));
            }
        })
    }

    const attributesList = () => {
        const attributesList = {
            saveButtonTitle: 'CRÉER',
            onSubmit: (formData) => create(formData),
            formValidity: (formData) => findFormErrors(formData),
            attributes: [
{name: "Name", dataField: "name",  required: true,  placeHolder: "Name", type: "text", invalidFeedBack: "Veuillez renseigner ce champs"},
{name: "Location", dataField: "location",  required: true,  placeHolder: "Location", type: "text", invalidFeedBack: "Veuillez renseigner ce champs"},
{name: "Description", dataField: "description",  required: true,  placeHolder: "Description", type: "textarea", invalidFeedBack: "Veuillez renseigner ce champs"},
// CREATE_FORM_ATTRIBUTES_LIST
            ]
        }

        return attributesList;
    }

// METHOD

    if(loading){
        return <WaitingPane/>
    }

    const form = {...formData}
    const attributes = {

        // INITIAL_ATTRIBUTES_VALUE
    }
    form['attributes'] = attributes;

    return (
        <div className="container-create-root">
            <p className=" form-error">{errors}</p>
{/*FORM*/}
            <AttributeListGroup
                attributesListConfig={attributesList()}
                data={form}
                standardFooterActions="true"
                formMode='create_object'/>
        </div>
    )
}

export default ResourceAccessAdd;

// FOOTER
