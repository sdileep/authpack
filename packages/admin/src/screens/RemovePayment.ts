import { createElement as create, FC } from 'react'
import { Page } from 'wga-theme'
import { createUseServer } from '../hooks/useServer'
import { ConfirmRemove } from '../templates/ConfirmRemove'
import { useUniversal } from '../hooks/useUniversal'
import { UniversalStore } from '../utils/universal'

export const RemovePayment: FC<{
  change?: (id?: string) => void
}> = ({ change }) => {
  const universal = useUniversal()
  const gqlRemovePayment = useRemovePayment()
  return create(Page, {
    title: 'Danger',
    subtitle: 'Stop payments & disable gadgets',
    children: create(ConfirmRemove, {
      keyword: 'Terminate',
      helper: 'Cancel subscription and disable cluster',
      alert: 'Consider powering off your cluster instead',
      change: () =>
        gqlRemovePayment
          .fetch({ id: universal.cluster_id })
          .then(({ cluster }) => {
            UniversalStore.update({
              power: cluster.power,
              subscribed: cluster.subscribed,
            })
            if (change) change(cluster.id)
          }),
    }),
  })
}

const useRemovePayment = createUseServer<{
  cluster: {
    id: string
    subscribed: boolean
    power: boolean
  }
}>({
  query: `
    mutation RemovePaymentClient($id: String!) {
      cluster: RemovePaymentClient(id: $id) {
        id
        subscribed
        power
      }
    }
  `,
})
