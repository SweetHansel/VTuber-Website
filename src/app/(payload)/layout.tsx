/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* eslint-disable */
// @ts-nocheck
import { RootLayout } from '@payloadcms/next/layouts'
import React from 'react'
import config from '@payload-config'
import { importMap } from './admin/importMap'

import '@payloadcms/next/css'

type Args = {
  children: React.ReactNode
}

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap}>
    {children}
  </RootLayout>
)

export default Layout
