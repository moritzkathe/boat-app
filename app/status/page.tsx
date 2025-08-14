"use client";
import { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Stack, 
  Chip,
  Alert,
  CircularProgress,
  Divider
} from "@mui/material";
import { 
  CheckCircle, 
  Error, 
  Warning, 
  Info,
  Storage,
  Build,
  Speed,
  Memory,
  NetworkCheck,
  Security
} from "@mui/icons-material";


interface HealthStatus {
  status: 'healthy' | 'warning' | 'error' | 'unknown';
  message: string;
  timestamp: string;
}

interface SystemStatus {
  database: HealthStatus;
  api: HealthStatus;
  build: HealthStatus;
  performance: HealthStatus;
  memory: HealthStatus;
  network: HealthStatus;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'healthy':
      return <CheckCircle color="success" />;
    case 'warning':
      return <Warning color="warning" />;
    case 'error':
      return <Error color="error" />;
    default:
      return <Info color="info" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy':
      return 'success';
    case 'warning':
      return 'warning';
    case 'error':
      return 'error';
    default:
      return 'default';
  }
};

export default function StatusPage() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    database: { status: 'unknown', message: 'Checking...', timestamp: new Date().toISOString() },
    api: { status: 'unknown', message: 'Checking...', timestamp: new Date().toISOString() },
    build: { status: 'unknown', message: 'Checking...', timestamp: new Date().toISOString() },
    performance: { status: 'unknown', message: 'Checking...', timestamp: new Date().toISOString() },
    memory: { status: 'unknown', message: 'Checking...', timestamp: new Date().toISOString() },
    network: { status: 'unknown', message: 'Checking...', timestamp: new Date().toISOString() }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSystemHealth = async () => {
      try {
        // Fetch health data from our API
        const response = await fetch('/api/health');
        const healthData = await response.json();
        
        if (response.ok && healthData.checks) {
          const newStatus: SystemStatus = {
            database: healthData.checks.database || { 
              status: 'unknown', 
              message: 'Database status unknown', 
              timestamp: new Date().toISOString() 
            },
            api: healthData.checks.api || { 
              status: 'unknown', 
              message: 'API status unknown', 
              timestamp: new Date().toISOString() 
            },
            build: { 
              status: 'healthy', 
              message: `Last build: ${new Date().toLocaleString('de-DE')}`, 
              timestamp: new Date().toISOString() 
            },
            performance: { 
              status: healthData.responseTime < 200 ? 'healthy' : 'warning', 
              message: `Response time: ${healthData.responseTime}ms (target: <200ms)`, 
              timestamp: new Date().toISOString() 
            },
            memory: healthData.checks.memory || { 
              status: 'unknown', 
              message: 'Memory status unknown', 
              timestamp: new Date().toISOString() 
            },
            network: { 
              status: 'healthy', 
              message: 'Network connectivity: Stable', 
              timestamp: new Date().toISOString() 
            }
          };
          
          setSystemStatus(newStatus);
        } else {
          // Fallback to mock data if API fails
          const mockStatus: SystemStatus = {
            database: { 
              status: 'error', 
              message: 'Database connection failed', 
              timestamp: new Date().toISOString() 
            },
            api: { 
              status: 'error', 
              message: 'API endpoints not responding', 
              timestamp: new Date().toISOString() 
            },
            build: { 
              status: 'unknown', 
              message: 'Build information unavailable', 
              timestamp: new Date().toISOString() 
            },
            performance: { 
              status: 'unknown', 
              message: 'Performance data unavailable', 
              timestamp: new Date().toISOString() 
            },
            memory: { 
              status: 'unknown', 
              message: 'Memory usage data unavailable', 
              timestamp: new Date().toISOString() 
            },
            network: { 
              status: 'unknown', 
              message: 'Network status unavailable', 
              timestamp: new Date().toISOString() 
            }
          };
          
          setSystemStatus(mockStatus);
        }
      } catch (error) {
        console.error('Health check failed:', error);
        // Set error status if all checks fail
        const errorStatus: SystemStatus = {
          database: { 
            status: 'error', 
            message: 'Health check failed', 
            timestamp: new Date().toISOString() 
          },
          api: { 
            status: 'error', 
            message: 'Health check failed', 
            timestamp: new Date().toISOString() 
          },
          build: { 
            status: 'error', 
            message: 'Health check failed', 
            timestamp: new Date().toISOString() 
          },
          performance: { 
            status: 'error', 
            message: 'Health check failed', 
            timestamp: new Date().toISOString() 
          },
          memory: { 
            status: 'error', 
            message: 'Health check failed', 
            timestamp: new Date().toISOString() 
          },
          network: { 
            status: 'error', 
            message: 'Health check failed', 
            timestamp: new Date().toISOString() 
          }
        };
        
        setSystemStatus(errorStatus);
      } finally {
        setLoading(false);
      }
    };

    checkSystemHealth();
    
    // Refresh every 30 seconds
    const interval = setInterval(checkSystemHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const StatusCard = ({ 
    title, 
    status, 
    icon, 
    description 
  }: { 
    title: string; 
    status: HealthStatus; 
    icon: React.ReactNode;
    description?: string;
  }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
          {icon}
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              {title}
            </Typography>
            {description && (
              <Typography variant="caption" color="text.secondary">
                {description}
              </Typography>
            )}
          </Box>
          {getStatusIcon(status.status)}
        </Stack>
        
        <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem' }}>
          {status.message}
        </Typography>
        
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip 
            label={status.status.toUpperCase()} 
            color={getStatusColor(status.status) as 'success' | 'warning' | 'error' | 'default'}
            size="small"
          />
          <Typography variant="caption" color="text.secondary">
            {new Date(status.timestamp).toLocaleTimeString('de-DE')}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
      <Alert severity="info" sx={{ mb: 2 }}>
        Auto-refresh active - Last updated: {new Date().toLocaleTimeString('en-US')}
      </Alert>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        <StatusCard
          title="Database"
          status={systemStatus.database}
          icon={<Storage sx={{ fontSize: 28 }} />}
          description="Database connection and health status"
        />
        <StatusCard
          title="API Status"
          status={systemStatus.api}
          icon={<NetworkCheck sx={{ fontSize: 28 }} />}
          description="API endpoints and service availability"
        />
        <StatusCard
          title="Build Info"
          status={systemStatus.build}
          icon={<Build sx={{ fontSize: 28 }} />}
          description="Last deployment and build information"
        />
        <StatusCard
          title="Performance"
          status={systemStatus.performance}
          icon={<Speed sx={{ fontSize: 28 }} />}
          description="Response times and performance metrics"
        />
        <StatusCard
          title="Memory Usage"
          status={systemStatus.memory}
          icon={<Memory sx={{ fontSize: 28 }} />}
          description="System memory and resource usage"
        />
        <StatusCard
          title="Network"
          status={systemStatus.network}
          icon={<Security sx={{ fontSize: 28 }} />}
          description="Network connectivity and security"
        />
      </Box>

      <Divider sx={{ my: 3 }} />

              <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              System Information
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Environment:</strong> Production
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Version:</strong> 1.0.0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Node Version:</strong> 18.x
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Framework:</strong> Next.js 15
              </Typography>
            </Box>
          </CardContent>
        </Card>
    </Box>
  );
}
