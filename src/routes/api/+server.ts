import type { PageServerLoad } from './$types'

export const load = ((req) => {
  console.log(req)
  return {
    title: "lifu"
  }
}) satisfies PageServerLoad