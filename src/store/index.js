import Vue from 'vue';
import Vuex from 'vuex';

import item from './item';
import footer from './footer';
import aside from './aside';

Vue.use(Vuex)


export default new Vuex.Store({
    modules:{
        item,
        footer,
        aside

    }
})