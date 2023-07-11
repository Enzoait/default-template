import React, { Component } from 'react';
import {
	AttributeListGroup,
} from '_components/_common';

class AttributesGroup extends Component {

    render() {
        const d = [];
        this.props.attributesGroup.items.map(config => {
            let view = <AttributeListGroup {...this.props} attributesListConfig={config} />
            d.push(view);
        });

        return (
            <React.Fragment>{d}</React.Fragment>
        )
    }
}

export default AttributesGroup;
