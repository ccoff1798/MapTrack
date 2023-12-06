const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

require('dotenv').config();

// Initialize Express
const app = express();

// Enable CORS for all routes
app.use(cors());

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Initialize Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Location Update Route
app.post('/update-location', (req, res) => {
    console.log('Location update received:', req.body);
    res.json({ 'status': 200 });
});

// Static Files Middleware
app.use('/images', express.static(path.join(__dirname, '../client/images')));
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
}

// Start Apollo Server
const startApolloServer = async () => {
    await server.start();

    // Apollo Server Middleware
    app.use('/graphql', expressMiddleware(server, {
        context: authMiddleware
    }));

    db.once('open', () => {
        app.listen(process.env.PORT || 3001, () => {
            console.log(`API server running on port ${process.env.PORT || 3001}!`);
            console.log(`Use GraphQL at http://localhost:${process.env.PORT || 3001}/graphql`);
        });
    });
};

startApolloServer();
