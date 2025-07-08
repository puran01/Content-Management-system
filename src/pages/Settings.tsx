import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import { Save as SaveIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  };
}

const Settings = () => {
  const [tabValue, setTabValue] = useState(0);
  const [settings, setSettings] = useState({
    siteTitle: 'Content Management System',
    siteDescription: 'A modern content management system',
    timezone: 'UTC',
    dateFormat: 'MMMM d, yyyy',
    timeFormat: 'h:mm a',
    postsPerPage: 10,
    enableComments: true,
    maintenanceMode: false,
  });
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'Administrator' },
    { id: 2, name: 'Editor User', email: 'editor@example.com', role: 'Editor' },
    { id: 3, name: 'Author User', email: 'author@example.com', role: 'Author' },
  ]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would be an API call
    console.log('Saving settings:', settings);
    showSnackbar('Settings saved successfully!', 'success');
  };

  const handleDeleteUser = (id: number) => {
    // In a real app, this would be an API call
    setUsers(users.filter(user => user.id !== id));
    showSnackbar('User deleted successfully!', 'success');
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="settings tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="General" {...a11yProps(0)} />
            <Tab label="Reading" {...a11yProps(1)} />
            <Tab label="Discussion" {...a11yProps(2)} />
            <Tab label="Users" {...a11yProps(3)} />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Site Title"
                name="siteTitle"
                value={settings.siteTitle}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Site Description"
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={3}
              />
              <TextField
                fullWidth
                label="Timezone"
                name="timezone"
                value={settings.timezone}
                onChange={handleChange}
                margin="normal"
                select
                SelectProps={{ native: true }}
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.maintenanceMode}
                    onChange={handleChange}
                    name="maintenanceMode"
                    color="primary"
                  />
                }
                label="Maintenance Mode"
                sx={{ display: 'block', mb: 2 }}
              />
              <Typography variant="body2" color="textSecondary" gutterBottom>
                When enabled, only administrators will be able to access the site.
              </Typography>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSaveSettings}
            >
              Save Changes
            </Button>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Blog pages show at most"
                name="postsPerPage"
                type="number"
                value={settings.postsPerPage}
                onChange={handleChange}
                margin="normal"
                inputProps={{ min: 1, max: 100 }}
              />
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Number of items to show per page
              </Typography>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSaveSettings}
            >
              Save Changes
            </Button>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableComments}
                    onChange={handleChange}
                    name="enableComments"
                    color="primary"
                  />
                }
                label="Allow comments on new articles"
              />
              <Typography variant="body2" color="textSecondary" gutterBottom>
                These settings may be overridden for individual articles.
              </Typography>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSaveSettings}
            >
              Save Changes
            </Button>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <Button variant="contained" color="primary" sx={{ mb: 2 }}>
            Add New User
          </Button>
          
          <Paper>
            <List>
              {users.map((user) => (
                <React.Fragment key={user.id}>
                  <ListItem>
                    <ListItemText
                      primary={user.name}
                      secondary={`${user.email} • ${user.role}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={() => handleDeleteUser(user.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </TabPanel>
      </Paper>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;
