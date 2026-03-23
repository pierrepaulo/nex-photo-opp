import { QRCodeSVG } from 'qrcode.react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { AdminPhotoRow } from '@/types';

const QR_SIZE = 200;

interface PhotoModalProps {
  photo: AdminPhotoRow | null;
  isOpen: boolean;
  onClose: () => void;
}

function buildDownloadUrl(token: string): string {
  return `${window.location.origin}/download/${token}`;
}

export function PhotoModal({ photo, isOpen, onClose }: PhotoModalProps) {
  if (!photo) return null;

  const downloadUrl = buildDownloadUrl(photo.downloadToken);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="QR Code para download" panelClassName="max-w-lg">
      <div className="flex flex-col items-center gap-3 sm:gap-4">
        <div className="w-full shrink-0 overflow-hidden rounded-lg border border-border bg-surface">
          <img
            src={photo.framedUrl}
            alt="Foto com moldura"
            className="mx-auto max-h-[min(32dvh,240px)] w-full object-contain sm:max-h-[min(42dvh,300px)]"
          />
        </div>
        <p className="shrink-0 text-center text-sm text-text-secondary">
          Escaneie para abrir a página de download desta foto.
        </p>
        <div className="flex w-full shrink-0 justify-center rounded-xl border-2 border-border bg-white p-3 sm:p-4">
          <QRCodeSVG
            value={downloadUrl}
            size={QR_SIZE}
            level="M"
            includeMargin={false}
            className="h-auto max-w-full"
          />
        </div>
        <div className="sticky bottom-0 w-full shrink-0 bg-white pt-3 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))]">
          <Button type="button" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
