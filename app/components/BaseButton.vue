<script setup lang="ts">
import { checkTween } from '@vendor/checkTween'

interface Props {
  text: string
  icon: 'arrow-up' | 'arrow-down' | 'arrow-left' | 'arrow-right' | 'arrow-link'
  delay?: number
  href?: string
  anchor?: string
  variant?: 'dark' | 'light'
  iconPosition?: 'left' | 'right'
  disabled?: boolean
}

const { $gsap: gsap } = useNuxtApp()

// PROPS
const props = withDefaults(defineProps<Props>(), {
  text: '',
  icon: 'arrow-link',
  href: '',
  anchor: '',
  delay: 0.2,
  variant: 'dark',
  iconPosition: 'right',
  disabled: false
})

// REFS
const buttonRef = shallowRef<HTMLElement | null>(null)
const buttonTextRef = shallowRef<HTMLElement | null>(null)
const buttonIconRef = shallowRef<HTMLElement | null>(null)

// VARIABLES
let animation: gsap.core.Timeline | null = null

// ANIMATIONS
const animateEnter = () => {
  if (!buttonRef.value) return

  animation = gsap.timeline({
    delay: props.delay
  })

  animation.to(buttonRef.value, {
    opacity: 1,
    duration: 0.4,
    ease: '--io2'
  })
}

// LIFECYCLE
useSetup(() => {
  animateEnter()
})

onBeforeUnmount(() => {
  checkTween(animation)
})
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    ref="buttonRef"
    :class="[
      'base-button',
      {
        'base-button--disabled': disabled,
        'base-button--left': iconPosition === 'left',
        'base-button--dark': variant === 'dark',
        'base-button--light': variant === 'light'
      }
    ]"
    :href="href ? href : undefined"
    :target="href && '_blank'"
    :rel="href && 'noopener'"
    style="opacity: 0"
  >
    <div v-if="iconPosition === 'left'" ref="buttonIconRef" class="base-button-icon">
      <svg v-if="icon === 'arrow-up'" viewBox="0 0 17 17">
        <path d="M8.5 7.89189L5.05 11L4 10.0541L8.5 6L13 10.0541L11.95 11L8.5 7.89189Z" />
      </svg>
      <svg v-else-if="icon === 'arrow-down'" viewBox="0 0 17 17">
        <path d="M8.5 9.10811L11.95 6L13 6.94595L8.5 11L4 6.94595L5.05 6L8.5 9.10811Z" />
      </svg>
      <svg v-else-if="icon === 'arrow-left'" viewBox="0 0 17 17">
        <path d="M7.89189 8.5L11 11.95L10.0541 13L6 8.5L10.0541 4L11 5.05L7.89189 8.5Z" />
      </svg>
      <svg v-else-if="icon === 'arrow-right'" viewBox="0 0 17 17">
        <path d="M9.10811 8.5L6 5.05L6.9459 4L11 8.5L6.9459 13L6 11.95L9.10811 8.5Z" />
      </svg>
      <svg v-else-if="icon === 'arrow-link'" viewBox="0 0 17 17">
        <path d="M12 5L12 11L10.6 11L10.6 7.4L6 12L5 11L9.6 6.4L6 6.4L6 5L12 5Z" />
      </svg>
    </div>
    <div ref="buttonTextRef" class="base-button-text">
      <slot>{{ text }}</slot>
    </div>
    <div v-if="iconPosition === 'right'" ref="buttonIconRef" class="base-button-icon">
      <svg v-if="icon === 'arrow-up'" viewBox="0 0 17 17">
        <path d="M8.5 7.89189L5.05 11L4 10.0541L8.5 6L13 10.0541L11.95 11L8.5 7.89189Z" />
      </svg>
      <svg v-else-if="icon === 'arrow-down'" viewBox="0 0 17 17">
        <path d="M8.5 9.10811L11.95 6L13 6.94595L8.5 11L4 6.94595L5.05 6L8.5 9.10811Z" />
      </svg>
      <svg v-else-if="icon === 'arrow-left'" viewBox="0 0 17 17">
        <path d="M7.89189 8.5L11 11.95L10.0541 13L6 8.5L10.0541 4L11 5.05L7.89189 8.5Z" />
      </svg>
      <svg v-else-if="icon === 'arrow-right'" viewBox="0 0 17 17">
        <path d="M9.10811 8.5L6 5.05L6.9459 4L11 8.5L6.9459 13L6 11.95L9.10811 8.5Z" />
      </svg>
      <svg v-else-if="icon === 'arrow-link'" viewBox="0 0 17 17">
        <path d="M12 5L12 11L10.6 11L10.6 7.4L6 12L5 11L9.6 6.4L6 6.4L6 5L12 5Z" />
      </svg>
    </div>
  </component>
</template>
