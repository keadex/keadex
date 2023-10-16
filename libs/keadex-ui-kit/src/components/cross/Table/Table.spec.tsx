import { render } from '@testing-library/react'
import Table from './Table'
import { getCoreRowModel } from '@tanstack/react-table'

describe('Table', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Table
        columns={[]}
        tableOptions={{
          data: [],
          columns: [],
          getCoreRowModel: getCoreRowModel(),
        }}
        globalFilter={''}
      />
    )
    expect(baseElement).toBeTruthy()
  })
})
