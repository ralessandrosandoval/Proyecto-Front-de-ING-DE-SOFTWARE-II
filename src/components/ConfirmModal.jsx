import Modal from './Modal'

export default function ConfirmModal({
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p>{message}</p>
      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>
          {cancelText}
        </button>
        <button className="btn" onClick={onConfirm} disabled={loading}>
          {loading ? 'Procesando...' : confirmText}
        </button>
      </div>
    </Modal>
  )
}
