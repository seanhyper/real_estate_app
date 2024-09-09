import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Container, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function DutchAuctionForm() {
    const [formData, setFormData] = useState({
        numOfBuyers: 5,
        initialPrice: 2000000,
        priceDropPercentage: 10,
        numWeeks: 12
    });
    const [open, setOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState('');

    const theme = useTheme();  // Using the theme for consistent styling

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: parseFloat(e.target.value)
        });
    };

    const handleDialogClose = () => {
        setOpen(false);
    };

    const handleSubmit = async () => {
        const response = await fetch('http://localhost:5000/run-auction/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            console.error("Failed to run the auction");
            setDialogContent('Failed to run the auction. Please try again.');
            setOpen(true);
            return;
        }

        const result = await response.json();
        console.log("Auction Result: ", result);
        setDialogContent(`Auction Result: ${JSON.stringify(result)}`);
        setOpen(true);
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ mb: 4 }}>
            <Box sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 2,
                boxShadow: 3,
                borderRadius: 2,
                bgcolor: 'background.paper'
            }}>
                <Typography component="h1" variant="h5" color="primary">
                    Dutch Auction Parameters
                </Typography>
                <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="numOfBuyers"
                        label="Number of Potential Buyers"
                        name="numOfBuyers"
                        autoComplete="numOfBuyers"
                        autoFocus
                        value={formData.numOfBuyers}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="initialPrice"
                        label="Initial Price"
                        type="number"
                        id="initialPrice"
                        autoComplete="initialPrice"
                        value={formData.initialPrice}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="priceDropPercentage"
                        label="Price Drop Percentage per Week"
                        type="number"
                        id="priceDropPercentage"
                        autoComplete="priceDropPercentage"
                        value={formData.priceDropPercentage}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="numWeeks"
                        label="Number of Weeks"
                        type="number"
                        id="numWeeks"
                        autoComplete="numWeeks"
                        value={formData.numWeeks}
                        onChange={handleInputChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Start Auction
                    </Button>
                </Box>
            </Box>
            <Dialog open={open} onClose={handleDialogClose}>
                <DialogTitle>{"Auction Results"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogContent}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary" autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default DutchAuctionForm;
