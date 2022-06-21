import Vue from 'vue';
import VueRouter from 'vue-router';
import checkCookie from "../utils/checkCookie";

// import Home from '../views/Home.vue';

Vue.use(VueRouter)

const routes = [
    {
        path: '/'
        , redirect: '/Login'
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
    mode:'hash',
    routes
})

router.beforeEach(async (to, from, next) => {
    let login = await checkCookie()
    if (login) {
        if (to.path == '/Home') {
            next()
        } else {
            return next('/Home')
        }
    } else {
        if (to.path == '/Login') {
            next()
        } else {
            next('/Login')
        }
    }
})

export default router