<template>
  <v-btn icon small fab color="grey" @click="toggle_subscribe"
    ><v-icon>mdi-bell</v-icon></v-btn
  >
</template>

<script>
function b64_uint8(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default {
  components: {},
  props: ["pv"],
  data: function () {
    return {};
  },
  methods: {
    async toggle_subscribe() {
      if (!this.pv.subscribed) await this.subscribe();
      else await this.unsubscribe();

      this.$emit("update-sub");
    },
    async subscribe() {
      if ("granted" === (await Notification.requestPermission())) {
        await this.$store.state.sw.ready;

        let subscription =
          await this.$store.state.sw.pushManager.getSubscription();
        if (!subscription) {
          subscription = await this.$store.state.sw.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: b64_uint8(process.env.VUE_APP_PUSH_KEY),
          });
        }

        await fetch(`http://127.0.0.1:5000/simar/api/subscribe`, {
          method: "post",
          headers: {
            Authorization: `Bearer ${await this.get_token()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pvs: {
              name: this.pv.name,
              hi_limit: this.pv.hi_limit,
              lo_limit: this.pv.lo_limit,
            },
            sub: subscription,
          }),
        });
      }
    },
    async unsubscribe() {
      await fetch(`http://127.0.0.1:5000/simar/api/unsubscribe`, {
        method: "post",
        headers: {
          Authorization: `Bearer ${await this.get_token()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pv: this.pv.name,
        }),
      });
    },
  },
};
</script>
