<template>
  <v-btn
    icon
    small
    fab
    :color="this.pv.subscribed ? 'green' : 'grey'"
    @click="toggle_subscribe"
    ><v-icon>{{ mdiBell }}</v-icon></v-btn
  >
</template>

<script>
import { mdiBell } from "@mdi/js";
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
  data() {
    return {
      mdiBell,
    };
  },
  methods: {
    async toggle_subscribe() {
      let response = this.pv.subscribed
        ? await this.unsubscribe()
        : await this.subscribe();

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
        } catch (err) {
          this.$store.commit(
            "showSnackbar",
            "A certificate error has occurred and we couldn't set up notifications for your browser. You can enable browser notifications by allowing insecure content in the site's permissions."
          );
        }

        const pv_data = {
          pvs: [
            {
              name: this.pv.name,
            },
          ],
          sub: subscription,
        };

        if (this.pv.value === "No" || this.pv.value === "Yes") {
          pv_data.pvs[0].hi_limit = 0;
          pv_data.pvs[0].lo_limit = 0;
        } else {
          pv_data.pvs[0].hi_limit = this.pv.hi_limit;
          pv_data.pvs[0].lo_limit = this.pv.lo_limit;
        }

        const response = await this.send_command("subscribe", pv_data);

        return response.status;
      }
      return undefined;
    },
    async unsubscribe() {
      const response = await this.send_command("unsubscribe", {
        pvs: [this.pv.name],
      });
      return response.status;
    },
  },
};
</script>
