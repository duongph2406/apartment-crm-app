import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { storage } from '../utils/localStorage';

const AppContext = createContext();

// Action types
const ActionTypes = {
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_TENANTS: 'SET_TENANTS',
    SET_CONTRACTS: 'SET_CONTRACTS',
    SET_INVOICES: 'SET_INVOICES',
    SET_ROOMS: 'SET_ROOMS',
    SET_INCIDENTS: 'SET_INCIDENTS',
    SET_FEEDBACKS: 'SET_FEEDBACKS',
    CLEAR_ERROR: 'CLEAR_ERROR'
};

// Initial state
const initialState = {
    loading: false,
    error: null,
    tenants: [],
    contracts: [],
    invoices: [],
    rooms: [],
    incidents: [],
    feedbacks: []
};

// Reducer
const appReducer = (state, action) => {
    switch (action.type) {
        case ActionTypes.SET_LOADING:
            return { ...state, loading: action.payload };
        case ActionTypes.SET_ERROR:
            return { ...state, error: action.payload, loading: false };
        case ActionTypes.CLEAR_ERROR:
            return { ...state, error: null };
        case ActionTypes.SET_TENANTS:
            return { ...state, tenants: action.payload };
        case ActionTypes.SET_CONTRACTS:
            return { ...state, contracts: action.payload };
        case ActionTypes.SET_INVOICES:
            return { ...state, invoices: action.payload };
        case ActionTypes.SET_ROOMS:
            return { ...state, rooms: action.payload };
        case ActionTypes.SET_INCIDENTS:
            return { ...state, incidents: action.payload };
        case ActionTypes.SET_FEEDBACKS:
            return { ...state, feedbacks: action.payload };
        default:
            return state;
    }
};

// Provider component
export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Actions
    const setLoading = useCallback((loading) => {
        dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
    }, []);

    const setError = useCallback((error) => {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error });
    }, []);

    const clearError = useCallback(() => {
        dispatch({ type: ActionTypes.CLEAR_ERROR });
    }, []);

    // Data loading functions
    const loadTenants = useCallback(async () => {
        try {
            setLoading(true);
            const tenants = storage.getTenants();
            dispatch({ type: ActionTypes.SET_TENANTS, payload: tenants });
        } catch (error) {
            setError('Không thể tải danh sách khách thuê');
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError]);

    const loadContracts = useCallback(async () => {
        try {
            setLoading(true);
            const contracts = storage.getContracts();
            dispatch({ type: ActionTypes.SET_CONTRACTS, payload: contracts });
        } catch (error) {
            setError('Không thể tải danh sách hợp đồng');
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError]);

    const loadInvoices = useCallback(async () => {
        try {
            setLoading(true);
            const invoices = storage.getInvoices();
            dispatch({ type: ActionTypes.SET_INVOICES, payload: invoices });
        } catch (error) {
            setError('Không thể tải danh sách hóa đơn');
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError]);

    const loadIncidents = useCallback(async () => {
        try {
            setLoading(true);
            const incidents = storage.getIncidents();
            dispatch({ type: ActionTypes.SET_INCIDENTS, payload: incidents });
        } catch (error) {
            setError('Không thể tải danh sách sự cố');
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError]);

    const loadFeedbacks = useCallback(async () => {
        try {
            setLoading(true);
            const feedbacks = storage.getFeedbacks();
            dispatch({ type: ActionTypes.SET_FEEDBACKS, payload: feedbacks });
        } catch (error) {
            setError('Không thể tải danh sách phản ánh');
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError]);

    const value = {
        ...state,
        setLoading,
        setError,
        clearError,
        loadTenants,
        loadContracts,
        loadInvoices,
        loadIncidents,
        loadFeedbacks
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook
export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};