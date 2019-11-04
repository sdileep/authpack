import { generate } from '../utils/graphql'

export const RetrieveSession = generate<
  {},
  {
    session: {
      id: string
      created: string
      updated: string
      meta: { [key: string]: any }
    }
  }
>({
  name: 'RetrieveSession',
  query: `
    query RetrieveSession {
      session: RetrieveSession {
        id
        created
        updated
        meta
      }
    }
  `,
})