import Vue from 'vue';
import Vuex from 'vuex';

import data from './data';
import login from './login';

Vue.use(Vuex)


export default new Vuex.Store({
    modules:{
        data,
        login

    }
})