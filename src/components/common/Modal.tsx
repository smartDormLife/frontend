import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Button } from './Button'

interface ModalProps {
  open: boolean
  title: string
  description?: string
  onClose: () => void
  onConfirm?: () => void
  confirmText?: string
  cancelText?: string
  children?: ReactNode
}

export function Modal({
  open,
  title,
  description,
  onClose,
  onConfirm,
  confirmText = '확인',
  cancelText = '취소',
  children,
}: ModalProps) {
  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-surface-100">
        <div className="mb-4 space-y-2">
          <h3 className="text-lg font-semibold text-surface-900">{title}</h3>
          {description && <p className="text-sm text-surface-600">{description}</p>}
        </div>
        {children && <div className="mb-6 text-sm text-surface-800">{children}</div>}
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            {cancelText}
          </Button>
          {onConfirm && (
            <Button variant="primary" onClick={onConfirm}>
              {confirmText}
            </Button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
