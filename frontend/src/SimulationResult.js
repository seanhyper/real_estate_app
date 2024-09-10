import React, {useState, useEffect} from 'react';
import {
    Typography,
    Box,
    Card,
    CardContent,
    AppBar,
    Toolbar,
    IconButton,
    Menu,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import Logo from './logo.png';  // Assuming you have a logo

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];  // Color scheme for the pie chart

function SimulationResult() {
    const [simulationData, setSimulationData] = useState([]);
    const [settlingData, setSettlingData] = useState([]);  // Ensure this is defined here
    const [highestOffers, setHighestOffers] = useState([]);
    const [currentRound, setCurrentRound] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [finalStates, setFinalStates] = useState([]);

    const navigate = useNavigate();  // Initialize navigate

    useEffect(() => {
        // Retrieve simulation result from localStorage
        const result = JSON.parse(localStorage.getItem('simulationResult'));

        if (result && result.simulation_results) {
            setSimulationData(result.simulation_results);
            const settlingRounds = Object.entries(result.settling_rounds || {}).map(([id, rounds]) => ({
                name: `Agent ${id}`,
                value: rounds !== null ? rounds + 1 : result.simulation_results.length  // Add 1 because rounds are 0-indexed
            }));
            setSettlingData(settlingRounds);
        }
    }, []);

    useEffect(() => {
        if (simulationData.length > 0 && currentRound < simulationData.length - 1) {
            const interval = setInterval(() => {
                setCurrentRound((prevRound) => prevRound + 1);
            }, 2000);

            return () => clearInterval(interval);
        }
    }, [simulationData, currentRound]);

    useEffect(() => {
        const result = JSON.parse(localStorage.getItem('simulationResult'));
        if (result && result.simulation_results) {
            setSimulationData(result.simulation_results);
            const offersData = Object.entries(result.highest_offers).map(([agentId, offer]) => ({
                name: `Agent ${agentId}`,
                value: offer
            }));
            setHighestOffers(offersData);
            extractFinalStates(result.simulation_results);
        }
    }, []);

    const extractFinalStates = (simulationResults) => {
        const lastActions = simulationResults.reduce((acc, round) => {
            round.actions.forEach(action => {
                acc[action.agent_id] = action;  // This always writes the latest action for each agent
            });
            return acc;
        }, {});
        setFinalStates(Object.values(lastActions));
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
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

    const currentData = simulationData[currentRound] || {actions: []};

    const offerDistributionData = currentData.actions.map((agent, idx) => ({
        name: `Agent ${agent.agent_id}`,
        value: agent.current_offer
    }));

    return (
        <Box sx={{padding: 4}}>
            {/* App Bar with menu */}
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

            {/* Header with logo */}
            <Box sx={{textAlign: 'center', marginBottom: 4}}>
                <img src={Logo} alt="Logo" style={{width: 80, height: 80}}/>
                <Typography variant="h4" gutterBottom>Simulation Results</Typography>
                <Typography variant="h6">Round: {currentRound + 1}</Typography>
            </Box>

            {/* Agent Cards */}
            <Box sx={{display: 'flex', justifyContent: 'center', marginTop: 4}}>
                {currentData.actions.map((agentAction, index) => (
                    <Card key={index} sx={{
                        margin: 2,
                        width: 250,
                        backgroundColor: agentAction.decision.includes('settling') ? '#d1ffd1' : '#ffd1d1',
                        boxShadow: 3
                    }}>
                        <CardContent>
                            <Typography variant="h6">Agent {agentAction.agent_id}</Typography>
                            <Typography>{agentAction.decision}</Typography>
                            <Typography>Current Offer: ${agentAction.current_offer}</Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {/* Ensure this Box wraps both the Typography and TableContainer for alignment */}
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 650, margin: 'auto'}}>
                <Typography variant="h5" sx={{alignSelf: 'flex-start', mb: 2}}>Final States of Agents</Typography>
                <TableContainer component={Paper}>
                    <Table aria-label="final states table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Agent ID</TableCell>
                                <TableCell align="right">Final Decision</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {finalStates.map((agentAction, index) => (
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row">
                                        Agent {agentAction.agent_id}
                                    </TableCell>
                                    <TableCell align="right">
                                        {agentAction.decision}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Pie Chart for Settling Rounds */}
            {settlingData.length > 0 && (
                <Box sx={{marginTop: 4}}>
                    <Typography variant="h5">Number of Rounds Taken to Settle</Typography>
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie data={settlingData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150}
                                 fill="#8884d8" label>
                                {settlingData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                ))}
                            </Pie>
                            <Tooltip/>
                            <Legend/>
                        </PieChart>
                    </ResponsiveContainer>
                </Box>
            )}

            {/* Bar Chart to Display the Highest Offers */}
            <Box sx={{marginTop: 4}}>
                <Typography variant="h5">Highest Offers by Agents</Typography>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={highestOffers}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="name"/>
                        <YAxis domain={['dataMin - 200000', 'dataMax + 200000']}/>
                        <Tooltip/>
                        <Legend/>
                        <Bar dataKey="value" fill="#8884d8"/>
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    );
}

export default SimulationResult;
