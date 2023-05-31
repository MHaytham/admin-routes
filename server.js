const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');

// const SUPABASE_URL = process.env.SUPABASE_URL; // set these in your env variables
// const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

SUPABASE_URL = 'https://njobjmqjbvccwidomwtu.supabase.co'
SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qb2JqbXFqYnZjY3dpZG9td3R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU1NjAzMTIsImV4cCI6MjAwMTEzNjMxMn0.DP614xTgV8wK9-OXgGHBB7Bo8MbG97AimGh1Zwoxlg8'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

app.use(bodyParser.json());

// Create Route
app.post('/api/v1/route', async (req, res) => {
    const { fromstationid, tostationid, routename } = req.body;

    if (!fromstationid || !tostationid || !routename) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        const newRoute = {
            routename,
            fromstationid,
            tostationid,
        };

        const { data, error } = await supabase.from('routes').insert([newRoute]);

        if (error) {
            throw error;
        }

        res.status(200).json({ message: 'Route created successfully', data });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error creating route', details: error });
    }
});

// Update Route
app.put('/api/v1/route/:id', async (req, res) => {
    const { routename, fromstationid, tostationid } = req.body;
    const { id } = req.params;
    console.log(id);
    if (!routename) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        const { data, error } = await supabase
            .from('routes')
            .update({ routename, fromstationid, tostationid })
            .eq('id', id);

        if (error) {
            throw error;
        }

        res.status(200).json({ message: 'Route updated successfully', data });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error updating route', details: error });
    }
});

// Delete Route
app.delete('/api/v1/route/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const { data, error } = await supabase
            .from('routes')
            .delete()
            .eq('id', id);

        if (error) {
            throw error;
        }

        res.status(200).json({ message: 'Route deleted successfully' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error deleting route', details: error });
    }
});

// Get all routes 
app.get('/api/v1/routes', async (req, res) => {
    const { data: routes, error } = await supabase.from('routes').select('*');

    if (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error retrieving routes', details: error });
    }

    return res.status(200).json(routes);
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
