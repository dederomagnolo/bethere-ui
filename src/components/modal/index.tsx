import ReactModal from 'react-modal'

ReactModal.setAppElement('#root');

export const Modal = ({
  children,
  isOpen,
  onRequestClose,
  showCloseButton = true
}: ReactModal.Props & { showCloseButton?: boolean }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}>
      {children}
    </ReactModal>
  )
}