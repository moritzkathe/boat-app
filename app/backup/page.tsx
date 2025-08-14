"use client";
import { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  TextField,
  Alert,
  Stack,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress
} from "@mui/material";
import { 
  Download, 
  Refresh, 
  Security,
  Storage,
  Schedule
} from "@mui/icons-material";

interface BackupFile {
  name: string;
  size: string;
  date: string;
  url: string;
}

interface BackupInfo {
  files: BackupFile[];
  totalBackups: number;
  lastBackup: string;
}

export default function BackupPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [backupInfo, setBackupInfo] = useState<BackupInfo | null>(null);
  const [creatingBackup, setCreatingBackup] = useState(false);

  const BACKUP_PASSWORD = "736rsf3";

  const handleLogin = () => {
    if (password === BACKUP_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
      fetchBackupInfo();
    } else {
      setError("Falsches Passwort");
    }
  };

  const fetchBackupInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/backup?password=${BACKUP_PASSWORD}`);
      if (response.ok) {
        const data = await response.json();
        
        // Parse backup files from the response
        const files: BackupFile[] = data.files?.map((filename: string) => ({
          name: filename,
          size: "N/A", // We'll get this from file system
          date: filename.split('_')[0] + ' ' + filename.split('_')[1]?.replace(/-/g, ':'),
          url: `/backups/${filename}`
        })) || [];

        setBackupInfo({
          files,
          totalBackups: files.length,
          lastBackup: files[0]?.date || "Keine Backups"
        });
      }
    } catch (error) {
      console.error('Error fetching backup info:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async () => {
    setCreatingBackup(true);
    try {
      const response = await fetch('/api/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: BACKUP_PASSWORD }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Backup erfolgreich erstellt!\n\nDateien:\n${data.files.join('\n')}\n\nDatensätze:\n- Events: ${data.records.boatEvents}\n- Ausgaben: ${data.records.expenses}\n- Wunschliste: ${data.records.wishlistItems}`);
        fetchBackupInfo(); // Refresh the list
      } else {
        alert('Fehler beim Erstellen des Backups');
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      alert('Fehler beim Erstellen des Backups');
    } finally {
      setCreatingBackup(false);
    }
  };

  const downloadFile = (filename: string) => {
    const url = `/backups/${filename}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBackupInfo();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Security color="primary" sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h5" fontWeight={600}>
                  Datenbank Backup
                </Typography>
                <Typography color="text.secondary">
                  Passwortgeschützter Zugang zu Backup-Dateien
                </Typography>
              </Box>
            </Stack>

            <Stack spacing={2}>
              <TextField
                type="password"
                label="Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                fullWidth
                autoFocus
              />
              
              {error && (
                <Alert severity="error">
                  {error}
                </Alert>
              )}
              
              <Button
                variant="contained"
                onClick={handleLogin}
                disabled={!password.trim()}
                fullWidth
              >
                Anmelden
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
      <Card>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Storage color="primary" sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h5" fontWeight={600}>
                Backup Verwaltung
              </Typography>
              <Typography color="text.secondary">
                Datenbank-Backups verwalten und herunterladen
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Chip 
              icon={<Schedule />} 
              label={`Letztes Backup: ${backupInfo?.lastBackup || 'Unbekannt'}`} 
              color="info" 
            />
            <Chip 
              label={`${backupInfo?.totalBackups || 0} Backups verfügbar`} 
              color="success" 
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={fetchBackupInfo}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : 'Aktualisieren'}
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={createBackup}
              disabled={creatingBackup}
            >
              {creatingBackup ? <CircularProgress size={20} /> : 'Neues Backup erstellen'}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Verfügbare Backups
          </Typography>
          
          <Alert severity="info" sx={{ mb: 2 }}>
            Es werden automatisch nur die 3 neuesten Backups gespeichert. Ältere werden gelöscht.
          </Alert>

          {backupInfo?.files && backupInfo.files.length > 0 ? (
            <List>
              {backupInfo.files.map((file, index) => (
                <Box key={file.name}>
                  <ListItem>
                    <ListItemText
                      primary={file.name}
                      secondary={`Erstellt: ${file.date}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => downloadFile(file.name)}
                        title="Download"
                      >
                        <Download />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < backupInfo.files.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              Keine Backups verfügbar. Erstellen Sie Ihr erstes Backup.
            </Typography>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Backup-Informationen
          </Typography>
          
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              <strong>Backup-Inhalt:</strong> Alle Boot-Events, Ausgaben und Wunschliste-Einträge
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Format:</strong> CSV-Dateien (kompatibel mit Excel, Google Sheets)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Speicherung:</strong> 3 neueste Backups werden automatisch behalten
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Zugriff:</strong> Direkte Download-Links für alle Backup-Dateien
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
