import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AttributeListGroup from '_components/_common/AttributeListGroup';
/**
 * Default attributes list
 */
const persistenceInfoAttributesSchema = {
    items: [
        {
            attributes: [
            	{name: 'Créé par',  dataField: 'attributes.createdBy'},
                {name: 'Créé le',  dataField: 'attributes.createDate',  dateFormat: 'DD/MM/YYYY HH:mm:ss', type: 'date'},
            	{name: 'Modifié par',  dataField: 'attributes.lastModifiedBy'},
                {name: 'Modifié le',  dataField: 'attributes.lastModifiedDate',  dateFormat: 'DD/MM/YYYY HH:mm:ss', type: 'date'},
            ]
        },
    ],
};

const propTypes = {
    attributesSchema: PropTypes.array,
    orientation: PropTypes.string,
};

const defaultProps = {
    attributesSchema: persistenceInfoAttributesSchema,
    orientation: 'horizontal'
};
/**
 * Persistnce informations of all entities
 */
class PersistenceInfo extends Component {
	render(){
		const schema = this.props.attributesSchema;
		const item = this.props.data;

		const d = [];
		schema.items.map(config => {
            let view = <AttributeListGroup {...this.props}
                             attributesListConfig={config} data={item}
                             cardClassName={this.props.cardClassName}/>
	        d.push(view);
        });

		return (<div className={'attribute-list'}>{d}</div>)
	}
}

PersistenceInfo.propTypes = propTypes;
PersistenceInfo.defaultProps = defaultProps;

export default PersistenceInfo;
