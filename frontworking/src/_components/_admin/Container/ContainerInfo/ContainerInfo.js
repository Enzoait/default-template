import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AttributeListGroup from '_components/_common/AttributeListGroup';

const propTypes = {
    data: PropTypes.object,
};

const defaultProps = {};

class ContainerInfo extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        const item = this.props.data;
        const config = {
            title: 'Container infos',
            attributes: [
                {name: 'Nom', dataField: 'container.name', type: 'text'},
                {name: 'Path', dataField: 'container.path', type: 'text'},
                {name: 'Description', dataField: 'container.description', type: 'text'},
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

ContainerInfo.propTypes = propTypes;
ContainerInfo.defaultProps = defaultProps;

export default ContainerInfo;
