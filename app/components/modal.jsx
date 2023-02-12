import Modal from 'react-modal'
import { IconX } from '@tabler/icons-react'

Modal.setAppElement('#modal')

export const XModal = ({ title = '', close, children, submit, isLoading = false, isDisabled = false }) => {
   return (
      <Modal isOpen={true} onRequestClose={close}>
         <header className="modal__header">
            <h3>{title}</h3>
            <button className="btn btn-ghost btn-icon" onClick={close}>
               <IconX color="white" size={16} />
            </button>
         </header>
         <main className="modal__content">{children}</main>
         <footer className="modal__footer">
            <button className="btn btn-outline" onClick={close}>
               Close
            </button>
            <button className="btn btn-success" disabled={isDisabled} {...(submit && { onClick: submit })}>
               {isLoading && (
                  <>
                     <IconLoader2 size={16} className="rotate" />
                     <div className="spacer-2xs" />
                  </>
               )}
               Submit
            </button>
         </footer>
      </Modal>
   )
}
