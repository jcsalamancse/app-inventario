import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

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
  // Aquí agregaremos las acciones cuando las creemos
); 