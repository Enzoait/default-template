import React from 'react';
import PropTypes from 'prop-types';
import {Label} from 'reactstrap';

const propTypes = {
	value: PropTypes.number,
}

const defaultProps = {
	value: 0
}
/**
 * 
 */
class GenderViewer extends React.Component {

	render() {
		if(0 === this.props.value){
			return (
				<React.Fragment>
					<Label>M</Label>
				</React.Fragment>	
			)
		}
		else {
			return (
				<React.Fragment>
					<Label>F</Label>
				</React.Fragment>	
			)
		}
	}
}

GenderViewer.propTypes = propTypes;
GenderViewer.defaultProps = defaultProps;

export default GenderViewer;
