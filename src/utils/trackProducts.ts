// Avisa a /api/stats que se vio un producto o se pidió por WhatsApp.
// Usa sendBeacon para que el aviso llegue aunque el clic abra WhatsApp y se deje la página.

type StatEvent = 'view' | 'order'

export function trackProducts(event: StatEvent, ids: string[]) {
  if (typeof window === 'undefined' || ids.length === 0) return

  // Una visita por producto y sesión, así recargar la página no infla el número.
  if (event === 'view') {
    try {
      const key = `mb-viewed-${ids[0]}`
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, '1')
    } catch {
      // sin sessionStorage (modo privado): se cuenta igual
    }
  }

  const body = JSON.stringify({ event, ids })
  const sent = navigator.sendBeacon?.('/api/stats', new Blob([body], { type: 'application/json' }))
  if (!sent) {
    fetch('/api/stats', { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(() => {})
  }
}
