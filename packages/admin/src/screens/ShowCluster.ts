import { createElement as create, FC, useEffect } from 'react'
import { Gadgets, Layout, Snippet } from 'wga-theme'
import { format } from 'date-fns'
import { createUseServer } from '../hooks/useServer'
import { useUniversal } from '../hooks/useUniversal'

export const ShowCluster: FC = () => {
  const universal = useUniversal()
  const gqlGetCluster = useGetCluster()
  useEffect(() => {
    gqlGetCluster.fetch({ id: universal.cluster_id })
    // eslint-disable-next-line
  }, [])
  const cluster = gqlGetCluster.data ? gqlGetCluster.data.cluster : ({} as any)
  return create(Gadgets, {
    title: 'Cluster',
    subtitle: universal.cluster_name,
    children: create(Layout, {
      column: true,
      children: [
        create(Snippet, {
          key: 'id',
          icon: 'fingerprint',
          label: 'Id',
          value: cluster.id,
        }),
        create(Snippet, {
          key: 'name',
          icon: 'tags',
          label: 'Name',
          value: cluster.name,
        }),
        create(Snippet, {
          key: 'theme',
          icon: 'magic',
          label: 'Theme',
          value: cluster.theme || 'default',
        }),
        create(Snippet, {
          key: 'power',
          icon: 'bolt',
          label: 'Power',
          value: String(cluster.power),
        }),
        create(Snippet, {
          key: 'subscribed',
          icon: 'wallet',
          label: 'Subscribed',
          value: String(cluster.subscribed),
        }),
        create(Snippet, {
          key: 'created',
          icon: 'clock',
          label: 'Created',
          value:
            cluster.created &&
            format(new Date(cluster.created), 'dd LLL yyyy @ h:mm a'),
        }),
        create(Snippet, {
          key: 'updated',
          icon: 'clock',
          label: 'Updated',
          value:
            cluster.updated &&
            format(new Date(cluster.updated), 'dd LLL yyyy @ h:mm a'),
        }),
      ],
    }),
  })
}

const useGetCluster = createUseServer<{
  cluster: {
    id: string
    created: string
    updated: string
    name: string
    theme: string
    power: boolean
    subscribed: boolean
  }
}>({
  query: `
    query wgaGetCluster($id: String!) {
      cluster: wgaGetCluster(id: $id) {
        id
        created
        updated
        name
        theme
        power
        subscribed
      }
    }
  `,
})