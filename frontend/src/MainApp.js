import React, { useState } from 'react';
import { Button, TextField, Typography, Card, CardContent, Box, AppBar, Toolbar, IconButton, Menu, MenuItem, RadioGroup, FormControlLabel, Radio, Select, MenuItem as SelectItem, InputLabel, FormControl } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const offersData = [
  { name: 'Seller 1', offer: 1500000 },
  { name: 'Seller 2', offer: 1200000 },
  { name: 'Seller 3', offer: 1300000 },
  { name: 'Seller 4', offer: 900000 },
];

function MainApp() {
  const [response, setResponse] = useState('');
  const [offersChartData, setOffersChartData] = useState([]);
  const [formData, setFormData] = useState({
    currentOffer: '',
    threshold: '',
    highestTeamOffer: '',
    costPerInquiry: '',
    atOrBt: 'AT',
    distributionType: 'uniform',
  });
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();  // Initialize useNavigate for redirection

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDistributionChange = (e) => {
    setFormData({
      ...formData,
      distributionType: e.target.value,
    });
  };

  const handleAtBtChange = (e) => {
    setFormData({
      ...formData,
      atOrBt: e.target.value,
    });
  };

  const sendProjectData = async () => {
    const data = {
      currentOffer: Number(formData.currentOffer),
      threshold: Number(formData.threshold),
      highestTeamOffer: Number(formData.highestTeamOffer),
      offerDistribution: { min: 900000, max: 1300000 },
      costPerInquiry: Number(formData.costPerInquiry),
      atOrBt: formData.atOrBt,
      distributionType: formData.distributionType,
    };

    const res = await fetch('http://localhost:5000/calculateBestOption', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    setResponse(result.recommendation);
    setOffersChartData(result.offers.map((value, index) => ({ name: `Offer ${index + 1}`, value })));
  };

  const redirectToSimulationForm = () => {
    navigate('/simulation-form');  // Redirect to the simulation form page
  };

  return (
    <>
      {/* Navigation Bar */}
      <AppBar position="static" sx={{ backgroundColor: '#3f51b5' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuClick}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Real Estate App
          </Typography>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose}>Home</MenuItem>
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Main Content Layout */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: 4,
          backgroundColor: '#f5f5f5',
        }}
      >
        {/* Left: Form */}
        <Card sx={{ maxWidth: 400, marginRight: 4, padding: 2 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Enter Project Data
            </Typography>
            <TextField
              label="Current Offer"
              variant="outlined"
              name="currentOffer"
              fullWidth
              margin="normal"
              value={formData.currentOffer}
              onChange={handleInputChange}
            />
            <TextField
              label="Threshold"
              variant="outlined"
              name="threshold"
              fullWidth
              margin="normal"
              value={formData.threshold}
              onChange={handleInputChange}
            />
            <TextField
              label="Highest Team Offer"
              variant="outlined"
              name="highestTeamOffer"
              fullWidth
              margin="normal"
              value={formData.highestTeamOffer}
              onChange={handleInputChange}
            />
            <TextField
              label="Cost per Inquiry"
              variant="outlined"
              name="costPerInquiry"
              fullWidth
              margin="normal"
              value={formData.costPerInquiry}
              onChange={handleInputChange}
            />

            {/* AT or BT Criteria */}
            <Typography variant="h6" sx={{ marginTop: 2 }}>
              AT or BT Criteria
            </Typography>
            <RadioGroup name="atOrBt" value={formData.atOrBt} onChange={handleAtBtChange}>
              <FormControlLabel value="AT" control={<Radio />} label="Above Threshold (AT)" />
              <FormControlLabel value="BT" control={<Radio />} label="Below Threshold (BT)" />
            </RadioGroup>

            {/* Distribution Type */}
            <FormControl fullWidth sx={{ marginTop: 2 }}>
              <InputLabel id="distribution-select-label">Distribution Type</InputLabel>
              <Select
                labelId="distribution-select-label"
                id="distributionType"
                value={formData.distributionType}
                label="Distribution Type"
                onChange={handleDistributionChange}
              >
                <SelectItem value="uniform">Uniform</SelectItem>
                <SelectItem value="normal">Normal (Gaussian)</SelectItem>
                <SelectItem value="exponential">Exponential</SelectItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
              onClick={sendProjectData}
            >
              Send Project Data
            </Button>
            <Typography variant="body1" color="textSecondary" sx={{ marginTop: 2 }}>
              Backend Response: {response || 'No response yet'}
            </Typography>
          </CardContent>
        </Card>

        {/* Right: Charts */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Offer Distribution Chart */}
          <Card sx={{ maxWidth: 600, padding: 2 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Offer Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={offersChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bar Chart of Current Offers */}
          <Card sx={{ maxWidth: 600, padding: 2 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Current Offers from Other Sellers
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={offersData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="offer" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Redirect Button */}
      <Box sx={{ textAlign: 'center', marginTop: 4 }}>
        <Button variant="contained" color="secondary" onClick={redirectToSimulationForm}>
          Go to Simulation Form
        </Button>
      </Box>
    </>
  );
}

export default MainApp;
