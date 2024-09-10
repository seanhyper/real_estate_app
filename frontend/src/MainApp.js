import React, { useState } from 'react';
import {
    Box,
    Typography,
    Container,
    Card,
    CardContent,
    AppBar,
    Toolbar,
    IconButton,
    Menu,
    MenuItem,
    Grid,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom'; // For routing
import { Bar, Line } from 'react-chartjs-2'; // Chart.js for visualizations
import { useTheme } from '@mui/material/styles';
import Logo from './logo.png'; // Placeholder logo

// Setup for Chart.js
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement);

function Dashboard() {
    const [anchorEl, setAnchorEl] = useState(null); // Menu state
    const theme = useTheme();
    const navigate = useNavigate();

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleHomeClick = () => {
        navigate('/');  // Redirect to the main endpoint
    };

    const handleSimulationFormClick = () => {
        navigate('/simulation-form');
    };

    const handleRunAuctionClick = () => {
        navigate('/run-auction');
    };

    // Project status data
    const projectStatusData = {
        labels: ['Completed', 'Ongoing', 'At Risk'],
        datasets: [
            {
                label: 'Projects',
                data: [120, 45, 10], // Example data
                backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
            },
        ],
    };

    // Market trends data (for example, price trends over the months)
    const marketTrendsData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        datasets: [
            {
                label: 'Market Price ($)',
                data: [500000, 520000, 510000, 530000, 540000, 550000, 560000, 580000, 600000], // Example data
                fill: false,
                borderColor: '#42a5f5',
                tension: 0.1,
            },
        ],
    };

    // Agent team status (team performance)
    const agentTeamData = {
        labels: ['Team A', 'Team B', 'Team C', 'Team D'],
        datasets: [
            {
                label: 'Deals Closed',
                data: [15, 20, 10, 25], // Example data
                backgroundColor: '#3f51b5',
            },
            {
                label: 'Active Projects',
                data: [5, 3, 7, 2], // Example data
                backgroundColor: '#ff9800',
            },
        ],
    };

    return (
        <Box sx={{ height: '100vh', backgroundColor: '#f4f6f8' }}>
            {/* App Bar */}
            <AppBar position="static" sx={{ backgroundColor: '#3f51b5' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleMenuClick}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Real Estate Dashboard
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <img src={Logo} alt="Logo" style={{ width: 40, height: 40 }} />
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <MenuItem onClick={handleHomeClick}>Home</MenuItem>
                        <MenuItem onClick={handleSimulationFormClick}>Simulation Form</MenuItem>
                        <MenuItem onClick={handleRunAuctionClick}>Run Auction</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* Main Dashboard Content */}
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Grid container spacing={4}> {/* Increased spacing here */}
                    {/* Project Status Overview */}
                    <Grid item xs={12} md={6} sx={{ mt: 2 }}> {/* Added top margin */}
                        <Card sx={{ p: 2, boxShadow: 5, backgroundColor: 'white', borderRadius: 3, height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" align="center" gutterBottom>
                                    Project Status
                                </Typography>
                                <Box sx={{ width: '100%' }}>
                                    <Bar data={projectStatusData} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Market Trends */}
                    <Grid item xs={12} md={6} sx={{ mt: 2 }}> {/* Added top margin */}
                        <Card sx={{ p: 2, boxShadow: 5, backgroundColor: 'white', borderRadius: 3, height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" align="center" gutterBottom>
                                    Market Trends
                                </Typography>
                                <Box sx={{ width: '100%' }}>
                                    <Line data={marketTrendsData} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Agent Team Status */}
                    <Grid item xs={12} sx={{ mt: 3 }}> {/* Increased margin top for more space */}
                        <Card sx={{ p: 2, boxShadow: 5, backgroundColor: 'white', borderRadius: 3 }}>
                            <CardContent>
                                <Typography variant="h6" align="center" gutterBottom>
                                    Agent Teams Performance
                                </Typography>
                                <Bar data={agentTeamData} />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default Dashboard;
