import { generate } from '../utils/graphql'

export const ForgotUserPassword = generate<
  {
    value: {
      email: string
    }
  },
  {
    email: string
  }
>({
  name: 'ForgotUserPassword',
  query: `
    mutation ForgotUserPassword($value: ForgotUserPasswordValue!) {
      email: ForgotUserPassword(value: $value)
    }
  `,
})