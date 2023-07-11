import React, {useEffect, useState} from 'react';
import {AttributeListGroup, WaitingPane} from "_components/_common";
import {BadgeService} from "_services/_generated/Badge.services";
import {toast} from "react-toastify";
import {commons} from "_helpers/commons";
// IMPORT

function BadgeAdd(props) {

    const[formData, setFormData] = useState()
    const[loading, setLoading] = useState(false)
    const[errors, setErrors] = useState([])
// CONST

    const findFormErrors = (form) => {
        const { identification,expirationDate/*FORM ERRORS ATTR*/} = form
        const newErrors = {}

if (!identification || identification === '') newErrors.identification = 'Champs invalide';
if (!expirationDate || expirationDate === '') newErrors.expirationDate = 'Champs invalide';
/*FORM ERRORS VALIDATION*/
        return newErrors;
    }

    const create = (formData) => {
        setFormData(formData)
        setLoading(true)

        formData.containerId = props.containerId;
// ADDITIONAL_ATTRIBUTES

        BadgeService.createEntity(formData, props.containerId).then(response => {
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
{name: "Identification", dataField: "identification",  required: true,  placeHolder: "Identification", type: "text", invalidFeedBack: "Veuillez renseigner ce champs"},
{name: "Expiration date", dataField: "expirationDate", required: true, placeHolder: "Expiration date", type: "datetime", dateFormat: "DD/MM/YYYY HH:mm", invalidFeedBack: "Veuillez renseigner ce champs"},
{name: "Active", dataField: "isActive", required: true, placeHolder: "Active", type: "yesno", invalidFeedBack: "Veuillez renseigner ce champs"},
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

export default BadgeAdd;

// FOOTER
