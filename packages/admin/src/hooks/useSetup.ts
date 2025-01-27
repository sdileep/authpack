import { useEffect } from 'react'
import { useAuthpack } from '@authpack/react'
import { createUseServer } from './useServer'
import { UniversalStore } from '../utils/universal'
import { useUniversal } from './useUniversal'

export const useSetup = () => {
  const authpack = useAuthpack()
  const universal = useUniversal()
  const gqlGetCluster = useGetCluster()
  useEffect(() => {
    if (authpack.bearer && authpack.team && authpack.team.id) {
      gqlGetCluster
        .fetch({ id: authpack.bearer && universal.cluster_id })
        .then(({ cluster }) => {
          UniversalStore.recreate({
            ready: true,
            cluster_id: cluster.id,
            cluster_name: cluster.name,
            cluster_key_client: cluster.key_client,
            subscribed: cluster.subscribed,
          })
        })
        .catch(() => {
          UniversalStore.recreate({
            ready: true,
          })
        })
    } else {
      setTimeout(() => {
        UniversalStore.recreate({
          ready: true,
        })
      })
    }
    // eslint-disable-next-line
  }, [universal.cluster_id, authpack.bearer, authpack.team && authpack.team.id])
}

const useGetCluster = createUseServer<{
  cluster: {
    id: string
    key_client: string
    name: string
    theme_preference: string
    subscribed: boolean
  }
}>({
  query: `
    query GetClusterClient($id: String) {
      cluster: GetClusterClient(id: $id) {
        id
        key_client
        name
        theme_preference
        subscribed
      }
    }
  `,
})
