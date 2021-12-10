<template>
  <v-btn
    icon
    small
    fab
    :color="this.pv.subscribed ? 'green' : 'grey'"
    @click="toggle_subscribe"
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
  props: ["pv"],
  methods: {
    async toggle_subscribe() {
      let response;
      if (!this.pv.subscribed) response = await this.subscribe();
      else response = await this.unsubscribe();

      if (response === 200) this.$emit("update-sub");
    },
    async subscribe() {
      if ("granted" === (await Notification.requestPermission())) {
        let subscription = {};
        try {
          await this.$store.state.sw.ready;

          subscription =
            await this.$store.state.sw.pushManager.getSubscription();
          if (!subscription) {
            subscription = await this.$store.state.sw.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: b64_uint8(process.env.VUE_APP_PUSH_KEY),
            });
          }
        } catch {
          this.$store.commit(
            "showSnackbar",
            "A certificate error has occurred and we couldn't set up notifications for your browser. You can enable browser notifications by allowing insecure content in the site's permissions."
          );
        }

        const response = await fetch(
          `https://${this.$store.state.url}/simar/api/subscribe`,
          {
            method: "post",
            headers: {
              Authorization: `Bearer ${await this.get_token()}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              pvs: [
                {
                  name: this.pv.name,
                  hi_limit: this.pv.hi_limit,
                  lo_limit: this.pv.lo_limit,
                },
              ],
              sub: subscription,
            }),
          }
        );

        return response.status;
      }
      return false;
    },
    async unsubscribe() {
      const response = await fetch(
        `https://${this.$store.state.url}/simar/api/unsubscribe`,
        {
          method: "post",
          headers: {
            Authorization: `Bearer ${await this.get_token()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pvs: [this.pv.name],
          }),
        }
      );
      return response.status;
    },
  },
};
</script>
