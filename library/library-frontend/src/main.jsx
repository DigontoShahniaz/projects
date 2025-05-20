import ReactDOM from 'react-dom/client';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('library-token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  };
});

const httpLink = createHttpLink({
  uri: 'https://libraryapp.fly.dev/',
});

const wsLink = new GraphQLWsLink(
  createClient({ url: 'https://libraryapp.fly.dev/' })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <Container fluid className="py-3">
      <App />
    </Container>
  </ApolloProvider>
);