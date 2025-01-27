import * as yup from 'yup'
import { createElement as create, FC } from 'react'
import {
  useSchema,
  Button,
  Layout,
  Control,
  InputString,
  InputSelect,
  InputStringArray,
  Page,
} from '@authpack/theme'
import { createUseServer } from '../hooks/useServer'

export const CreateProvider: FC<{
  change?: (id?: string) => void
}> = ({ change }) => {
  const gqlCreateProvider = useCreateProvider()
  const schema = useSchema({
    schema: SchemaCreateProvider,
    submit: value => {
      gqlCreateProvider
        .fetch({ value })
        .then(({ provider }) => change && change(provider.id))
    },
  })
  return create(Page, {
    title: 'New',
    subtitle: 'Provider',
    children: create(Layout, {
      column: true,
      padding: true,
      divide: true,
      children: [
        create(Control, {
          key: 'preset',
          label: 'Preset',
          error: schema.error('preset'),
          children: create(InputSelect, {
            value: schema.value('preset'),
            change: schema.change('preset'),
            options: [
              { value: 'facebook', label: 'Facebook' },
              { value: 'google', label: 'Google' },
              { value: 'github', label: 'GitHub' },
              { value: 'slack', label: 'Slack' },
            ],
          }),
        }),
        create(Control, {
          key: 'client',
          label: 'Client Id',
          helper: `The oauth client id provided by ${schema.value('preset') ||
            'the app'}`,
          error: schema.error('client'),
          children: create(InputString, {
            value: schema.value('client'),
            change: schema.change('client'),
            placeholder: '...',
          }),
        }),
        create(Control, {
          key: 'secret',
          label: 'Secret',
          helper: `The oauth secret provided by ${schema.value('preset') ||
            'the app'}`,
          error: schema.error('secret'),
          children: create(InputString, {
            value: schema.value('secret'),
            change: schema.change('secret'),
            placeholder: '...',
          }),
        }),
        create(Control, {
          key: 'scopes',
          label: 'Scopes',
          helper: 'A set of oauth permission scopes',
          error: schema.error('scopes'),
          children: create(InputStringArray, {
            value: schema.value('scopes'),
            change: schema.change('scopes'),
            placeholder: '...',
          }),
        }),
        create(Control, {
          key: 'redirect_uri',
          label: 'Advanced - Redirect Uri',
          helper:
            'Leave this empty unless you are creating your own login system',
          error: schema.error('redirect_uri'),
          children: create(InputString, {
            value: schema.value('redirect_uri'),
            change: schema.change('redirect_uri'),
            placeholder: 'https://gadgets.v1.authpack.io',
          }),
        }),
        create(Button, {
          key: 'submit',
          label: 'Create',
          loading: gqlCreateProvider.loading,
          disabled: !schema.valid,
          click: schema.submit,
        }),
      ],
    }),
  })
}

const SchemaCreateProvider = yup.object().shape({
  preset: yup
    .string()
    .oneOf(['facebook', 'google', 'github', 'slack'])
    .required('Please provide a preset'),
  client: yup.string().required('Please provide the oauth client id'),
  secret: yup.string().required('Please provide the oauth secret'),
  redirect_uri: yup.string(),
  scopes: yup
    .array()
    .of(yup.string().required())
    .default([]),
})

const useCreateProvider = createUseServer<{
  provider: {
    id: string
  }
}>({
  query: `
    mutation CreateProvider($value: CreateProviderValue!) {
      provider: CreateProvider(value: $value) {
        id
      }
    }
  `,
})
