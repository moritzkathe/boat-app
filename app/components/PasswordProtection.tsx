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
        <Box
          sx={{
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <Button
            variant="outlined"
            size="small"
            onClick={handleLogout}
            sx={{ fontSize: '0.75rem' }}
          >
            Abmelden
          </Button>
        </Box>
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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
              margin: '0 auto 16px',
              filter: 'brightness(0) invert(1)'
            }} 
          />
          <DialogTitle sx={{ color: 'white', pb: 1 }}>
            <Typography variant="h5" fontWeight={600}>
              Cranchi Clipper
            </Typography>
          </DialogTitle>
          <Typography variant="body1" color="rgba(255,255,255,0.8)" sx={{ mb: 3 }}>
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
                backgroundColor: 'rgba(255,255,255,0.9)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,1)',
                },
                '&.Mui-focused': {
                  backgroundColor: 'rgba(255,255,255,1)',
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
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.3)',
              },
              '&:disabled': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)',
              },
            }}
          >
            {isLoading ? 'Überprüfe...' : 'Anmelden'}
          </Button>
        </Box>

        <Typography 
          variant="caption" 
          color="rgba(255,255,255,0.6)" 
          sx={{ mt: 3, display: 'block' }}
        >
          Nur für autorisierte Benutzer
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
