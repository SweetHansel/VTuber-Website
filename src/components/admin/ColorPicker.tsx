'use client'

import { useField, TextInput, FieldLabel } from '@payloadcms/ui'
import type { TextFieldClientProps } from 'payload'

export const ColorPicker: React.FC<TextFieldClientProps> = ({ field, path }) => {
  const { value, setValue } = useField<string>({ path })

  return (
    <div style={{ marginBottom: '1rem' }}>
      <FieldLabel htmlFor={path} label={field.label || field.name} required={field.required} />
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => setValue(e.target.value)}
          style={{
            width: '40px',
            height: '40px',
            padding: 0,
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: '4px',
            cursor: 'pointer',
            backgroundColor: 'transparent',
          }}
        />
        <TextInput
          path={path}
          value={value || ''}
          onChange={(e) => setValue(e.target.value)}
          placeholder="#000000"
          style={{ flex: 1 }}
        />
      </div>
      {/* {field.admin?.description && (
        <div style={{ fontSize: '12px', color: 'var(--theme-elevation-400)', marginTop: '0.25rem' }}>
          {field.admin.description}
        </div>
      )} */}
    </div>
  )
}
