<script setup lang="ts">
/** Eigen illustratie: een vouwpoort die langzaam opent en weer sluit. Puur decoratief. */
</script>

<template>
  <svg viewBox="0 0 480 300" fill="none" aria-hidden="true" class="gate text-ink">
    <circle class="sun" cx="240" cy="150" r="104" fill="var(--brand)" opacity="0.12" />
    <circle class="sun-ring" cx="240" cy="150" r="104" stroke="var(--brand)" stroke-width="2" opacity="0.35" />
    <path d="M10 262h460" stroke="var(--line)" stroke-width="3" stroke-linecap="round" />

    <!-- poorten, achter de palen -->
    <g class="leaf leaf-left" stroke="currentColor" stroke-width="4" stroke-linecap="round">
      <rect x="44" y="96" width="196" height="152" rx="3" fill="var(--surface)" />
      <path d="M44 172h196M70 96v152M96 96v152M122 96v152M148 96v152M174 96v152M200 96v152M226 96v152" stroke-width="3" />
    </g>
    <g class="leaf leaf-right" stroke="currentColor" stroke-width="4" stroke-linecap="round">
      <rect x="240" y="96" width="196" height="152" rx="3" fill="var(--surface)" />
      <path d="M240 172h196M254 96v152M280 96v152M306 96v152M332 96v152M358 96v152M384 96v152M410 96v152" stroke-width="3" />
    </g>

    <!-- palen -->
    <rect x="22" y="70" width="22" height="192" rx="3" fill="currentColor" />
    <rect x="436" y="70" width="22" height="192" rx="3" fill="currentColor" />
    <rect x="18" y="62" width="30" height="12" rx="3" fill="var(--brand)" />
    <rect x="432" y="62" width="30" height="12" rx="3" fill="var(--brand)" />

    <!-- slot -->
    <g class="lock">
      <circle cx="240" cy="172" r="11" fill="var(--brand)" />
      <circle cx="240" cy="172" r="4" fill="var(--on-brand)" />
    </g>
  </svg>
</template>

<style scoped>
.leaf {
  animation-duration: 9s;
  animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
  animation-iteration-count: infinite;
}
.leaf {
  transform-box: fill-box;
}
.leaf-left {
  animation-name: fold;
  transform-origin: left center;
}
.leaf-right {
  animation-name: fold;
  transform-origin: right center;
}
.lock {
  animation: lock 9s ease-in-out infinite;
}
.sun {
  animation: sun 9s ease-in-out infinite;
  transform-origin: 240px 150px;
}

@keyframes fold {
  0%,
  12% {
    transform: scaleX(1);
  }
  38%,
  62% {
    transform: scaleX(0.14);
  }
  88%,
  100% {
    transform: scaleX(1);
  }
}
@keyframes lock {
  0%,
  10% {
    opacity: 1;
  }
  20%,
  80% {
    opacity: 0;
  }
  90%,
  100% {
    opacity: 1;
  }
}
@keyframes sun {
  0%,
  12%,
  88%,
  100% {
    transform: scale(0.9);
    opacity: 0.1;
  }
  38%,
  62% {
    transform: scale(1.12);
    opacity: 0.2;
  }
}
</style>
