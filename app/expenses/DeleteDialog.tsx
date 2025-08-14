"use client";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText } from "@mui/material";
import { t } from "@/lib/i18n";

export default function ExpenseDeleteDialog({ 
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
      <DialogTitle>{t('expenses.deleteTitle')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('expenses.deleteMessage')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('expenses.deleteCancel')}</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          {t('expenses.deleteConfirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
