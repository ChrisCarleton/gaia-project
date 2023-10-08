import { OperationVariables, TypedDocumentNode } from '@apollo/client/core';
import { ApolloError, GraphQLErrors } from '@apollo/client/errors';

import { ApolloClient, GqlClient } from './interfaces';

export class CompoundGraphQLError extends Error {
  constructor(
    message: string,
    readonly internalErrors: GraphQLErrors,
  ) {
    super(message);
    Object.setPrototypeOf(this, CompoundGraphQLError.prototype);
  }
}

export class ApolloGqlClient implements GqlClient {
  constructor(private readonly client: ApolloClient) {}

  async query<TResult, TVars extends OperationVariables>(
    query: TypedDocumentNode<TResult, TVars>,
    variables?: TVars,
  ): Promise<TResult> {
    const { data, error } = await this.client.query<TResult, TVars>({
      query,
      variables,
    });

    if (error) this.handleError(error);

    return data;
  }

  async mutate<TResult, TVars extends OperationVariables>(
    mutation: TypedDocumentNode<TResult, TVars>,
    variables?: TVars,
  ): Promise<TResult> {
    const { data, errors } = await this.client.mutate({
      mutation,
      variables,
    });

    if (errors?.length) {
      if (errors.length === 1) {
        throw errors[0];
      }

      throw new CompoundGraphQLError('', errors);
    }

    return data!;
  }

  private handleError(error: ApolloError): never {
    if (error.networkError) {
      throw error.networkError;
    }

    if (error.graphQLErrors.length) {
      if (error.graphQLErrors.length === 1) {
        throw error.graphQLErrors[0];
      }

      throw new CompoundGraphQLError(error.message, error.graphQLErrors);
    }

    throw new Error(`An unhandled error has occurred: ${error.message}`);
  }
}
