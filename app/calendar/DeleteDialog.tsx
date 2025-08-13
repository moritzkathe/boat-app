"use client";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText } from "@mui/material";
import { t } from "@/lib/i18n";

export default function DeleteDialog({ 
  open, 
  onClose, 
  onConfirm 
}: { 
  open: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('calendar.deleteTitle')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('calendar.deleteMessage')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('calendar.deleteCancel')}</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          {t('calendar.deleteConfirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
