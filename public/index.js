var PostsNewPage = {
  template: "#posts-new-page",
  data: function() {
    return {
      title: "",
      body: "",
      image: "",
      errors: []
    };
  },
  methods: {
    submit: function() {
      var params = {
        title: this.title,
        body: this.body,
        image: this.image
      };
      axios
        .post("/v1/posts", params)
        .then(function(response) {
          router.push("/");
        })
        .catch(
          function(error) {
            this.errors = error.response.data.errors;
          }.bind(this)
        );
    }
  }
};


var LogoutPage = {
  template: "<h1>Logout</h1>",
  created: function() {
    axios.defaults.headers.common["Authorization"] = undefined;
    localStorage.removeItem("jwt");
    router.push("/");
  }
};

var LoginPage = {
  template: "#login-page",
  data: function() {
    return {
      email: "",
      password: "",
      errors: []
    };
  },
  methods: {
    submit: function() {
      var params = {
        auth: { email: this.email, password: this.password }
      };
      axios
        .post("/user_token", params)
        .then(function(response) {
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + response.data.jwt;
          localStorage.setItem("jwt", response.data.jwt);
          router.push("/");
        })
        .catch(
          function(error) {
            this.errors = ["Invalid email or password."];
            this.email = "";
            this.password = "";
          }.bind(this)
        );
    }
  }
};


var SignupPage = {
  template: "#signup-page",
  data: function() {
    return {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      errors: []
    };
  },
  methods: {
    submit: function() {
      var params = {
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.passwordConfirmation
      };
      axios
        .post("/v1/users", params)
        .then(function(response) {
          router.push("/login");
        })
        .catch(
          function(error) {
            this.errors = error.response.data.errors;
          }.bind(this)
        );
    }
  }
};


var PostShowPage = {
  template: "#post-show-page",
  data: function() {
    return {
      message: "Here is a page just for this post",
      post: {}
    };
  },
  created: function() {
    axios.get("/v1/posts/" + this.$route.params.id).then(function(response) {
      this.post = response.data;
    }.bind(this));
  },
  methods: {},
  computed: {}
};

var HomePage = {
  template: "#home-page",
  data: function() {
    return {
      message: "Welcome to Vue.js!",
      posts: [],
      currentPost: {title: "", body: "", image: ""},
      errors: []
    };
  },
  created: function() {
    axios.get("/v1/posts").then(function(response) {
      console.log(response.data); 
      this.posts = response.data;
    }.bind(this));
  },
  methods: {
    setCurrentPost: function(inputPost) {
      this.currentPost = inputPost;
    },

    updatePost: function() {
      var params = {
        title: this.currentPost.title,
        body: this.currentPost.body,
        image: this.currentPost.image
      };
      axios.patch("/v1/posts/" + this.curerentPost.id, params).then(function(response) {
        console.log('done with updating');
      });

    }
  },
  computed: {}
};

var router = new VueRouter({
  routes: [
    { path: "/", component: HomePage },
    { path: "/signup", component: SignupPage },
    { path: "/login", component: LoginPage },
    { path: "/logout", component: LogoutPage },
    { path: "/posts/new", component: PostsNewPage },
    { path: "/posts/:id", component: PostShowPage }

  ],
  scrollBehavior: function(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

var app = new Vue({
  el: "#vue-app",
  router: router
});











