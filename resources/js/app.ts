require("./bootstrap");

import $ from "jquery";
import Vue from "vue";
import vuetify from "./plugins/vuetify";


const files = require.context("./", true, /\.vue$/i);
files.keys().map(key =>
    Vue.component(
        key
            .split("/")
            .pop()
            .split(".")[0],
        files(key).default
    )
);

new Vue({
    vuetify,
    mounted() {
        this.resize();
        window.addEventListener("resize", this.resize);
    },
    methods: {
        resize() {
            $("#app").height(window.innerHeight);
            // 314 is the height of the log window and toolbar
            $("#primary-panel").height(window.innerHeight - 314);
        }
    }
}).$mount("#app");
