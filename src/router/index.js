import Vue from 'vue';
import VueRouter from 'vue-router';
import { reqLogin } from '../api/index';

// import home from '../views/home.vue';

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('@/views/Home')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login')
    }
]

const router = new VueRouter({
    mode: 'hash',
    routes
})

router.beforeEach(async (to, from, next) => {
    if (to.path == '/login') {
        next()
    }else if (to.path == '/home') {
        if (from.path == '/home') {
            next()
        }else{
            let login = await reqLogin()
            if (login == true) {
                next()
            } else {
                next('/login')
            }  
        }
    }else next('/login')
})

export default router