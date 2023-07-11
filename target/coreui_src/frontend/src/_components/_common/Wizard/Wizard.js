import React from 'react';
import Modal from 'react-bootstrap/Modal'

class Wizard extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			modalShow: false,
		}
		this.hideWizard = this.hideWizard.bind(this);
		this.setModalShow = this.setModalShow.bind(this);
	}

	setModalShow(val){
		if(val === false){
			this.hideWizard()
		}

		this.setState({
			modalShow: val
		})
	}

	hideWizard(){
		if(this.props.onWizardHide){
			this.props.onWizardHide()
		}
	}
	modal(){

	}
	render(){
		let buttonIconComp = this.props.buttonIconComp ? this.props.buttonIconComp : <i className={this.props.buttonIcon}>&nbsp;</i>
		return (
			<>
				<button
					disabled={this.props.disabled}
					block={this.props.buttonBlock}
					hidden={this.props.hideButtonIf}
					className={this.props.buttonClassName}
					onClick={() => this.setModalShow(true)}>
					{buttonIconComp}
					{this.props.buttonTitle}
				</button>

				<MyVerticallyCenteredModal
					{...this.props}
					show={this.state.modalShow}
					onHide={() => this.setModalShow(false)}/>
			</>
		);
	}
}

export default Wizard;

function MyVerticallyCenteredModal(props) {
	let content = '<p>Pas de contenu</p>'
	let size = props.dialogSize ? props.dialogSize : 'lg'
	let hideFooter = props.hideFooter === true;
	let hideHeader = props.hideHeader === true;

	if(props.dialogContentProvider){
		content = props.dialogContentProvider(props.onHide, props.additionalParams)
	}

	return (
		<Modal
			{...props}
			centered
			size={size}
			dialogClassName={props.dialogClassName}
			aria-labelledby="contained-modal-title-vcenter"
			scrollable="true">

			<Modal.Header className={'wizard-header'} closeButton>
				<h3>{props.dialogTitle}</h3>
			</Modal.Header>

			<Modal.Body>{content}</Modal.Body>

			{!hideFooter && <Modal.Footer className={'btn-toolbar-right'}>
				<button block onClick={props.onHide}>Fermer</button>
			</Modal.Footer>
			}
		</Modal>
	);
}
