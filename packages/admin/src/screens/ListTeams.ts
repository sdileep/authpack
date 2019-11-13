import faker from 'faker'
import { createElement as create, FC, useState, useEffect, useRef } from 'react'
import { Page, Table, Empty, Button, Focus, drip } from 'wga-theme'
import { format } from 'date-fns'
import { RouterManagerTeam } from '../routers/RouterManagerTeam'
import { TemplateSearchBar } from '../templates/TemplateSearchBar'
import { createUseServer } from '../hooks/useServer'

export const ListTeams: FC = () => {
  const apiListTeams = useListTeams()
  const [build, buildChange] = useState<boolean>(false)
  const [ready, readyChange] = useState<boolean>(false)
  const [idcurrent, idcurrentChange] = useState<string | undefined>()
  const [variables, variablesChange] = useState<{ [key: string]: any }>({})
  const queryListTeams = useRef(drip(500, apiListTeams.fetch))
  useEffect(() => {
    if (variables) queryListTeams.current(variables)
    // eslint-disable-next-line
  }, [variables])
  useEffect(() => {
    if (apiListTeams.data && apiListTeams.data.teams && !ready)
      readyChange(true)
    // eslint-disable-next-line
  }, [apiListTeams.data])
  const list =
    apiListTeams.data && apiListTeams.data.teams
      ? apiListTeams.data.teams
      : FakeTeams
  return create(Page, {
    title: 'Teams',
    subtitle: 'See all teams of your app',
    hidden: !apiListTeams.data,
    corner: {
      icon: 'plus',
      label: 'Create Team',
      click: () => {
        buildChange(true)
        setTimeout(() => idcurrentChange(undefined), 200) // animation
      },
    },
    noscroll: create(TemplateSearchBar, {
      count: apiListTeams.data && apiListTeams.data.count,
      showing: apiListTeams.data && apiListTeams.data.teams.length,
      change: (search, limit, skip) => {
        variablesChange({
          regex: search,
          options: { ...(variables.options || {}), limit, skip },
        })
      },
    }),
    children: [
      create(RouterManagerTeam, {
        key: 'router',
        id: idcurrent,
        change: id => {
          if (variables) queryListTeams.current(variables)
          if (id) {
            idcurrentChange(id)
          } else {
            buildChange(false)
            setTimeout(() => idcurrentChange(undefined), 200) // animation
          }
        },
        close: () => {
          buildChange(false)
          setTimeout(() => idcurrentChange(undefined), 200) // animation
        },
        visible: build,
      }),
      create(Table, {
        key: 'table',
        header: [
          { key: 'name', label: 'Name' },
          { key: 'tag', label: 'Tag' },
          { key: 'description', label: 'Description' },
          { key: 'updated', label: 'Updated' },
        ].map(({ key, label }) => ({
          label,
          icon:
            variables.options && variables.options.sort === key
              ? variables.options.reverse
                ? 'chevron-down'
                : 'chevron-up'
              : 'equals',
          click: () =>
            variablesChange(({ options = {}, ...data }) => ({
              ...data,
              options: { ...options, sort: key, reverse: !options.reverse },
            })),
        })),
        rows: list.map(data => ({
          id: data.id,
          click: () => {
            idcurrentChange(data.id)
            buildChange(true)
          },
          cells: [
            { icon: 'users', value: data.name },
            { icon: 'fingerprint', value: data.tag || '...' },
            { icon: 'book', value: data.description || '...' },
            {
              icon: 'clock',
              value: format(new Date(data.updated), 'dd LLL yyyy @ h:mm a'),
            },
          ],
        })),
      }),
      !ready
        ? create(Focus, {
            key: 'loading',
            icon: 'sync-alt',
            label: 'Loading',
          })
        : !apiListTeams.data &&
          create(Empty, {
            key: 'empty',
            icon: 'teams',
            label: 'Teams',
            helper: 'Create a team manually or by using the Authenticator API',
            children: create(Button, {
              key: 'Regular',
              label: 'See API',
              click: () => window.open('https://windowgadgets.io'),
            }),
          }),
    ],
  })
}

const useListTeams = createUseServer<{
  count: number
  teams: Array<{
    id: string
    updated: string
    name: string
    tag: string
    description?: string
  }>
}>({
  query: `
    query apiListTeams($regex: String, $options: WhereOptions) {
      count: apiCountTeams(regex: $regex)
      teams: apiListTeams(regex: $regex, options: $options) {
        id
        updated
        name
        tag
        description
      }
    }
  `,
})

const FakeTeams: Array<{
  id: string
  updated: string
  name: string
  tag: string
  description?: string
}> = Array.from(Array(10).keys()).map(() => ({
  id: faker.random.uuid(),
  updated: faker.date.recent(100).toDateString(),
  name: faker.random.words(2),
  tag: faker.internet.userName(),
  description: faker.random.words(10),
}))
