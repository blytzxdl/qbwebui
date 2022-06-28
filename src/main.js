import Vue from 'vue'
import App from './App.vue'
import router from './router';
import store from './store';


import {
  // Button,
  // Select,
  // Container,
  // Header,
  // Aside,
  // Main,
  // Footer,
  // Menu,
  // Submenu,
  // MenuItem,
  // Row,
  // MenuItemGroup,
  // Col,
  // Table,
  // TableColumn,
  // Radio,
  // RadioGroup,
  // RadioButton,
  // Checkbox,
  // CheckboxButton,
  // CheckboxGroup,
  // Progress,
  // Descriptions,
  // DescriptionsItem,
  // Tag,
  Tree,
  // Form,
  FormItem,
  Input,
  Alert,
  // Dialog,
  // Option,
  // Switch,
  // Carousel,
  // CarouselItem,
} from 'element-ui';
// Vue.use(Container)
// Vue.use(Header)
// Vue.use(Aside)
// Vue.use(Main)
// Vue.use(Footer)
// Vue.use(Button)
// Vue.use(Select)
// Vue.use(Menu)
// Vue.use(Submenu)
// Vue.use(MenuItem)
// Vue.use(Row)
// Vue.use(MenuItemGroup)
// Vue.use(Col)
// Vue.use(Table)
// Vue.use(TableColumn)
// Vue.use(Radio)
// Vue.use(RadioGroup)
// Vue.use(RadioButton)
// Vue.use(Checkbox)
// Vue.use(CheckboxButton);
// Vue.use(CheckboxGroup);
// Vue.use(Progress);
// Vue.use(DescriptionsItem);
// Vue.use(Descriptions);
// Vue.use(Tag);
Vue.use(Tree);
// Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Alert);
// Vue.use(Dialog);
// Vue.use(Option);
// Vue.use(Switch);
// Vue.use(Carousel);
// Vue.use(CarouselItem);



import { Button, Swipe, SwipeItem, Progress, Icon, SwipeCell, Search, Tab, Tabs, NoticeBar, Form, Field } from 'vant';
Vue.use(Button)
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Progress);
Vue.use(Icon);
Vue.use(SwipeCell);
Vue.use(Search);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(NoticeBar);
Vue.use(Form);
Vue.use(Field);
import '@vant/touch-emulator';



Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate() {
    Vue.prototype.$bus = this
  }
}).$mount('#app')
