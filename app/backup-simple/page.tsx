"use client";
import { useState } from "react";
import { Box, Button, Card, CardContent, Stack, Typography, Alert, Chip } from "@mui/material";
import { Download, Storage } from "@mui/icons-material";
import { t } from "../../lib/i18n";

export default function SimpleBackupPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [lastBackup, setLastBackup] = useState<string | null>(null);

  const createBackup = async () => {
    setIsCreating(true);
    
    try {
      // Generate timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + 
                       new Date().toISOString().replace(/[:.]/g, '-').split('T')[1].split('.')[0];
      
      // Try to fetch data from APIs
      const [eventsResponse, expensesResponse, wishlistResponse] = await Promise.allSettled([
        fetch('/api/events'),
        fetch('/api/expenses'),
        fetch('/api/wishlist')
      ]);

      // Process events data
      let eventsData: Record<string, unknown>[] = [];
      if (eventsResponse.status === 'fulfilled' && eventsResponse.value.ok) {
        const eventsResult = await eventsResponse.value.json();
        eventsData = eventsResult.events?.filter((e: Record<string, unknown>) => e.title && !e.display) || [];
      }

      // Process expenses data
      let expensesData: Record<string, unknown>[] = [];
      if (expensesResponse.status === 'fulfilled' && expensesResponse.value.ok) {
        const expensesResult = await expensesResponse.value.json();
        expensesData = expensesResult.expenses || [];
      }

      // Process wishlist data
      let wishlistData: Record<string, unknown>[] = [];
      if (wishlistResponse.status === 'fulfilled' && wishlistResponse.value.ok) {
        const wishlistResult = await wishlistResponse.value.json();
        wishlistData = wishlistResult.items || [];
      }

      // Create CSV content
      const eventsCSV = createCSV(eventsData, [
        'id', 'title', 'start', 'end', 'allDay', 'owner', 'createdAt', 'updatedAt'
      ]);
      
      const expensesCSV = createCSV(expensesData, [
        'id', 'description', 'amountCents', 'date', 'paidBy', 'createdAt'
      ]);
      
      const wishlistCSV = createCSV(wishlistData, [
        'id', 'title', 'url', 'description', 'proposedBy', 'createdAt'
      ]);

      // Download files
      downloadCSV(`${timestamp}_boat-events.csv`, eventsCSV);
      downloadCSV(`${timestamp}_expenses.csv`, expensesCSV);
      downloadCSV(`${timestamp}_wishlist.csv`, wishlistCSV);

      setLastBackup(new Date().toLocaleString('de-DE'));
      
      alert(`Backup erfolgreich erstellt!\n\nDateien:\n- ${timestamp}_boat-events.csv\n- ${timestamp}_expenses.csv\n- ${timestamp}_wishlist.csv\n\nDatensätze:\n- Events: ${eventsData.length}\n- Ausgaben: ${expensesData.length}\n- Wunschliste: ${wishlistData.length}`);
      
    } catch (error) {
      console.error('Backup error:', error);
      alert('Fehler beim Erstellen des Backups. Bitte versuchen Sie es erneut.');
    } finally {
      setIsCreating(false);
    }
  };

  const createCSV = (data: Record<string, unknown>[], headers: string[]): string => {
    if (data.length === 0) {
      return headers.join(',') + '\n';
    }
    
    const csvHeaders = headers.join(',');
    const csvRows = data.map(row => 
      headers.map(header => {
        const value = row[header];
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      }).join(',')
    );
    return [csvHeaders, ...csvRows].join('\n');
  };

  const downloadCSV = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
      <Card>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Storage color="primary" sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h5" fontWeight={600}>
                {t('backup.title')}
              </Typography>
              <Typography color="text.secondary">
                {t('backup.subtitle')}
              </Typography>
            </Box>
          </Stack>

          <Alert severity="info" sx={{ mb: 3 }}>
            Diese einfache Backup-Funktion erstellt CSV-Dateien direkt in Ihrem Browser.
            Die Dateien werden automatisch heruntergeladen.
          </Alert>

          <Stack spacing={2}>
            <Button
              variant="contained"
              size="large"
              onClick={createBackup}
              disabled={isCreating}
              startIcon={<Download />}
              fullWidth
              sx={{ py: 2 }}
            >
              {isCreating ? 'Backup wird erstellt...' : 'Backup erstellen'}
            </Button>

            {lastBackup && (
              <Alert severity="success">
                Letztes Backup: {lastBackup}
              </Alert>
            )}
          </Stack>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Was wird gesichert:
            </Typography>
            <Stack spacing={1}>
              <Chip label="Boat Events (Kalender)" color="primary" />
              <Chip label="Expenses (Ausgaben)" color="primary" />
              <Chip label="Wishlist (Wunschliste)" color="primary" />
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
