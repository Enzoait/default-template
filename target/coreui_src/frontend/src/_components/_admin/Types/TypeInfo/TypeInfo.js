import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AttributeListGroup from '_components/_common/AttributeListGroup';

const propTypes = {
	data: PropTypes.object,
};

const defaultProps = {
};
/**
 * Displays type informations panel
 */
class TypeInfo extends Component {

    constructor(props){
        super(props)
    }

	render() {
		const item = this.props.data;
        const config = {
                title: 'Type infos',
                icon: 'fa fa-info float-right',
                attributes: [
                    {name: 'Type',  dataField: 'businessType.displayName', type: 'text'},
                    {name: 'Logical name',  dataField: 'businessType.logicalName', type: 'text'},
                    {name: 'Logical path',  dataField: 'businessType.logicalPath', type: 'text'},
                    {name: 'Description',  dataField: 'businessType.description', type: 'text'},
                ],
         };

		const d = <AttributeListGroup {...this.props} 
                attributesListConfig={config} 
                data={item} 
                orientation="horizontal" 
                displayHeader={this.props.displayHeader} 
                cardClassName={this.props.cardClassName}/>
        
		return (<React.Fragment>{d}</React.Fragment>)
	}
}

TypeInfo.propTypes = propTypes;
TypeInfo.defaultProps = defaultProps;

export default TypeInfo;

