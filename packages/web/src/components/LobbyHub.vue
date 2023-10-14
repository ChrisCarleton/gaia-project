<template>
  <div class="columns block">
    <div class="column is-8-tablet">
      <p class="title">Players</p>

      <div v-for="player in lobby.players" :key="player.id" class="card block">
        <div class="card-content">
          <div class="media">
            <div class="media-left">
              <figure class="image is-64x64">
                <img class="is-rounded" :src="player.avatar ?? undefined" />
              </figure>
            </div>

            <div class="media-content">
              <p class="title">{{ player.displayName }}</p>
              <p class="subtitle">
                Joined {{ dayjs(player.memberSince).fromNow() }}
              </p>
            </div>

            <div class="media-right">
              <span
                v-if="player.id === lobby.ownerId"
                class="tag is-success is-rounded"
                >Lobby Owner</span
              >
            </div>
          </div>
        </div>

        <div class="card-footer">
          <a href="#" class="card-footer-item has-text-danger">Leave Lobby</a>
        </div>
      </div>

      <div v-if="isLobbyOwner" class="field is-grouped is-grouped-centered">
        <div class="control">
          <button class="button is-large is-primary">Start Game</button>
        </div>
      </div>
    </div>

    <div class="column is-4-tablet">
      <div class="message is-link has-text-centered">
        <div class="message-header">
          <p class="message-title">Lobby URL</p>
        </div>
        <div class="message-body">
          <p class="content block">
            Share this link with others so they can join your game:
          </p>

          <p class="content block">
            <span class="text-icon">
              <span class="is-family-monospace has-text-weight-bold">{{
                lobbyUrl
              }}</span>
              <span class="icon">
                <a
                  href="#"
                  aria-label="Copy URL to clipboard"
                  @click="onCopyLobbyUrl"
                >
                  <i class="fas fa-copy"></i>
                </a>
              </span>
              <span
                v-if="showCopiedMessage"
                class="tag is-rounded is-small is-success"
                >Copied!</span
              >
            </span>
          </p>

          <p class="block">
            <QRCode :value="lobbyUrl" :size="128" background="#eef6fc"></QRCode>
          </p>

          <p class="content block">Or give them the lobby code:</p>

          <p class="content block has-text-weight-bold is-family-monospace">
            {{ lobby.id }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Lobby } from '@/apiClient';
import { useStore } from '@/store';
import dayjs from 'dayjs';
import QRCode from 'qrcode.vue';
import { computed, ref } from 'vue';

interface LobbyHubProps {
  lobby: Lobby;
}

const store = useStore();

const props = defineProps<LobbyHubProps>();

const lobbyUrl = computed(() => window.location.toString());
const showCopiedMessage = ref(false);
const isLobbyOwner = computed(
  () => store.state.currentUser?.id === props.lobby.ownerId,
);

function onCopyLobbyUrl() {
  navigator.clipboard.writeText(lobbyUrl.value);
  showCopiedMessage.value = true;
  setTimeout(() => (showCopiedMessage.value = false), 3000);
}
</script>
