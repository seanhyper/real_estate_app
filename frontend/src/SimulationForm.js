import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    TextField,
    Box,
    Card,
    CardContent,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormControl,
    InputLabel,
    Select,
    MenuItem as SelectItem,
    IconButton,
    Menu,
    MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Logo from './logo.png';  // Import a logo or use a placeholder image

function SimulationForm() {
    const [formData, setFormData] = useState({
        num_agents: 10,
        threshold: 800000,
        cost_per_inquiry: 10000,
        rounds: 10,
        atOrBt: 'AT', // Default to AT
        distributionType: 'uniform', // Default to Uniform distribution
        minValue: 500000,
        maxValue: 2000000
    });

    const [anchorEl, setAnchorEl] = useState(null);  // For managing the dropdown menu
    const navigate = useNavigate();

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleHomeClick = () => {
        navigate('/main');  // Redirect to the main endpoint
    };

    const handleSimulationFormClick = () => {
        navigate('/simulation-form');  // Redirect to the simulation form page
    };

    const handleRunAuctionClick = () => {
        navigate('/run-auction');  // Redirect to the run auction page
    };

    const handleAtBtChange = (e) => {
        setFormData({
            ...formData,
            atOrBt: e.target.value,
        });
    };

    const handleDistributionChange = (e) => {
        setFormData({
            ...formData,
            distributionType: e.target.value,
        });
    };

    const handleSubmit = async () => {
        const response = await fetch('http://localhost:5000/start_simulation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        // Store the result in localStorage for the simulation page
        localStorage.setItem('simulationResult', JSON.stringify(result));

        // Redirect to the simulation result page
        navigate('/simulation-result');
    };

    return (
        <Box sx={{height: '100vh', backgroundColor: '#f0f0f5'}}>
            {/* Navigation Bar */}
            <AppBar position="static" sx={{backgroundColor: '#3f51b5'}}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuClick}>
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" sx={{flexGrow: 1}}>
                        Real Estate App
                    </Typography>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <MenuItem onClick={handleHomeClick}>Home</MenuItem>
                        <MenuItem onClick={handleSimulationFormClick}>Simulation Form</MenuItem>
                        <MenuItem onClick={handleRunAuctionClick}>Run Auction</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* Form and Simulation Details */}
            <Box sx={{padding: 4, display: 'flex', justifyContent: 'center'}}>
                <Card sx={{maxWidth: 500, padding: 4, backgroundColor: 'white', boxShadow: 3}}>
                    <CardContent>
                        <Box sx={{textAlign: 'center', marginBottom: 2}}>
                            <img src={Logo} alt="Logo" style={{width: 80, height: 80}}/>
                            <Typography variant="h5" gutterBottom>Agent Simulation</Typography>
                        </Box>

                        <TextField
                            label="Number of Agents"
                            variant="outlined"
                            name="num_agents"
                            fullWidth
                            margin="normal"
                            value={formData.num_agents}
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
                            label="Cost per Inquiry"
                            variant="outlined"
                            name="cost_per_inquiry"
                            fullWidth
                            margin="normal"
                            value={formData.cost_per_inquiry}
                            onChange={handleInputChange}
                        />
                        <TextField
                            label="Rounds"
                            variant="outlined"
                            name="rounds"
                            fullWidth
                            margin="normal"
                            value={formData.rounds}
                            onChange={handleInputChange}
                        />

                        {/* AT or BT Criteria */}
                        <Typography variant="h6" sx={{marginTop: 2}}>
                            AT or BT Criteria
                        </Typography>
                        <RadioGroup name="atOrBt" value={formData.atOrBt} onChange={handleAtBtChange}>
                            <FormControlLabel value="AT" control={<Radio/>} label="Above Threshold (AT)"/>
                            <FormControlLabel value="BT" control={<Radio/>} label="Below Threshold (BT)"/>
                        </RadioGroup>

                        {/* Distribution Type */}
                        <FormControl fullWidth sx={{marginTop: 2}}>
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

                            <TextField
                                label="Minimum Value"
                                variant="outlined"
                                name="minValue"
                                type="number"
                                fullWidth
                                margin="normal"
                                value={formData.minValue}
                                onChange={handleInputChange}
                            />
                            <TextField
                                label="Maximum Value"
                                variant="outlined"
                                name="maxValue"
                                type="number"
                                fullWidth
                                margin="normal"
                                value={formData.maxValue}
                                onChange={handleInputChange}
                            />

                        </FormControl>

                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{marginTop: 2}}
                            onClick={handleSubmit}
                        >
                            Start Simulation
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}

export default SimulationForm;
