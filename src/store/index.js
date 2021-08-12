import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        msalConfig: {
            auth: {
                clientId: "22b80e5a-e13f-48a2-b20f-9b3c24b90d64",
                authority:
                    'https://login.microsoftonline.com/ed764e1f-b3b8-4aaf-8fb2-1d05be08443b',
            },
            cache: {
                cacheLocation: 'localStorage',
            },
        },
        accessToken: '',
        msalInstance: '',
        account: undefined
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
        }
    }
});

export default store;
