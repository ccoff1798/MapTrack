import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import NavTabs from './components/NavTabs.jsx';
import 'bootstrap/dist/css/bootstrap.css'

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <NavTabs />
      <div className="flex-column justify-center align-center min-100-vh bg-primary">

        <Outlet />
      </div>
    </ApolloProvider>
  );
}

export default App;
