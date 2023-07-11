import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AttributeListGroup from '_components/_common/AttributeListGroup';

const propTypes = {
    attributesSchema: PropTypes.array,
    displayActions: PropTypes.bool,
};

const defaultProps = {
    displayActions: true,
};
/**
 * Displays work infos panel for Workable/Revision controlled entities
 */
class WorkInfo extends Component {

    constructor(props){
        super(props)
    }

	render() {
		const item = this.props.data;
        const versionedSchema = {
            attributes: [
                {name: 'Version number',  dataField: 'versionInfo.versionId', type: 'number'},
                {name: 'Iteration number',  dataField: 'iterationInfo.iterationNumber', type: 'number'},
                {name: 'Latest',  dataField: 'iterationInfo.isLatestIteration', type: 'bool'},
                {name: 'Locked by',  dataField: 'workInfo.lockedBy', type: 'text'},
                {name: 'Locked since',  dataField: 'workInfo.lockedSince', type: 'date',  dateFormat: 'DD/MM/YYYY HH:mm'},
                {name: 'Working copy',  dataField: 'workInfo.isWorkingCopy', type: 'bool'},
            ],
        }

        const iteratedSchema = {
            attributes: [
                {name: 'Iteration number',  dataField: 'iterationInfo.iterationNumber', type: 'number'},
                {name: 'Latest',  dataField: 'iterationInfo.isLatestIteration', type: 'bool'},
                {name: 'Locked by',  dataField: 'workInfo.lockedBy', type: 'text'},
                {name: 'Locked since',  dataField: 'workInfo.lockedSince', type: 'date',  dateFormat: 'DD/MM/YYYY HH:mm'},
                {name: 'Working copy',  dataField: 'workInfo.isWorkingCopy', type: 'bool'},
            ],
        }

        const schemas = this.props.versioned ? versionedSchema : iteratedSchema;

		const d = [];
            let view = <AttributeListGroup {...this.props}
                attributesListConfig={schemas}
                data={item}
                orientation="horizontal"
                displayHeader={this.props.displayHeader}
                cardClassName={this.props.cardClassName}/>

		return <React.Fragment>{view}</React.Fragment>
	}
}

WorkInfo.propTypes = propTypes;
WorkInfo.defaultProps = defaultProps;

export default WorkInfo;
