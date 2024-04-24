import { ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  uri: 'https://rickandmortyapi.com/graphql', // GraphQL sunucunuzun adresini buraya girin
  cache: new InMemoryCache(),
})

export default client
