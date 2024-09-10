import React, {useState} from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Card,
    CardContent,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    AppBar,
    Toolbar,
    IconButton,
    Menu,
    MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {useTheme} from '@mui/material/styles';
import {useNavigate} from 'react-router-dom'; // Import useNavigate for routing
import Logo from './logo.png'; // Assuming you have a logo file
import AIImage from './ai_image.png'; // Import the AI image

function DutchAuctionForm() {
    const [formData, setFormData] = useState({
        numOfBuyers: 5,
        initialPrice: 2000000,
        priceDropPercentage: 10,
        numWeeks: 12,
    });

    const [loading, setLoading] = useState(false);  // For loading indicator
    const [open, setOpen] = useState(false);  // For dialog open/close state
    const [dialogContent, setDialogContent] = useState({});  // For storing auction result
    const [anchorEl, setAnchorEl] = useState(null); // Menu anchor state for AppBar
    const navigate = useNavigate(); // Hook for navigation

    const theme = useTheme();

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: parseFloat(e.target.value),
        });
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

    const handleDialogClose = () => {
        setOpen(false);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/run-auction/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                setDialogContent({
                    error: 'Failed to run the auction. Please try again.',
                });
                setOpen(true);
                return;
            }

            const result = await response.json();
            setDialogContent(result);
            setOpen(true);
        } catch (error) {
            console.error("Failed to run the auction:", error);
            setDialogContent({
                error: 'Error: Unable to run the auction. Please try again.',
            });
            setOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const renderDialogContent = () => {
        if (dialogContent.error) {
            return <Typography color="error">{dialogContent.error}</Typography>;
        }

        if (dialogContent.agent_id === null) {
            return <Typography color="textPrimary">No agent bought the property.</Typography>;
        }

        return (
            <List>
                <ListItem>
                    <ListItemText primary="Agent ID"
                                  secondary={dialogContent.agent_id !== undefined ? dialogContent.agent_id : 'N/A'}/>
                </ListItem>
                <ListItem>
                    <ListItemText primary="Final Price"
                                  secondary={dialogContent.final_price !== undefined ? dialogContent.final_price : 'N/A'}/>
                </ListItem>
                <ListItem>
                    <ListItemText primary="Week Sold"
                                  secondary={dialogContent.week_sold !== undefined ? dialogContent.week_sold : 'N/A'}/>
                </ListItem>
            </List>
        );
    };

    return (
        <Box sx={{height: '100vh', backgroundColor: '#f4f6f8'}}>
            {/* App Bar */}
            <AppBar position="static" sx={{backgroundColor: '#3f51b5'}}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleMenuClick}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" sx={{flexGrow: 1}}>
                        Dutch Auction System
                    </Typography>
                    <Box sx={{flexGrow: 1}}/>
                    <img src={Logo} alt="Logo" style={{width: 40, height: 40}}/>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <MenuItem onClick={handleHomeClick}>Home</MenuItem> {/* Redirect to Home */}
                        <MenuItem onClick={handleSimulationFormClick}>Simulation
                            Form</MenuItem> {/* Redirect to Simulation Form */}
                        <MenuItem onClick={handleRunAuctionClick}>Run Auction</MenuItem> {/* Redirect to Run Auction */}
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* Main Form */}
            <Container component="main" maxWidth="sm" sx={{mt: 8}}>
                <Card sx={{p: 4, boxShadow: 5, backgroundColor: 'white', borderRadius: 3}}>
                    <CardContent>
                        <Typography
                            component="h1"
                            variant="h5"
                            color={theme.palette.primary.main}
                            align="center"
                            gutterBottom
                        >
                            Configure Dutch Auction
                        </Typography>
                        <Box
                            component="form"
                            noValidate
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit();
                            }}
                            sx={{mt: 2}}
                        >
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="numOfBuyers"
                                label="Number of Potential Buyers"
                                name="numOfBuyers"
                                type="number"
                                value={formData.numOfBuyers}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="initialPrice"
                                label="Initial Price"
                                name="initialPrice"
                                type="number"
                                value={formData.initialPrice}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="priceDropPercentage"
                                label="Price Drop Percentage per Week"
                                name="priceDropPercentage"
                                type="number"
                                value={formData.priceDropPercentage}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="numWeeks"
                                label="Number of Weeks"
                                name="numWeeks"
                                type="number"
                                value={formData.numWeeks}
                                onChange={handleInputChange}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{mt: 3, mb: 2}}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24}/> : 'Start Auction'}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Container>

            {/* Dialog for displaying auction results */}
            <Dialog
                open={open}
                onClose={handleDialogClose}
                PaperProps={{
                    style: {width: '400px', padding: '20px'},
                }}
            >
                <DialogTitle>{"Auction Results"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {renderDialogContent()}
                        {/* AI Image added here */}
                        <Box sx={{textAlign: 'center'}}>
                            <img src={AIImage} alt="AI Agent" style={{width: 100, marginBottom: 20}}/>
                        </Box>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary" autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default DutchAuctionForm;
