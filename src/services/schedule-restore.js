import { apiConfig } from "./api-config.js"

export async function scheduleRestore(data) {
  const { id: _, ...clean } = data

  await fetch(`${apiConfig.baseURL}/schedules`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(clean)
  })
}