"use client";
import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, CircularProgress, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, InputAdornment } from "@mui/material";
import { AccountBalanceWallet, Edit } from "@mui/icons-material";

type PayPalBalance = {
  balance: number;
  currency: string;
  lastUpdated: string;
  accountEmail: string;
  isMock?: boolean;
  error?: string;
};

export default function PayPalBalanceCard() {
  const [balance, setBalance] = useState<PayPalBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editBalance, setEditBalance] = useState<string>('');
  const [updating, setUpdating] = useState(false);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/paypal-balance");
      if (!response.ok) {
        throw new Error("Failed to fetch balance");
      }
      const data = await response.json();
      setBalance(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const updateBalance = async () => {
    try {
      setUpdating(true);
      setError(null); // Clear any previous errors
      
      // Validate and convert German number format
      const normalizedBalance = editBalance.replace(',', '.');
      const balanceValue = parseFloat(normalizedBalance);
      
      if (isNaN(balanceValue) || balanceValue < 0) {
        throw new Error("Bitte geben Sie einen gültigen Betrag ein");
      }
      
      const response = await fetch("/api/paypal-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          balance: balanceValue
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Fehler beim Aktualisieren des Guthabens");
      }

      const updatedBalance = await response.json();
      setBalance(updatedBalance);
      setEditDialogOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Aktualisieren des Guthabens");
    } finally {
      setUpdating(false);
    }
  };

  const handleEditClick = () => {
    if (balance) {
      // Format balance for German display (comma as decimal separator)
      setEditBalance(balance.balance.toString().replace('.', ','));
      setEditDialogOpen(true);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('de-DE', { 
      style: 'currency', 
      currency: currency 
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card sx={{ borderRadius: 2, bgcolor: 'rgba(25,118,210,0.08)' }}>
        <CardContent sx={{ textAlign: 'center', py: 3 }}>
          <CircularProgress size={24} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Loading PayPal balance...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ borderRadius: 2, bgcolor: 'rgba(244,67,54,0.08)' }}>
        <CardContent sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="body2" color="error">
            Error loading balance: {error}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!balance) {
    return null;
  }

    return (
    <>
      <Card 
        sx={{ 
          borderRadius: 2, 
          bgcolor: 'rgba(25,118,210,0.08)',
          border: '1px solid rgba(25,118,210,0.2)',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'rgba(25,118,210,0.12)',
            border: '1px solid rgba(25,118,210,0.3)'
          },
          transition: 'all 0.2s ease-in-out'
        }}
        onClick={handleEditClick}
      >
        <CardContent sx={{ py: 2, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
            <Typography variant="subtitle2" fontWeight={600} color="primary">
              PayPal Guthaben
            </Typography>
          </Box>
          
          <Typography variant="h5" fontWeight={700} color="primary" sx={{ mb: 0.5 }}>
            {formatCurrency(balance.balance, balance.currency)}
          </Typography>
          
          <Typography variant="caption" color="text.secondary" display="block">
            {balance.balance === 0 ? 'Aktualisierung erforderlich' : `Zuletzt aktualisiert: ${formatDate(balance.lastUpdated)}`}
          </Typography>
          
          <Typography variant="caption" color="primary" display="block" sx={{ mt: 0.5, fontStyle: 'italic' }}>
            Klicken zum Bearbeiten
          </Typography>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>PayPal Guthaben aktualisieren</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="PayPal Guthaben"
              type="text"
              value={editBalance}
              onChange={(e) => setEditBalance(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">€</InputAdornment>,
              }}
              placeholder="0,00"
              fullWidth
            />
            {error && (
              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} disabled={updating}>
            Abbrechen
          </Button>
          <Button 
            onClick={updateBalance} 
            variant="contained" 
            disabled={updating || !editBalance || isNaN(parseFloat(editBalance.replace(',', '.'))) || parseFloat(editBalance.replace(',', '.')) < 0}
          >
            {updating ? 'Wird aktualisiert...' : 'Guthaben aktualisieren'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
