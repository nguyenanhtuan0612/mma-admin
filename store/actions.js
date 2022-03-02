import { SET_STATE, LOADING_FALSE, LOADING_TRUE } from './constants';

export const setState = payload => ({
    type: SET_STATE,
    payload,
});

export const loadingTrue = () => ({
    type: LOADING_TRUE,
});

export const loadingFalse = () => ({
    type: LOADING_FALSE,
});
