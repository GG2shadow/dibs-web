'use client';

import * as React from 'react';

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react';

import CustomerInfoModal from '@/components/ui/Admin/Modals/CustomerInfoModal';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export type Payment = {
  id: string;
  timestamp: string;
  transactionId: string;
  campaignId: string;
  customer: string;
  description: string;
};

const data: Payment[] = [
  {
    id: 'm5gr84i9',
    timestamp: '2024-03-20 10:30:00',
    transactionId: 'TRX-001',
    campaignId: 'CAMP-001',
    customer: 'Ken Adams',
    description: 'Collected 10 stamps.',
  },
  {
    id: '3u1reuv4',
    timestamp: '2024-03-20 11:15:00',
    transactionId: 'TRX-002',
    campaignId: 'CAMP-002',
    customer: 'Abe Lincoln',
    description: 'Collected 10 stamps.',
  },
  {
    id: 'derv1ws0',
    timestamp: '2024-03-20 12:00:00',
    transactionId: 'TRX-003',
    campaignId: 'CAMP-001',
    customer: 'Monserrat Ruiz',
    description: 'Redeemed "Time to eat".',
  },
  {
    id: '5kma53ae',
    timestamp: '2024-03-20 13:45:00',
    transactionId: 'TRX-004',
    campaignId: 'CAMP-003',
    customer: 'Silas Brown',
    description: 'Collected 10 stamps.',
  },
  {
    id: 'bhqecj4p',
    timestamp: '2024-03-20 14:30:00',
    transactionId: 'TRX-005',
    campaignId: 'CAMP-002',
    customer: 'Carmella White',
    description: 'Collected 10 stamps.',
  },
];

// New component for the actions cell
function ActionsCell({ row }: { row: Payment }) {
  const [isCustomerInfoModalOpen, setIsCustomerInfoModalOpen] =
    React.useState(false);

  return (
    <div>
      <CustomerInfoModal
        isOpen={isCustomerInfoModalOpen}
        onClose={() => setIsCustomerInfoModalOpen(false)}
        customer={{
          name: row.customer,
          email: '',
          phone: '',
        }}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(row.id)}
          >
            Copy payment ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsCustomerInfoModalOpen(true)}>
            View customer
          </DropdownMenuItem>
          <DropdownMenuItem>View payment details</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export const columns: ColumnDef<Payment>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="border-black"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="border-black"
        style={{
          backgroundColor: row.getIsSelected() ? '#000' : 'transparent',
          color: 'inherit',
        }}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'timestamp',
    header: ({ column }) => (
      <div
        className="flex cursor-pointer items-center text-left"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Timestamp
        <ArrowUpDown className="ml-1 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue('timestamp')}</div>,
  },
  {
    accessorKey: 'transactionId',
    header: () => <div className="text-left">Transaction ID</div>,
    cell: ({ row }) => <div>{row.getValue('transactionId')}</div>,
  },
  {
    accessorKey: 'campaignId',
    header: () => <div className="text-left">Campaign ID</div>,
    cell: ({ row }) => <div>{row.getValue('campaignId')}</div>,
  },
  {
    accessorKey: 'customer',
    header: () => <div className="text-left">Customer</div>,
    cell: ({ row }) => <div>{row.getValue('customer')}</div>,
  },
  {
    accessorKey: 'description',
    header: () => <div className="text-left">Description</div>,
    cell: ({ row }) => <div>{row.getValue('description')}</div>,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <ActionsCell row={row.original} />,
  },
];

export function TransactionsStamps() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full pl-1">
      <h1 className="text-xl font-semibold">Stamp Transactions</h1>
      <p className="text-sm text-muted-foreground">This is a list of all your stamp transactions.</p>
      <div className="flex items-center py-4">
        <Input
          placeholder="Search transactions..."
          value={(table.getColumn('transactionId')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('transactionId')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
