import React from 'react';
import {Modal} from 'react-bootstrap'
import Button from 'react-bootstrap/Button'

class WizardConfirm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
        }

        this.setModalShow = this.setModalShow.bind(this)
    }

    setModalShow(val) {
        this.setState({
            modalShow: val
        })
    }

    onConfirm() {
        if (this.props.onConfirm) {
            this.props.onConfirm()
        }

        if (this.props.onConfirmAndClose) {
            const close = () =>  this.setModalShow(false)
            this.props.onConfirmAndClose(close)
        }
        else {
            this.setModalShow(false)
        }
    }

    render() {
        const needsConfirmation = !this.props.needsConfirmation || this.props.needsConfirmation === true;
        return <>
            <Button
                className={this.props.buttonClassName ? this.props.buttonClassName : ''}
                disabled={this.props.disabled}
                onClick={() => needsConfirmation ? this.setModalShow(true) : this.onConfirm()}>

                {this.props.buttonIconComp ? this.props.buttonIconComp : <i className={this.props.buttonIcon}></i>}
                {this.props.buttonTitle ? <>&nbsp;{this.props.buttonTitle}</> : ''}

            </Button>

            <Confirm
                {...this.props}
                show={this.state.modalShow}
                onConfirm={() => this.onConfirm()}
                onHide={() => this.setModalShow(false)}/>
        </>
    }
}

export default WizardConfirm;

function Confirm(props) {
    let wizardButtonTitle = props.buttonTitle && props.buttonTitle.length > 0 ? props.buttonTitle : 'YES';
    let modalSize = props.modalSize ? props.modalSize : 'md';

    return (
        <Modal
            {...props}
            size={modalSize}
            centered
            aria-labelledby="contained-modal-title-vtop">

            <Modal.Header>
                <h3>Confirm</h3>
            </Modal.Header>

            <Modal.Body>
                <div className={props.bodyClassName ? props.bodyClassName : 'display-6'}>
                    {props.dialogMessage}
                    {props.dialogContent ? props.dialogContent() : ''}
                </div>
            </Modal.Body>

            <Modal.Footer>
                <div className="btn-toolbar">
                    <Button onClick={props.onConfirm}>{wizardButtonTitle}</Button>
                    <Button variant="secondary" size="md" onClick={props.onHide}>CANCEL</Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
}
