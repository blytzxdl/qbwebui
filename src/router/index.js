import Vue from 'vue';
import VueRouter from 'vue-router';
import checkCookie from "../utils/checkCookie";

// import Home from '../views/Home.vue';

Vue.use(VueRouter)

const routes = [
    {
        path: '/'
        , redirect: '/login'
    },
    {
        path: '/Home',
        name: 'Home',
        component: () => import('../views/Home')
    },
    {
        path: '/Login',
        name: 'Login',
        component: () => import('../views/Login')
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

router.beforeEach(async (to, from, next) => {
    let login = await checkCookie()
    if (login) {
        if (to.path != '/Home') {
            next('/Home')
        } else { next() }
    } else {
        if (to.path != '/Login') {
            next('/Login')
        } else { next() }
    }
})

export default router