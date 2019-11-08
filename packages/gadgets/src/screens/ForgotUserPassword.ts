import * as yup from 'yup'
import { createElement as create, FC } from 'react'
import {
  Gadgets,
  useSchema,
  Layout,
  Control,
  InputString,
  Button,
} from 'wga-theme'
import { useSettings } from '../hooks/useSettings'
import { createUseServer } from '../hooks/useServer'

export const ForgotUserPassword: FC = () => {
  const gqlForgotUserPassword = useForgotUserPassword()
  const settings = useSettings()
  const schema = useSchema({
    schema: yup.object().shape({
      email: yup
        .string()
        .email('Please make sure you have used a valid email address')
        .required('Please provide your email'),
    }),
    submit: value => {
      gqlForgotUserPassword.fetch({ value })
    },
  })
  return create(Gadgets, {
    title: 'Forgot Password',
    subtitle: settings.appname,
    children: create(Layout, {
      column: true,
      padding: true,
      divide: true,
      children: [
        create(Control, {
          key: 'email',
          label: 'Email',
          helper: 'Please provide the email linked to your account',
          error: schema.error('email'),
          children: create(InputString, {
            value: schema.value('email'),
            change: schema.change('email'),
            placeholder: 'example@email.com',
          }),
        }),
        create(Button, {
          key: 'submit',
          label: 'Send Reset Email',
          disabled: !schema.valid,
          click: schema.submit,
        }),
      ],
    }),
  })
}

const useForgotUserPassword = createUseServer<{
  email: string
}>({
  name: 'ForgotUserPassword',
  query: `
    mutation ForgotUserPassword($value: ForgotUserPasswordValue!) {
      email: ForgotUserPassword(value: $value)
    }
  `,
})
