"use client";
import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, CircularProgress, Chip } from "@mui/material";
import { AccountBalanceWallet } from "@mui/icons-material";

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
          <Card sx={{ 
        borderRadius: 2, 
        bgcolor: 'rgba(25,118,210,0.08)',
        border: '1px solid rgba(25,118,210,0.2)'
      }}>
        <CardContent sx={{ py: 2, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1, gap: 1 }}>
            <AccountBalanceWallet color="primary" sx={{ fontSize: 20 }} />
            <Typography variant="subtitle2" fontWeight={600} color="primary">
              PayPal Balance
            </Typography>
            <Chip 
              label={balance.isMock ? "Demo" : "Live"} 
              size="small" 
              color={balance.isMock ? "warning" : "success"} 
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
          </Box>
          
          <Typography variant="h5" fontWeight={700} color="primary" sx={{ mb: 0.5 }}>
            {formatCurrency(balance.balance, balance.currency)}
          </Typography>
          
          <Typography variant="caption" color="text.secondary" display="block">
            Account: {balance.accountEmail}
          </Typography>
          
          <Typography variant="caption" color="text.secondary" display="block">
            Last updated: {formatDate(balance.lastUpdated)}
          </Typography>
          {balance.isMock && (
            <Typography variant="caption" color="warning.main" display="block" sx={{ mt: 0.5 }}>
              Demo mode - Add PayPal credentials to see real balance
            </Typography>
          )}
        </CardContent>
      </Card>
  );
}
