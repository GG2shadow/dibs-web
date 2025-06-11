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
import { v4 as uuidv4 } from 'uuid';

import { BookingsListingsCreateModal } from '@/components/ui/Admin/modals/BookingsListingsCreateModal';
import { BookingsListingsEditModal } from '@/components/ui/Admin/modals/BookingsListingsEditModal';
import { Badge } from '@/components/ui/badge';
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
import { supabase } from '@/lib/supabaseClient';
import { uploadListingImage } from '@/lib/uploadListingImage';
import { extractStoragePath, slugify } from '@/lib/utils';
import { Listing, ListingForm } from '@/types/listing';

export function BookingsListings() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [selectedListing, setSelectedListing] = React.useState<
    Listing | undefined
  >();

  const [listings, setListings] = React.useState<Listing[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id }),
      });
      const json = await res.json();

      if (res.ok) {
        setListings(json.listings);
      } else {
        console.error('Error loading listings:', json.error);
        setListings([]);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchListings();
  }, []);

  const handleEditListing = (listing: Listing) => {
    setSelectedListing(listing);
    setIsEditModalOpen(true);
  };

  async function generateUniqueSlug(baseTitle: string): Promise<string> {
    const baseSlug = slugify(baseTitle);

    const { data: existing, error } = await supabase
      .from('listing')
      .select('slug')
      .ilike('slug', `${baseSlug}%`);

    if (error) throw new Error('Failed to check existing slugs');

    const existingSlugs = (existing ?? []).map((item) => item.slug);

    if (!existingSlugs.includes(baseSlug)) {
      return baseSlug;
    }

    // Find the highest numeric suffix
    let maxSuffix = 0;
    const pattern = new RegExp(`^${baseSlug}-(\\d+)$`);

    for (const slug of existingSlugs) {
      const match = slug.match(pattern);
      if (match) {
        const num = parseInt(match[1]);
        if (num > maxSuffix) maxSuffix = num;
      }
    }

    return `${baseSlug}-${maxSuffix + 1}`;
  }

  const handleSaveListing = async (
    originalListing: Listing | null,
    formData: ListingForm,
  ) => {
    try {
      setIsEditModalOpen(false);
      setLoading(true);

      const isCreating = originalListing === null;

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) throw new Error('No authenticated user');

      const newImages = formData.images.filter((img) => img.file);
      const retainedImageUrls = formData.images
        .filter((img) => img.url && !img.file)
        .map((img) => img.url);

      let listingId = originalListing?.id ?? '';
      const existingImages = originalListing?.listing_image ?? [];

      const generatedSlug = await generateUniqueSlug(formData.title);

      // Step 1: Create or update the listing via new unified API
      const res = await fetch('/api/listings/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          formData: {
            ...formData,
            slug: generatedSlug,
          },
          listingId: originalListing?.id ?? null,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to save listing');

      listingId = result.listingId;

      // Step 2: Upload new images
      const uploadedImageUrls: string[] = [];
      for (const img of newImages) {
        const file = img.file!;
        const publicUrl = await uploadListingImage(listingId, file);
        uploadedImageUrls.push(publicUrl);
      }

      // Step 3: Insert uploaded images
      if (uploadedImageUrls.length > 0) {
        const { error: insertImageError } = await supabase
          .from('listing_image')
          .insert(
            uploadedImageUrls.map((url) => ({
              listing_id: listingId,
              image_url: url,
            })),
          );

        if (insertImageError)
          throw new Error(
            `Failed to insert image records: ${insertImageError.message}`,
          );
      }

      // Step 4: Delete removed images (edit only)
      if (!isCreating && existingImages.length > 0) {
        const removed = existingImages.filter(
          (img) => !retainedImageUrls.includes(img.image_url),
        );

        if (removed.length > 0) {
          const { error: deleteError } = await supabase
            .from('listing_image')
            .delete()
            .in(
              'id',
              removed.map((img) => img.id),
            );

          if (deleteError)
            throw new Error(
              `Failed to delete removed images: ${deleteError.message}`,
            );

          for (const img of removed) {
            const filePath = extractStoragePath(img.image_url);
            await supabase.storage.from('listing-images').remove([filePath]);
          }
        }
      }

      fetchListings();
      alert(`Listing ${isCreating ? 'created' : 'updated'} successfully!`);
    } catch (err) {
      const errorText =
        err instanceof Error ? err.message : 'Failed to save listing';
      alert(errorText);
      setLoading(false);
    }
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
            {row.original.id !== null ? (
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(row.original.id!)}
              >
                Copy listing ID
              </DropdownMenuItem>
            ) : null}
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
      accessorKey: 'is_active',
      header: () => <div className="text-left">Status</div>,
      cell: ({ row }) => {
        const isActive = row.getValue('is_active');

        return (
          <Badge
            variant="secondary"
            className={`capitalize ${isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
          >
            {isActive ? 'Active' : 'Not Active'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'listing_image',
      header: () => <div className="text-left">Images</div>,
      cell: ({ row }) => {
        const images = row.getValue('listing_image') as { image_url: string }[];
        const firstImage = images?.[0]?.image_url;

        return (
          <div className="relative h-16 w-24 overflow-hidden rounded-md">
            {firstImage ? (
              <Image
                src={firstImage}
                alt={row.getValue('title')}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                No Image
              </div>
            )}
          </div>
        );
      },
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
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('title')}</div>
      ),
    },
    {
      accessorKey: 'description',
      header: () => <div className="text-left">Description</div>,
      cell: ({ row }) => (
        <div className="text-gray-600">{row.getValue('description')}</div>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => <ActionsCell row={row} />,
    },
  ];

  const table = useReactTable({
    data: listings,
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
          <p className="text-muted-foreground text-sm">
            This is a list of all your bookable listings.
          </p>
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
      {loading ? (
        <div className="p-10 text-center">Loading listings...</div>
      ) : (
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
      )}
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
          console.log('Creating new listing:', newListing);
          setIsCreateModalOpen(false);
          handleSaveListing(null, newListing);
        }}
      />
    </div>
  );
}
