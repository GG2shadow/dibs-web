'use client';

import * as React from 'react';
import Image from 'next/image';

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
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus } from 'lucide-react';

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
import { Badge } from '@/components/ui/badge';
import { BookingsListingsEditModal } from '@/components/ui/Admin/Modals/BookingsListingsEditModal';
import { BookingsListingsCreateModal } from '@/components/ui/Admin/Modals/BookingsListingsCreateModal';

export type Listing = {
  id: string;
  status: 'pending' | 'inactive' | 'active' | 'completed';
  title: string;
  shortDescription: string;
  longDescription: string;
  price: string;
  isActive: boolean;
  requiresDeposit: boolean;
  imageUrl: string;
  images: File[];
};

const data: Listing[] = [
  {
    id: 'm5gr84i9',
    status: 'active',
    title: 'Luxury Beach Villa',
    shortDescription: 'Stunning ocean view with private pool',
    longDescription: 'Experience luxury living in this stunning beach villa with private pool and ocean views.',
    price: '500',
    isActive: true,
    requiresDeposit: true,
    imageUrl: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=400&h=300&fit=crop',
    images: [],
  },
  {
    id: '3u1reuv4',
    status: 'active',
    title: 'Mountain Cabin',
    shortDescription: 'Cozy retreat with fireplace',
    longDescription: 'Escape to this cozy mountain cabin featuring a warm fireplace and stunning views.',
    price: '300',
    isActive: true,
    requiresDeposit: true,
    imageUrl: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=400&h=300&fit=crop',
    images: [],
  },
  {
    id: 'derv1ws0',
    status: 'inactive',
    title: 'City Apartment',
    shortDescription: 'Modern living in downtown',
    longDescription: 'Contemporary apartment in the heart of the city with modern amenities.',
    price: '200',
    isActive: false,
    requiresDeposit: false,
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
    images: [],
  },
  {
    id: '5kma53ae',
    status: 'active',
    title: 'Garden Cottage',
    shortDescription: 'Peaceful garden setting',
    longDescription: 'Charming cottage surrounded by beautiful gardens and nature.',
    price: '250',
    isActive: true,
    requiresDeposit: true,
    imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop',
    images: [],
  },
];

export function BookingsListings() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [selectedListing, setSelectedListing] = React.useState<Listing | undefined>();

  const handleEditListing = (listing: Listing) => {
    setSelectedListing(listing);
    setIsEditModalOpen(true);
  };

  const handleSaveListing = (updatedListing: any) => {
    // TODO: Implement save functionality
    console.log('Saving listing:', updatedListing);
    setIsEditModalOpen(false);
  };

  // Move ActionsCell inside the main component
  function ActionsCell({ row }: { row: { original: Listing } }) {
    return (
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.id)}>
              Copy listing ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditListing(row.original)}>
              Edit listing
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  const columns: ColumnDef<Listing>[] = [
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
      accessorKey: 'status',
      header: () => <div className="text-left">Status</div>,
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const isActive = status === 'active' || status === 'completed';
        
        return (
          <Badge 
            variant="secondary"
            className={`capitalize ${isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'imageUrl',
      header: () => <div className="text-left">Images</div>,
      cell: ({ row }) => (
        <div className="relative h-16 w-24 overflow-hidden rounded-md">
          <Image
            src={row.getValue('imageUrl')}
            alt={row.getValue('title')}
            fill
            className="object-cover"
          />
        </div>
      ),
    },
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <div
          className="flex cursor-pointer items-center text-left"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Listing name
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue('title')}</div>,
    },
    {
      accessorKey: 'shortDescription',
      header: () => <div className="text-left">Short description</div>,
      cell: ({ row }) => <div className="text-gray-600">{row.getValue('shortDescription')}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => <ActionsCell row={row} />,
    },
  ];

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Booking Listings</h1>
            <p className="text-sm text-muted-foreground">This is a list of all your bookable listings.</p>
          </div>
          <Button 
            className="flex items-center gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Create listing
          </Button>
        </div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Search listings..."
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('title')?.setFilterValue(event.target.value)
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
      
      <BookingsListingsEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        listing={selectedListing!}
        onSave={handleSaveListing}
      />
      
      <BookingsListingsCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={(newListing) => {
          // TODO: Implement create functionality for new listing
          console.log('Creating new listing:', newListing);
          setIsCreateModalOpen(false);
        }}
      />
    </div>
  );
}
