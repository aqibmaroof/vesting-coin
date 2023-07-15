import {
  Button,
  Modal
} from "react-bootstrap";

interface modalObj {
  show: any
  hide: any
  modalData: any
  onConfirm: any
}

export default function UnstakeModalMsg({ show, hide, modalData, onConfirm }: modalObj) {
  return (
    <Modal show={show} onHide={hide} className="modal-ui">
      <Modal.Header>
        <p className="title">{modalData.title}</p>
        <span className="modalClosebtn" onClick={hide}></span>
      </Modal.Header>
      <Modal.Body className="modal-ui-body">
        <p>
          {modalData.message}
        </p>
        <div className="btn-wrp">
          <Button className="modal-btn cancel-btn" onClick={hide}>
            {modalData.btnText}
          </Button>
          <Button className="modal-btn cta-btn" onClick={onConfirm}>
            {modalData.unstakeBtnText}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}