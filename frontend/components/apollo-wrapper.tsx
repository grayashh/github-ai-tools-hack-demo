'use client';

import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink } from '@apollo/client';
import React from 'react';
const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL || 'http://localhost:8686/graphql',
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
});

export function ApolloWrapper({ children }: React.PropsWithChildren<{}>) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
