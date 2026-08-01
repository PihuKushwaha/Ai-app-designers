function download(filename, content, mime) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function exportMarkdown(appName, markdown) {
  download(`${slug(appName)}-blueprint.md`, markdown, 'text/markdown')
}

export function exportJson(appName, { idea, history, markdown }) {
  const payload = { appName, idea, history, blueprint: markdown, generatedAt: new Date().toISOString() }
  download(`${slug(appName)}-blueprint.json`, JSON.stringify(payload, null, 2), 'application/json')
}

function slug(text) {
  return (text || 'app')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 40)
}
