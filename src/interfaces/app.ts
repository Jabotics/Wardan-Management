/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { ComponentType } from 'react'

export type Order = 'asc' | 'desc'

export interface HeadCell<T> {
  disablePadding: boolean
  id: keyof T
  label: string
  numeric: boolean
  type: 'string' | 'custom'
  body?: ({ data }: { data: T }) => React.JSX.Element
}

export interface EnhancedTableProps<T extends { [key: string]: any }> {
  data: T[]
  headCells: HeadCell<T>[]
  title: string
  dense?: boolean
  rowHeight?: number
  ExpandedBody?: ({ data }: { data: T }) => React.JSX.Element
  config?: {
    ModifyComponent: ({
      data,
      setClose,
    }: {
      data?: T
      setClose: React.Dispatch<React.SetStateAction<boolean>>
    }) => JSX.Element,
    ExportComponent?: ComponentType
    setLimit?: React.Dispatch<React.SetStateAction<number>>
    setOffset?: React.Dispatch<React.SetStateAction<number>>
    count?: number
  }
  dataFilters?: TableDataFilters
}

export interface EnhancedTableHeadProps<T> {
  numSelected: number
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: keyof T
  rowCount: number
  headCells: HeadCell<T>[]
}

export interface EnhancedTableToolbarProps {
  numSelected: number
  setDelete: React.Dispatch<React.SetStateAction<boolean>>
  dataFilters?: TableDataFilters
  export?: ComponentType
}

export interface TablePaginationConfig {
  sortBy?: string
  sortOrder?: 'desc' | 'asc'
  limit?: number
  offset?: number
}

export interface TableDataFilters {
  searchBy?: {
    placeholderText: string;
    actions: [string, React.Dispatch<React.SetStateAction<string>>];
  };
  filters?: {
    label: string;
    type: 'array' | 'object';
    options: { [x: string | number]: string }[];
    value: string[];
  }[];
  handleFilterChange?: (label: string, value: string[]) => void;
}
