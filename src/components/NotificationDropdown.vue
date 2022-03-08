<template>
  <v-col>
    <v-menu
      v-if="$store.state.account"
      bottom
      min-width="300px"
      rounded
      offset-y
    >
      <template v-slot:activator="{ on }">
        <v-badge
          :content="$store.state.notification_count"
          :value="$store.state.notification_count"
          color="red"
          overlap
          offset-x="25px"
          offset-y="25px"
        >
          <v-btn icon medium v-on="on">
            <v-icon medium>
              {{ mdiBell }}
            </v-icon>
          </v-btn>
        </v-badge>
      </template>
      <v-list width="400px" max-height="500px" class="overflow-y-auto">
        <notification-dialog />
        <v-divider/>
        <v-list-item
          v-for="notification of $store.state.notifications"
          :key="notification.oid"
        >
          <v-list-item-content>
            {{ notification.message }}
            <v-list-item-subtitle>{{ notification.date }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click="remove_notification(notification.oid)">
              <v-icon color="grey lighten-1">{{ mdiClose }}</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-col>
</template>

<script>
import { mdiBell, mdiClose } from "@mdi/js";
import NotificationDialog from "./NotificationDialog.vue";

export default {
  data() {
    return {
      mdiBell,
      mdiClose,
    };
  },
  components: { NotificationDialog },
  methods: {
    async remove_notification(oid) {
      await this.send_command(`notification?oid=${oid}`, {}, "DELETE");
      this.$store.commit("updateNotifications");
    },
  },
};
</script>