import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        msalConfig: {
            auth: {
                clientId: "",
                authority:
                    '',
            },
            cache: {
                cacheLocation: 'localStorage',
            },
        },
        accessToken: "",
        msalInstance: "",
        account: undefined,
        message: "",
        snackbar: false
    },
    mutations: {
        setAccessToken(state, token) {
            state.accessToken = token;
        },
        setInstance(state, msalInstance) {
            state.msalInstance = msalInstance;
        },
        setAccount(state, account) {
            state.account = account;
        },
        showSnackbar(state, message) {
            state.snackbar = true;
            state.message = message;
        },
        hideSnackbar(state) {
            state.snackbar = false;
        }
    }
});

export default store;
