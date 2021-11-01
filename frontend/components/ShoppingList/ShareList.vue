<template>
  <div class="mt-5">
    <Button color="white" class="text-white" @click.native="share = true"
      >Del handleliste</Button
    >
    <Modal v-if="share" @closeModal="share = false">
      <div class="grid">
        <h2 class="text-xl">Del handleliste</h2>
        <p>Kopier lenken nedenfor og send til de du ønsker å dele med</p>
        <Button v-if="!copied" @click.native="copyLink()" class="mt-2"
          >Klikk her for å kopiere lenken</Button
        >
        <p v-if="copied" class="text-center text-lg text-green-700">
          Linken ble kopiert og du kan lime den inn der du ønsker å dele listen
          fra.
        </p>
        <p v-if="error" class="text-center text-lg text-red-700">
          Noe gikk galt! Forsøk å laste inn siden på nytt.
        </p>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  props: {
    token: String
  },
  data: () => ({
    share: false,
    copied: false,
    error: false
  }),
  methods: {
    async copyLink() {
      if (!navigator.canShare) {
        const link = `${window.location.href}?access_token=${this.token}`;
        await navigator.clipboard.writeText(link);
        this.copied = true;
        return;
      }

      const data = {
        url: `${window.location.href}?access_token=${this.token}`,
        title: `Bli med på handlelisten min på Listify`
      };
      await navigator.share(data);
    }
  }
};
</script>

<style></style>
