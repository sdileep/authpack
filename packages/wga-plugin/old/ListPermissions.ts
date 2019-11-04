import { generate } from '../utils/graphql'

export const ListPermissions = generate<
  {
    options?: {
      limit?: number
      skip?: number
      sort?: string
      reverse?: boolean
    }
  },
  {
    permissions: Array<{
      id: string
      created: string
      updated: string
      meta: { [key: string]: any }
    }>
  }
>({
  name: 'ListPermissions',
  query: `
    query ListPermissions($options: FilterOptions) {
      permissions: ListPermissions(options: $options) {
        id
        created
        updated
        meta
      }
    }
  `,
})