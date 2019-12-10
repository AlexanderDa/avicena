import Vue from 'vue'
export default class Notify extends Vue {
  public success (msg: string, duration?: number) {
    this.$toasted.show(
      `
          <i class="icon material-icons">check_circle</i>
          <div class="content">
            <p class="message">${msg}</p>
          </div>
        `,
      {
        duration: duration || 3000,
        className: 'toast',
        type: 'success'
      }
    )
  }
  public error (msg: string, duration?: number) {
    this.$toasted.show(
      `
          <i class="icon material-icons">warning</i>
          <div class="content">
            <p class="message">${msg}</p>
          </div>
        `,
      {
        duration: duration || 6000,
        className: 'toast',
        type: 'error'
      }
    )
  }
  public info (msg: string, duration?: number) {
    this.$toasted.show(
      `
          <i class="icon material-icons">info</i>
          <div class="content">
            <p class="message">${msg}</p>
          </div>
        `,
      {
        duration: duration || 7000,
        className: 'toast',
        type: 'info'
      }
    )
  }
}
