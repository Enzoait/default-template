import React from 'react';
import Modal from 'react-bootstrap/Modal'
import Spinner from 'react-bootstrap/Spinner'

export default function ProcessingModal(props) {
  return (
    <>
      <Modal
      	centered
      	size='sm'
      	className="processing-modal"
        show={props.show}
        backdrop="static"
        keyboard={false}>
        <Modal.Body><Spinner animation="border" variant="warning" /></Modal.Body>
      </Modal>
    </>
  );
}
