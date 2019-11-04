import { generate } from '../utils/graphql'

export const UpdateMembership = generate<
  {
    id: string
    value: {
      permissions?: string[]
      meta?: { [key: string]: any }
    }
  },
  {
    membership: {
      id: string
      created: string
      updated: string
      meta: { [key: string]: any }
    }
  }
>({
  name: 'UpdateMembership',
  query: `
    mutation UpdateMembership($id: String!, $value: UpdateMembershipValue!) {
      membership: UpdateMembership(id: $id, value: $value) {
        id
        created
        updated
        meta
      }
    }
  `,
})