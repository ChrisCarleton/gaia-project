import { CompoundGraphQLError } from '@/apiClient';
import { Action, Mutation, useStore } from '@/store';
import { GaiaProjectState } from '@/store/state';
import { ErrorCode } from '@gaia-project/api';
import { GraphQLError } from 'graphql';
import { useRouter } from 'vue-router';
import { Router } from 'vue-router';
import { Store } from 'vuex';
import { z } from 'zod';

type ErrorCodeHandler = (
  error: GraphQLError,
  store: Store<GaiaProjectState>,
  router: Router,
) => void | Promise<void>;
export type ErrorCodeHandlers = Partial<Record<ErrorCode, ErrorCodeHandler>>;

const ErrorCodeSchema = z.nativeEnum(ErrorCode);
const GraphQLSchemaMismatchToast = `An error occurred while communicating with the server.
You may be running an old version of the game.
Try refreshing the page in your web browser.`;

const DefaultStatusCodeHandlers: ErrorCodeHandlers = {
  // Unauthorized error. Most likely cause is the user's session expired.
  // Sign the user out of the Vuex store to force the app back to anonymous browsing mode.
  [ErrorCode.Unauthorized]: (error, store) => {
    store.commit(Mutation.SignOutUser);
  },

  // User is logged in but not authorized to perform the requested action.
  [ErrorCode.Forbidden]: async (error, store): Promise<void> => {
    await store.dispatch(
      Action.ToastError,
      `You do not have permission to perform the requested action: ${error.message}`,
    );
  },

  // Server and client may have mismatched GraphQL schemas. Probably the browser is running an older version of
  // the app that is no longer supported by the server.
  [ErrorCode.GraphqlValidationFailed]: async (error, store): Promise<void> => {
    await store.dispatch(Action.ToastError, GraphQLSchemaMismatchToast);
  },
  [ErrorCode.BadRequest]: async (error, store): Promise<void> => {
    await store.dispatch(Action.ToastError, GraphQLSchemaMismatchToast);
  },

  // Server error.
  [ErrorCode.InternalServerError]: async (error, store): Promise<void> => {
    console.error(error);
    await store.dispatch(
      Action.ToastError,
      'An unexpected server error has occurred.',
    );
  },
};

async function toastGenericErrorMessage(
  store: Store<GaiaProjectState>,
  error: unknown,
): Promise<void> {
  console.error(error);
  await store.dispatch(
    Action.ToastError,
    'An unexpected error has occurred. Please try again later.',
  );
}

async function handleGraphQLError(
  store: Store<GaiaProjectState>,
  router: Router,
  error: GraphQLError,
  handlers: ErrorCodeHandlers,
): Promise<void> {
  // Attempt to parse the error code. Then find and invoke the associated handler.
  const parsedErrorCode = ErrorCodeSchema.safeParse(error.extensions.code);
  if (parsedErrorCode.success) {
    const errorCode = parsedErrorCode.data;
    const handler = handlers[errorCode];
    if (handler) {
      await handler(error, store, router);
      return;
    }
  }

  // Default error handling for cases where the error code cannot be parsed or no handler is configured.
  await toastGenericErrorMessage(store, error);
}

async function handleError(
  store: Store<GaiaProjectState>,
  router: Router,
  error: unknown,
  handlers: ErrorCodeHandlers,
): Promise<void> {
  if (error instanceof GraphQLError) {
    handleError(store, router, error, handlers);
  }

  if (error instanceof CompoundGraphQLError) {
    await Promise.all(
      error.internalErrors.map((graphqlError) =>
        handleGraphQLError(store, router, graphqlError, handlers),
      ),
    );
  }

  // Generic response for all unhandled cases.
  await toastGenericErrorMessage(store, error);
}

export type ErrorHandler = (
  error: unknown,
  statusCodeHandlers?: ErrorCodeHandler,
) => Promise<void>;

export function useErrorHandling(): ErrorHandler {
  const store = useStore();
  const router = useRouter();

  return (error, statusCodeHandlers?) =>
    handleError(store, router, error, {
      ...DefaultStatusCodeHandlers,
      ...statusCodeHandlers,
    });
}
