import React from 'react'
import { useGetAllDialogsQuery } from '../../app/services/dialogApi'
import { Spinner } from '@nextui-org/react'

export const DialogsGuard = ({ children }: { children: JSX.Element }) => {
    const { isLoading } = useGetAllDialogsQuery()
    if (isLoading) {
      return <Spinner />
    }
    return children
  }
  