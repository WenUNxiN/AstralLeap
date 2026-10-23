import { reactive } from 'vue'

// Keep counts across page/footer changes without counting the same visit again.
export const visitorStats = reactive({ pageViews: '—', visitors: '—' })
