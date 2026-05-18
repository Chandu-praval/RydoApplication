import "./ConfirmModal.scss"
interface IConfirmModalProps{
    isOpenModal:boolean,
    closeModal: () => void;
    confirmText:string,
    confirmBtnText:string,
    submit:()=>void,
}
function ConfirmModal({isOpenModal,closeModal,confirmText,confirmBtnText,submit}:IConfirmModalProps){
    if(!isOpenModal){
        return null;
    }
    return(
        <div>
            <div className="modal fade show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0">
              <div className="modal-header">
                <h5 className="modal-title">
                  Confirm {confirmBtnText}
                </h5>
                <button
                  className="btn-close"
                  onClick={closeModal}
                />
              </div>
              <div className="modal-body text-center d-flex justify-content-center py-4">
                <h5>Do you want to {confirmText}</h5>
              </div>
              <div className="modal-footer d-flex justify-content-between">
                <button
                  className="btn btn-secondary p-2"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary p-2"
                  onClick={submit}
                >
                  Confirm {confirmBtnText}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal-backdrop fade show"
          onClick={closeModal}
        />
        </div>
    );
}
export default ConfirmModal;