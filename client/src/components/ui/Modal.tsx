import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  /** Painel interno (ex.: admin com foto + QR). */
  panelClassName?: string;
}

export function Modal({ isOpen, onClose, children, title, panelClassName }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`relative my-auto flex w-full max-h-[min(100dvh-2rem,100svh-2rem)] flex-col overflow-hidden rounded-xl bg-white shadow-xl ${panelClassName ?? 'max-w-md'}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        <div className="relative shrink-0 border-b border-border px-6 pb-3 pt-6 pr-14">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-2 text-text-muted transition-colors hover:bg-surface hover:text-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medium"
            aria-label="Fechar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          {title ? (
            <h2 id="modal-title" className="text-xl font-bold text-dark">
              {title}
            </h2>
          ) : null}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-4">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
