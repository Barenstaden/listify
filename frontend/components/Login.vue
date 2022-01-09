<template>
  <Card
    class="max-w-screen-sm rounded-xl bg-white mx-auto text-center py-4 md:py-10"
  >
    <div v-if="$auth.loggedIn">
      <h3 class="text-2xl">Du er allerede logget inn</h3>
      <Button to="/shopping-list" class="mt-4">Gå til din handleliste</Button>
      <Button class="ml-2" @click.native="$emit('loggedIn')" color="red"
        >Lukk</Button
      >
    </div>
    <div v-else>
      <div v-if="!resetPasswordSent">
        <div v-if="!isUser">
          <h3 class="text-2xl font-bold">
            <span v-if="!message"></span>
            <span v-else>{{ message }}</span>
          </h3>
        </div>
      </div>
      <form
        v-if="!resetPasswordSent && !$auth.loggedIn"
        @submit.prevent="checkEmail()"
        class="px-2 md:px-10 md:pt-10"
      >
        <Input
          v-model="email"
          type="email"
          @input="[(newUser = false), (newUser = false)]"
          label="E-post"
          placeholder="ola@nordmann.no"
          :focus="focus"
          required
        />
        <Input
          v-if="newUser"
          v-model="name"
          type="text"
          label="Ditt navn"
          placeholder="Ola"
          :focus="true"
          :required="true"
        />
        <Input
          v-if="isUser || newUser"
          v-model="password"
          type="password"
          :label="newUser ? 'Velg et passord' : 'Ditt passord'"
          placeholder="********"
          :focus="isUser == true"
          :required="true"
        />
        <p class="text-red-700" v-if="error">Feil passord</p>
        <Button
          @click.native="forgotPassword"
          type="button"
          class="mr-2"
          color="red"
          v-if="error"
          ><Loading text="Glemt passord" :loading="loading"
        /></Button>
        <Button :disabled="loading" type="submit" class="mt-5">
          <Loading
            :text="newUser ? 'Kom i gang' : 'Fortsett'"
            :loading="loading"
          />
        </Button>
      </form>
      <div class="grid" v-else>
        <p>
          Trykk på lenken vi sendte deg på e-post for å tilbakestille passordet
          ditt.
        </p>
        <Button
          class="mt-4"
          color="red"
          @click.native="[(resetPasswordSent = false), $emit('loggedIn')]"
          >Lukk</Button
        >
      </div>
    </div>
  </Card>
</template>

<script>
export default {
  data: () => ({
    email: "",
    name: "",
    isUser: "",
    newUser: false,
    password: "",
    loading: false,
    error: false,
    resetPasswordSent: false
  }),
  props: {
    focus: Boolean,
    message: String
  },
  created() {
    this.email = this.$route.query?.email || "";
  },
  methods: {
    async checkEmail() {
      this.loading = true;
      if (this.isUser) return this.login();
      if (this.email && this.password && this.name && !this.isUser)
        return this.register();
      try {
        this.isUser = await this.$axios
          .get(`/users-permissions/exists?email=${this.email}`)
          .then(res => res.data);
        if (!this.isUser) this.newUser = true;
      } catch (error) {
        console.log(error);
        this.newUser = true;
      }
      this.loading = false;
    },
    async login() {
      try {
        const user = await this.$auth
          .loginWith("local", {
            data: {
              identifier: this.email.toLowerCase(),
              password: this.password
            }
          })
          .then(res => res.data.user);
        await this.$axios.put(`/users/${this.$auth.user.id}`, {
          last_login: new Date()
        });
        this.$emit("loggedIn", user);
      } catch (error) {
        this.error = true;
      }
      this.loading = false;
    },
    async register() {
      try {
        const { name, password, email } = this;
        const res = await this.$axios.post("/auth/local/register", {
          name,
          password,
          email,
          username: email,
          online: false
        });
        this.setLoginData(res.data);
      } catch (error) {
        window.location.reload();
      }
      this.loading = false;
    },
    async forgotPassword() {
      this.loading = true;
      const res = await this.$axios.post("/auth/forgot-password", {
        email: this.email
      });
      this.resetPasswordSent = res.data.ok;
      this.loading = false;
    }
  }
};
</script>
