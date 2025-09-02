<script setup lang="ts">
const { container } = useThemeTrigger({
  headerTheme: 'dark',
  hasLeaveCallback: true
})

const transitionType = useTransitionType()

// REFS
const mainRef = ref<HTMLElement | null>(null)

// SEO
useMetadata({
  title: 'Projet',
  description: 'Page projet'
})
</script>

<template>
  <div id="case" ref="mainRef" class="page page-bg">
    <section class="case-hero">
      <div class="case-hero__fig-wrapper">
        <figure v-if="transitionType !== 'case-next'" class="case-footer__fig">
          <img src="/images/2.webp" alt="project image" width="1440" height="1800" loading="lazy" />
        </figure>
      </div>
    </section>
    <section ref="container">
      <div class="case-paragraph st-l">
        Shin Okuda was born in Fukuoka,Japan and now lives and works in LosAngeles, CA. He also
        collaborates on the concept space IKO IKO.For information about purchasing, commissions
        cacapipimdr,or press, please contact:
      </div>
      <div class="case-paragraph st-l st-3">
        Shin Okuda was born in Fukuoka,Japan and now lives and works in LosAngeles, CA. He also
        collaborates on the concept space IKO IKO.For information about purchasing, commissions
        cacapipimdr,or press, please contact:
      </div>
      <div class="case-paragraph st-l st-6">
        Shin Okuda was born in Fukuoka,Japan and now lives and works in LosAngeles, CA. He also
        collaborates on the concept space IKO IKO.For information about purchasing, commissions
        cacapipimdr,or press, please contact:
      </div>
    </section>
    <footer class="case-footer">
      <nuxt-link to="/works/two" class="case-footer__link">
        <div class="letter-N case-footer__header h1 fw470 gutters">
          Next
          <svg class="case-footer__svg" fill="currentColor" viewBox="0 0 79 91">
            <path
              d="m7.233 44.216 32.196 32.52 32.196-32.662L79 51.205 39.43 91 0 51.348zM44.961 0v82.014H33.898V0z"
            />
          </svg>
        </div>
        <div class="case-footer__wrapper">
          <div class="case-footer__inner">
            <figure class="case-footer__fig">
              <img
                src="/images/2.webp"
                alt="project image"
                width="1440"
                height="1800"
                loading="lazy"
              />
            </figure>
          </div>
        </div>
      </nuxt-link>
    </footer>
  </div>
</template>

<style lang="scss">
.case-hero {
  position: relative;
  height: 100dvh;
  overflow: hidden;
}

.case-hero__fig-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.case-paragraph {
  font-size: 4.8rem;
  line-height: 1.2;
  width: calc(var(--column) * 7);
  padding-top: 4rem;
  padding-bottom: 4rem;
  margin-left: var(--margin);
}

.case-footer {
  color: #0b0b0b;
  position: relative;
  padding-top: 20rem;
  z-index: 2;
}

.case-footer__link {
  display: flex;
  flex-direction: column;
}

@media (min-width: 1024px) {
  .case-footer__link {
    row-gap: 0.23148vw;
  }
}

.case-footer__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 0.6rem;
  font-size: 17.5rem;
  line-height: 0.8;
  letter-spacing: -0.04em;
}

@media (min-width: 1024px) {
  .case-footer__header {
    margin-bottom: unset;
  }
}

.case-footer__svg {
  height: 5.8rem;
  width: 5rem;
}

@media (min-width: 1024px) {
  .case-footer__svg {
    height: 9.43287vw;
    width: 8.21759vw;
  }
}

.case-footer__wrapper {
  height: 30rem;
  position: relative;
}

@media (min-width: 1024px) {
  .case-footer__wrapper {
    height: 26.79398vw;
  }
}

.case-footer__fig {
  height: 100%;
}

.case-footer__inner {
  position: absolute;
  top: 0;
  left: 0;
  height: 100dvh;
  width: 100%;
}

.case-footer__content {
  bottom: 0;
  color: #f8f8f8;
  height: 74.76%;
  left: 0.8rem;
  position: absolute;
  width: calc(100% - 0.8rem);
}

@media (min-width: 1024px) {
  .case-footer__content {
    display: none;
    height: 77.4%;
    left: unset;
    right: 0.46296vw;
    width: 87.847%;
  }
}

.case-footer__content.acetate {
  inset: unset;
  bottom: 0;
  left: 0.8rem;
}

@media (min-width: 1024px) {
  .case-footer__content.acetate {
    left: unset;
    right: 0.46296vw;
  }
}

.case-footer__content--main {
  z-index: 2;
}
</style>
