import Vue from 'vue';
import Vuex from 'vuex';

import item from './data';
import login from './login';

Vue.use(Vuex)


export default new Vuex.Store({
    modules:{
        item,
        login

    }
})