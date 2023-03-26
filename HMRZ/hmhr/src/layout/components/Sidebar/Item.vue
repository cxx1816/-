<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const that = context.parent // 拿到父级vue组件对象(this值)
    const vnodes = []

    if (icon) {
      if (icon.includes('el-icon')) {
        vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      } else {
        vnodes.push(<svg-icon icon-class={icon}/>)
      }
    }

    if (title) {
      vnodes.push(<span slot='title'>{(that.$t(`sidebar.${title.toLowerCase()}`))}</span>)
    }
    return vnodes
  }
}
</script>

<style scoped>
.sub-el-icon {
  width: 1em;
  height: 1em;
  color: currentcolor;
}
</style>
