<template>
  <button
    :class="['button', direction]"
    :style="style"
    :disabled="disabled"
    :title="text"
    @click="$emit('click')"
  >
    <feather v-if="icon" :type="icon" />
    &nbsp;{{ text }}
  </button>
</template>

<script>
export default {
  name: "TextButton",
  props: {
    text: {
      type: String,
      required: true,
      default: "blabla"
    },
    textColor: {
      type: String,
      default: "white"
    },
    backgroundColor: {
      type: String,
      default: "#0bb3a2"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ""
    },
    direction: {
      type: String,
      default: "left"
    }
  },
  data() {
    return {
      hovering: false
    };
  },
  computed: {
    style() {
      return { color: this.textColor, backgroundColor: this.backgroundColor };
    }
  },
  methods: {
    mouseOver() {
      this.hovering !== this.hovering;
    }
  }
};
</script>

<style lang="scss" scoped>
.center {
  margin: $xsmall auto;
}

.left {
  margin: $xsmall auto $xsmall 0;
}

.right {
  margin: $xsmall 0 $xsmall auto;
}

.button {
  transition: filter 0.5s ease;
  font-family: "nexablack";
  border-radius: 35px;
  letter-spacing: 0.18em;
  display: flex;
  position: relative;
  align-items: center;
  border: none;
  text-transform: uppercase;
  color: white;
  font-size: 0.9rem;
  padding: 0.6rem 0.8rem 0.6rem 0.8em;
  bottom: 0;
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    filter: brightness(120%);
  }
}
</style>

<docs>
This is a normal text button that can have an icon.

```jsx
<TextButton text="Hello" textColor="black"/>
```

```jsx
<TextButton icon="x" backgroundColor="#2b239e" text="Hello" />
```

</docs>
