<template>
  <div class="modal">
    <div class="modal-content" role="dialog">
      <header class="modal-header" id="modalTitle">
        <slot name="title"></slot>
        <button
          type="button"
          class="close"
          @click="closeModal"
          aria-label="Close Modal"
        >
          &times;
        </button>
      </header>
      <slot name="content"></slot>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
  },
};
</script>
<style>
.modal {
  z-index: 100;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  top: 0;
  left: 0;
  overflow: auto;
}
.modal-content {
  max-width: 680px;
  background-color: var(--color-background-soft);
  margin: 15% auto;
  padding: 20px;
  width: 80%;
}
.close {
  color: var(--color-heading);
  border: none;
  background: none;
  float: right;
  font-size: 28px;
  font-weight: bold;
}
.close:hover,
.close:focus {
  text-decoration: none;
  cursor: pointer;
}
</style>
