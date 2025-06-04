import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import * as AuthActions from '../actions/auth.actions';

export interface AuthState extends EntityState<any> {
  isAuthenticated: boolean;
  user: any | null;
  error: string | null;
  loading: boolean;
}

export const authAdapter = createEntityAdapter<any>();

export const initialState: AuthState = authAdapter.getInitialState({
  isAuthenticated: false,
  user: null,
  error: null,
  loading: false
});

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    isAuthenticated: true,
    user,
    loading: false,
    error: null
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(AuthActions.logout, (state) => ({
    ...state,
    loading: true
  })),
  on(AuthActions.logoutSuccess, (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null
  }))
); 