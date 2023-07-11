import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	readOnly: PropTypes.string.isRequired,
	value: PropTypes.bool,
}

const defaultProps = {
	readOnly: true,
	value: false
}

/**
 * 
 */
class BooleanViewer extends React.Component {

	render() {
		return (
			<React.Fragment>
				<input type='checkbox' checked={this.props.value} readonly={this.props.readOnly}/>
			</React.Fragment>	
		)
	}
}

BooleanViewer.propTypes = propTypes;
BooleanViewer.defaultProps = defaultProps;


export default BooleanViewer;
