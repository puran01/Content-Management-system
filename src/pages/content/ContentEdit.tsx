import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  CircularProgress,
  SelectChangeEvent,
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

// Mock function to simulate API call
const saveContent = async (data: any) => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Saving content:', data);
      resolve({ success: true, data: { ...data, id: data.id || Date.now().toString() } });
    }, 1000);
  });
};

// Mock function to fetch content by ID
const fetchContent = async (id: string) => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockData = {
        id,
        title: 'Sample Content',
        slug: 'sample-content',
        content: 'This is the content body.',
        status: 'draft',
        excerpt: 'A brief excerpt of the content.',
      };
      resolve({ data: id === 'new' ? {
        title: '',
        slug: '',
        content: '',
        status: 'draft',
        excerpt: '',
      } : mockData });
    }, 500);
  });
};

const ContentEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    status: 'draft',
    excerpt: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isNew = id === 'new';

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const response: any = await fetchContent(id || 'new');
        setFormData(response.data);
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name as string]) {
      setErrors(prev => ({
        ...prev,
        [name as string]: '',
      }));
    }
  };
  
  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value,
    }));
    
    // Clear error when user selects an option
    if (errors[name as string]) {
      setErrors(prev => ({
        ...prev,
        [name as string]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      await saveContent(formData);
      // Navigate back to the content list after successful save
      navigate('/content');
    } catch (error) {
      console.error('Error saving content:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          {isNew ? 'Add New Content' : 'Edit Content'}
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                margin="normal"
                error={!!errors.title}
                helperText={errors.title}
                required
              />
              
              <TextField
                fullWidth
                label="Slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                margin="normal"
                error={!!errors.slug}
                helperText={errors.slug || 'URL-friendly version of the title'}
                required
              />
              
              <TextField
                fullWidth
                label="Excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={3}
              />
              
              <TextField
                fullWidth
                label="Content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={10}
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Publish
                </Typography>
                <Divider sx={{ my: 2 }} />
                
                <FormControl fullWidth margin="normal">
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    name="status"
                    value={formData.status}
                    onChange={handleSelectChange}
                    label="Status"
                  >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                    <MenuItem value="archived">Archived</MenuItem>
                  </Select>
                </FormControl>
                
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(-1)}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default ContentEdit;
