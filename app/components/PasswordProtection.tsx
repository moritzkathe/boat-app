"use client";
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
} from '@mui/material';


interface PasswordProtectionProps {
  children: React.ReactNode;
}

export default function PasswordProtection({ children }: PasswordProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('boat-app-authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simple password check - you can change this password
    const correctPassword = 'boat2024'; // Change this to your desired password

    if (password === correctPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('boat-app-authenticated', 'true');
      setPassword('');
    } else {
      setError('Falsches Passwort. Bitte versuchen Sie es erneut.');
    }

    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('boat-app-authenticated');
  };

  if (isAuthenticated) {
    return (
      <>
        {children}
      </>
    );
  }

  return (
    <Dialog
      open={true}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      onClose={() => {}} // Prevent closing
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogContent sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 3 }}>
          <img 
            src="/logo.svg" 
            alt="Logo" 
            style={{ 
              width: 80, 
              height: 80, 
              display: 'block', 
              margin: '0 auto 16px'
            }} 
          />
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h5" fontWeight={600}>
              Cranchi Clipper
            </Typography>
          </DialogTitle>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Bitte geben Sie das Passwort ein, um fortzufahren
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passwort eingeben"
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.02)',
                },
                '&.Mui-focused': {
                  backgroundColor: 'rgba(0,0,0,0.02)',
                },
              },
            }}
            autoFocus
          />
          
          {error && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isLoading || !password.trim()}
            sx={{
              mt: 2,
              py: 1.5,
            }}
          >
            {isLoading ? 'Überprüfe...' : 'Anmelden'}
          </Button>
        </Box>

        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ mt: 3, display: 'block' }}
        >
          Nur für autorisierte Benutzer
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
