import * as yup from 'yup'
import { createElement as create, FC, useEffect, useRef } from 'react'
import {
  useSchema,
  Button,
  Layout,
  Control,
  InputSelect,
  drip,
  Page,
  InputSelectMany,
  InputBoolean,
} from '@authpack/theme'
import { createUseServer } from '../hooks/useServer'

export const CreateMembership: FC<{
  user_id?: string
  team_id?: string
  change?: (id?: string) => void
}> = ({ change, user_id, team_id }) => {
  const gqlCreateMembership = useCreateMembership()
  const gqlListUsers = useListUsers()
  const gqlListTeams = useListTeams()
  const gqlListPermissions = useListPermissions()
  const queryListUsers = useRef(drip(1000, gqlListUsers.fetch))
  const queryListTeams = useRef(drip(1000, gqlListTeams.fetch))
  const schema = useSchema({
    schema: SchemaCreateMembership,
    submit: value => {
      gqlCreateMembership
        .fetch({ value })
        .then(({ membership }) => change && change(membership.id))
    },
  })
  useEffect(() => {
    queryListUsers.current()
    queryListTeams.current()
    gqlListPermissions.fetch()
    // eslint-disable-next-line
  }, [])
  useEffect(() => {
    setTimeout(() => {
      schema.set({
        ...schema.state,
        team_id,
        user_id,
      })
    })
    // eslint-disable-next-line
  }, [user_id, team_id])
  return create(Page, {
    title: 'New',
    subtitle: 'Membership',
    children: create(Layout, {
      column: true,
      padding: true,
      divide: true,
      children: !gqlListPermissions.data
        ? null
        : [
            !user_id &&
              create(Control, {
                key: 'user_id',
                label: 'User',
                error: schema.error('user_id'),
                children: create(InputSelect, {
                  value: schema.value('user_id'),
                  change: schema.change('user_id'),
                  placeholder: 'Select user...',
                  filter: phrase => queryListUsers.current({ phrase }),
                  options: !gqlListUsers.data
                    ? []
                    : gqlListUsers.data.users.map(user => ({
                        value: user.id,
                        label:
                          user.name && user.username
                            ? `${user.name} - ${user.username}`
                            : user.name || user.username,
                        helper: user.email,
                      })),
                }),
              }),
            !team_id &&
              create(Control, {
                key: 'team_id',
                label: 'Team',
                helper: 'Optionally select a team to be added to membership',
                error: schema.error('team_id'),
                children: create(InputSelect, {
                  value: schema.value('team_id'),
                  change: schema.change('team_id'),
                  placeholder: 'Select team...',
                  filter: phrase => queryListTeams.current({ phrase }),
                  options: !gqlListTeams.data
                    ? []
                    : gqlListTeams.data.teams.map(team => ({
                        value: team.id,
                        label: `${team.name} (${team.tag})`,
                        helper: team.description,
                      })),
                }),
              }),
            create(Control, {
              key: 'admin',
              label: 'Admin',
              helper: 'Is this user an admin of the team',
              error: schema.error('admin'),
              children: create(InputBoolean, {
                value: schema.value('admin'),
                change: schema.change('admin'),
              }),
            }),
            !!gqlListPermissions.data.permissions.length &&
              create(Control, {
                key: 'permission_ids',
                label: 'Permissions',
                helper: 'Determine what the member can access',
                error: schema.error('permission_ids'),
                children: create(InputSelectMany, {
                  value: schema.value('permission_ids'),
                  change: schema.change('permission_ids'),
                  options: gqlListPermissions.data.permissions.map(
                    permission => {
                      return {
                        value: permission.id,
                        icon: 'user-sheild',
                        label: permission.name,
                        helper: permission.description,
                      }
                    }
                  ),
                }),
              }),
            create(Button, {
              key: 'submit',
              label: 'Create',
              loading: gqlCreateMembership.loading,
              disabled: !schema.valid,
              click: schema.submit,
            }),
          ],
    }),
  })
}

const SchemaCreateMembership = yup.object().shape({
  user_id: yup.string().required('Please provide a user'),
  team_id: yup.string().required('Please provide a team'),
  admin: yup
    .boolean()
    .default(false)
    .required('Please determine if the user is an admin'),
  permission_ids: yup
    .array()
    .of(yup.string().required())
    .default([]),
})

const useCreateMembership = createUseServer<{
  membership: {
    id: string
  }
}>({
  query: `
    mutation CreateMembership($value: CreateMembershipValue!) {
      membership: CreateMembership(value: $value) {
        id
      }
    }
  `,
})

const useListUsers = createUseServer<{
  users: Array<{
    id: string
    name: string
    email: string
    username: string
  }>
}>({
  query: `
    query ListUsers($phrase: String) {
      users: ListUsers(phrase: $phrase, options: { limit: 5 }) {
        id
        name
        email
        username
      }
    }
  `,
})

const useListTeams = createUseServer<{
  teams: Array<{
    id: string
    name: string
    tag: string
    description: string
  }>
}>({
  query: `
    query ListTeams($phrase: String) {
      teams: ListTeams(phrase: $phrase, options: { limit: 5 }) {
        id
        name
        tag
        description
      }
    }
  `,
})

const useListPermissions = createUseServer<{
  permissions: Array<{
    id: string
    name: string
    description: string
  }>
}>({
  query: `
    query ListPermissionsClient {
      permissions: ListPermissionsClient {
        id
        name
        description
      }
    }
  `,
})
