// // server/server.js
// // require('dotenv').config()


// const express = require('express')
// const bodyParser = require('body-parser')
// const Pusher = require('pusher');

// // create a express application
// const app = express();

// // initialize pusher
// let pusher = new Pusher({
//     appId: process.env.REACT_APP_PUSHER_ID || "1705235",
//     key:  process.env.REACT_APP_PUSHER_KEY || "3c7bed8f88b31f55b58f",
//     secret:  process.env.REACT_APP_PUSHER_SECRET ||"8c53f6221d8487e15cbb",
//     cluster:  process.env.REACT_APP_PUSHER_CLUSTER || "us3",
//     encrypted: true
// });

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// // to Allow CORS
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header(
//         'Access-Control-Allow-Headers',
//         'Origin, X-Requested-With, Content-Type, Accept'
//     );
//     next();
// });


//    app.post('/pusher/auth', (req, res) => {
//        let socketId = req.body.socket_id;
//        let channel = req.body.channel_name;
//        random_string = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
//        let presenceData = {
//            user_id: random_string,
//            user_info: {
//                username: '@' + random_string,
//            }
//        };
//        let auth = pusher.authenticate(socketId, channel, presenceData);
//        res.send(auth);
//    });

//    app.post('/update-location', (req, res) => {
//        // trigger a new post event via pusher
//        pusher.trigger('presence-channel', 'location-update', {
//            'username': req.body.username,
//            'location': req.body.location
//        })
//        res.json({ 'status': 200 });
//    });

//    let port = 3128;
//    app.listen(port);
//    console.log('listening');
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const Pusher = require('pusher');
const path = require('path');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

require('dotenv').config();

// Initialize Express
const app = express();

// Initialize Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Initialize Pusher
let pusher = new Pusher({
    appId: process.env.REACT_APP_PUSHER_ID || "1705235",
    key: process.env.REACT_APP_PUSHER_KEY || "3c7bed8f88b31f55b58f",
    secret: process.env.REACT_APP_PUSHER_SECRET || "8c53f6221d8487e15cbb",
    cluster: process.env.REACT_APP_PUSHER_CLUSTER || "us3",
    encrypted: true
});

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// CORS Middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

// Pusher Authentication Route
app.post('/pusher/auth', (req, res) => {
    let socketId = req.body.socket_id;
    let channel = req.body.channel_name;
    let random_string = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
    let presenceData = {
        user_id: random_string,
        user_info: {
            username: '@' + random_string,
        }
    };
    let auth = pusher.authenticate(socketId, channel, presenceData);
    res.send(auth);
});

// Pusher Location Update Route
app.post('/update-location', (req, res) => {
    pusher.trigger('presence-channel', 'location-update', {
        'username': req.body.username,
        'location': req.body.location
    });
    res.json({ 'status': 200 });
});

// Starting the server
const PORT = process.env.PORT || 3001;

// Start Apollo Server
const startApolloServer = async () => {
    await server.start();

    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    // Static Files Middleware
    app.use('/images', express.static(path.join(__dirname, '../client/images')));
    if (process.env.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, '../client/dist')));
        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../client/dist/index.html'));
        });
    }
    // Apollo Server Middleware
    app.use('/graphql', expressMiddleware(server, {
        context: authMiddleware
    }));

    db.once('open', () => {
        app.listen(PORT, () => {
            console.log(`API server running on port ${PORT}!`);
            console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
        });
    });
};
startApolloServer();


