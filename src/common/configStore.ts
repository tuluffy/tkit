import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'react-router-redux';

import history from './history';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

const router = routerMiddleware(history);
const sagaMiddleware = createSagaMiddleware();

// NOTE: Do not change middleares delaration pattern since rekit plugins may register middlewares to it.
const middlewares = [sagaMiddleware, router];

let devToolsExtension = <T>(f: T): T => f;

/* istanbul ignore if  */
if (process.env.NODE_ENV === 'development') {
  const { createLogger } = require('redux-logger');

  const logger = createLogger({ collapsed: true });
  middlewares.push(logger);

  // @ts-ignore
  if (window.devToolsExtension) {
    // @ts-ignore
    devToolsExtension = window.devToolsExtension();
  }
}

export type TRootState = ReturnType<typeof configureStore>;

export default function configureStore<S extends {}>(initialState: S) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middlewares),
      devToolsExtension
    )
  );

  sagaMiddleware.run(rootSaga);

  /* istanbul ignore if  */
  // @ts-ignore
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    // @ts-ignore
    module.hot.accept('./rootReducer', () => {
      const nextRootReducer = require('./rootReducer').default; // eslint-disable-line
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
