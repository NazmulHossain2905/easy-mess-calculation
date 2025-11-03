"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { IUser } from "@/interfaces/IUser";
import { useAppSelector } from "@/store";
import { getInitials } from "@/utils/getInitials";
import { Separator } from "./ui/separator";
import { twMerge } from "tailwind-merge";
import DownloadPdf from "./DownloadPdf";

const Header = ({ text, colorCN }: { text: string; colorCN?: string }) => (
  <p className={twMerge("text-center font-semibold text-black", colorCN)}>
    {text}
  </p>
);

const TData = ({
  text,
  className,
  suffix = "",
  prefix = "",
  isNum,
}: {
  text?: string | number;
  className?: string;
  suffix?: string;
  isNum?: boolean;
  prefix?: string;
}) => {
  return (
    <p className={twMerge("text-center font-bold text-black", className)}>
      {`${prefix} ${isNum ? Number(text).toLocaleString("bn-BD").concat(suffix) : text}`}
    </p>
  );
};

const getColumns = ({
  totalFixedMeal,
  mealRate,
  totalOtherCost,
  otherCostPerPerson,
  totalMeal,
}: {
  totalMarketCost: number;
  totalFixedMeal: number;
  mealRate: number;
  totalOtherCost: number;
  otherCostPerPerson: number;
  totalMeal: number;
}): ColumnDef<IUser>[] => [
  {
    accessorKey: "নং",
    header: () => <Header text="নং" colorCN="text-black" />,
    cell: ({ row }) => <TData text={row.original.roll} isNum />,
  },
  {
    accessorKey: "name",
    header: () => <Header text="নাম" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage
            src={row.original.photoUrl!}
            className="object-cover"
            alt={row.original.name}
          />
          <AvatarFallback className="bg-blue-100 font-semibold text-blue-500 uppercase">
            {getInitials(row.original.name)}
          </AvatarFallback>
        </Avatar>

        <TData text={row.original.name} />
      </div>
    ),
  },
  {
    accessorKey: "মিল",
    header: () => <Header text="মিল" />,
    cell: ({ row }) => <TData text={row.original.totalMeal} isNum />,
    footer: () => <TData text={totalMeal} isNum prefix="মোট:" />,
  },
  {
    accessorKey: "ফিঃ মিল",
    header: () => <Header text="ফিঃ মিল" />,
    cell: ({ row }) => <TData text={row.original.fixedMeal} isNum />,
    footer: () => <TData text={totalFixedMeal} isNum prefix="মোট:" />,
  },
  {
    accessorKey: "মিল রেট",
    header: () => <Header text="মিল রেট" />,
    cell: () => <TData text={mealRate} isNum suffix=" ৳" />,
  },
  {
    accessorKey: "ফিঃ মিল খরচ",
    header: () => <Header text="ফিঃ মিল খরচ" />,
    cell: ({ row }) => (
      <TData
        text={mealRate * (row.original.fixedMeal ?? 0)}
        isNum
        suffix=" ৳"
      />
    ),
  },
  {
    accessorKey: "বিবিধ",
    header: () => <Header text="বিবিধ" />,
    cell: () => <TData text={otherCostPerPerson} isNum suffix=" ৳" />,
    footer: () => <TData text={totalOtherCost} isNum prefix="মোট:" />,
  },
  {
    accessorKey: "মোট খরচ",
    header: () => <Header text="মোট খরচ" />,
    cell: ({ row }) => {
      const fixedMealCost = Math.ceil(
        mealRate * (row.original.fixedMeal ?? 0) + otherCostPerPerson,
      );

      const totalCost =
        fixedMealCost +
        (row.original.guestMealAmount ?? 0) +
        (row.original.fineAmount ?? 0);

      return (
        <TData text={totalCost} isNum suffix={totalCost > 0 ? " ৳" : ""} />
      );
    },
  },
  {
    accessorKey: "টাকা জমা",
    header: () => <Header text="টাকা জমা" />,
    cell: ({ row }) => (
      <TData text={row.original.money ?? 0} isNum suffix=" ৳" />
    ),
    footer: ({ table }) => {
      const total = table
        .getFilteredRowModel()
        .rows.reduce((sum, row) => sum + row.original.money!, 0);
      return <TData text={total} isNum prefix="মোট:" suffix=" ৳" />;
    },
  },
  {
    accessorKey: "অতিথি মিল খরচ",
    header: () => <Header text="অতিথি মিল খরচ" />,
    cell: ({ row }) => (
      <TData
        text={row.original.guestMealAmount}
        isNum
        suffix={row.original.guestMealAmount! > 0 ? " ৳" : ""}
      />
    ),
    footer: ({ table }) => {
      const total = table
        .getFilteredRowModel()
        .rows.reduce((sum, row) => sum + row.original.guestMealAmount!, 0);
      return <TData text={total} isNum prefix="মোট:" suffix=" ৳" />;
    },
  },
  {
    accessorKey: "জরিমানা",
    header: () => <Header text="জরিমানা" />,
    cell: ({ row }) => (
      <TData
        text={row.original.fineAmount}
        isNum
        suffix={row.original.fineAmount! > 0 ? " ৳" : ""}
        className="text-red-500"
      />
    ),
    footer: ({ table }) => {
      const total = table
        .getFilteredRowModel()
        .rows.reduce((sum, row) => sum + row.original.fineAmount!, 0);
      return <TData text={total} isNum prefix="মোট:" suffix=" ৳" />;
    },
  },
  {
    accessorKey: "টাকা দেনা",
    header: () => <Header text="টাকা দেনা" />,
    cell: ({ row }) => {
      const fixedMealCost = Math.ceil(
        mealRate * (row.original.fixedMeal ?? 0) + otherCostPerPerson,
      );

      const totalCost =
        fixedMealCost +
        (row.original.guestMealAmount ?? 0) +
        (row.original.fineAmount ?? 0);

      const money = totalCost - (row.original.money ?? 0);
      return (
        <TData
          text={money > 0 ? money : 0}
          isNum
          suffix={money > 0 ? " ৳" : ""}
          className="text-red-500"
        />
      );
    },
  },
  {
    accessorKey: "টাকা পাওনা",
    header: () => <Header text="টাকা পাওনা" />,
    cell: ({ row }) => {
      const fixedMealCost = Math.round(
        mealRate * (row.original.fixedMeal ?? 0) + otherCostPerPerson,
      );

      const totalCost =
        fixedMealCost +
        (row.original.guestMealAmount ?? 0) +
        (row.original.fineAmount ?? 0);

      const money = (row.original.money ?? 0) - totalCost;
      return (
        <TData
          text={money > 0 ? money : 0}
          isNum
          suffix={money > 0 ? " ৳" : ""}
          className="text-green-700"
        />
      );
    },
  },
  {
    accessorKey: "চাউল জমা",
    header: () => <Header text="চাউল জমা" />,
    cell: ({ row }) => (
      <TData text={row.original.rice ?? 0} isNum suffix=" পট" />
    ),
    footer: ({ table }) => {
      const total = table
        .getFilteredRowModel()
        .rows.reduce((sum, row) => sum + row.original.rice!, 0);
      return <TData text={total} isNum prefix="মোট:" suffix=" পট" />;
    },
  },
  {
    accessorKey: "অতিরিক্ত চাউল",
    header: () => <Header text="অতিরিক্ত চাউল" />,
    cell: ({ row }) => (
      <TData
        text={row.original.extraRice ?? 0}
        isNum
        suffix={row.original.extraRice! > 0 ? " পট" : ""}
      />
    ),
    footer: ({ table }) => {
      const total = table
        .getFilteredRowModel()
        .rows.reduce((sum, row) => sum + row.original.extraRice!, 0);
      return <TData text={total} isNum prefix="মোট:" suffix=" পট" />;
    },
  },
  {
    accessorKey: "খালার চাউল",
    header: () => <Header text="খালার চাউল" />,
    cell: ({ row }) => {
      return (
        <TData
          text={row.original.khalarRice}
          isNum
          suffix={(row.original.khalarRice ?? 0) > 0 ? " পট" : ""}
        />
      );
    },
  },
  {
    accessorKey: "চাউল খরচ",
    header: () => <Header text="চাউল খরচ" />,
    cell: ({ row }) => {
      const totalRiceCost =
        (row.original.extraRice ?? 0) +
        (row.original.totalMeal ?? 0) +
        (row.original.khalarRice ?? 0);
      return (
        <TData
          text={totalRiceCost}
          isNum
          suffix={totalRiceCost > 0 ? " পট" : ""}
        />
      );
    },
  },

  {
    accessorKey: "চাউল দেনা",
    header: () => <Header text="চাউল দেনা" />,
    cell: ({ row }) => {
      const totalRiceCost =
        (row.original.totalMeal ?? 0) +
        (row.original.khalarRice ?? 0) +
        (row.original.extraRice ?? 0);

      const rice = totalRiceCost - (row.original.rice ?? 0);
      return (
        <TData
          text={rice > 0 ? rice : 0}
          isNum
          suffix={rice > 0 ? " পট" : ""}
          className="text-red-500"
        />
      );
    },
    footer: ({ table }) => {
      const total = table.getFilteredRowModel().rows.reduce((sum, row) => {
        const totalRiceCost =
          (row.original.totalMeal ?? 0) +
          (row.original.khalarRice ?? 0) +
          (row.original.extraRice ?? 0);

        const rice = totalRiceCost - (row.original.rice ?? 0);

        const result = sum + (rice > 0 ? rice : 0);

        return result;
      }, 0);

      return <TData text={total} isNum prefix="মোট:" suffix=" পট" />;
    },
  },
  {
    accessorKey: "চাউল পাওনা",
    header: () => <Header text="চাউল পাওনা" />,
    cell: ({ row }) => {
      const totalRiceCost =
        (row.original.totalMeal ?? 0) +
        (row.original.khalarRice ?? 0) +
        (row.original.extraRice ?? 0);

      const rice = (row.original.rice ?? 0) - totalRiceCost;
      return (
        <TData
          text={rice > 0 ? rice : 0}
          isNum
          suffix={rice > 0 ? " পট" : ""}
          className="text-green-700"
        />
      );
    },
    footer: ({ table }) => {
      const total = table.getFilteredRowModel().rows.reduce((sum, row) => {
        const totalRiceCost =
          (row.original.totalMeal ?? 0) +
          (row.original.khalarRice ?? 0) +
          (row.original.extraRice ?? 0);

        const rice = (row.original.rice ?? 0) - totalRiceCost;

        const result = sum + (rice > 0 ? rice : 0);

        return result;
      }, 0);

      return <TData text={total} isNum prefix="মোট:" suffix=" পট" />;
    },
  },
];

// Main Component
export default function AccountChart() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // calculation

  const members = useAppSelector((state) => state.members.members);
  const marketers = useAppSelector((state) => state.marketers.marketers);
  const smallCosts = useAppSelector((state) => state.smallCosts.smallCosts);
  const otherCosts = useAppSelector((state) => state.otherCosts.otherCosts);

  // Total Market Cost
  const totalMarketCost = marketers.reduce((prev, curr) => {
    return (prev += curr.amount);
  }, 0);
  const totalSmallCost = smallCosts.reduce((prev, curr) => {
    return (prev += curr.amount);
  }, 0);

  const originalMarketCost = totalMarketCost + totalSmallCost;

  // Total Fixed Meal
  const totalFixedMeal = members.reduce((prev, curr) => {
    return (prev += curr.fixedMeal ?? 0);
  }, 0);

  // Meal Rate
  const mealRate = Number((originalMarketCost / totalFixedMeal).toFixed(2));

  // Fixed Meal Cost
  // const fixedMealCost =

  // Total Other Cost
  const totalOtherCost = otherCosts.reduce((prev, curr) => {
    return (prev += curr.amount);
  }, 0);

  // Other Cost Per-Person
  const otherCostPerPerson = Number(
    (totalOtherCost / members.length).toFixed(2),
  );

  const totalMeal = members.reduce((prev, curr) => {
    return (prev += curr.totalMeal ?? 0);
  }, 0);

  console.log({ totalMeal });

  const columns = getColumns({
    totalMarketCost: originalMarketCost,
    totalFixedMeal,
    mealRate,
    totalOtherCost,
    otherCostPerPerson,
    totalMeal,
  });

  const table = useReactTable({
    data: members,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full py-10">
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-blue-500">
        হিসাবের চার্ট
      </h1>
      <Separator className="my-4" />

      {/* <div className="mt-5">
        <p className="text-center">بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ</p>
        <h1 className="scroll-m-20 text-center text-5xl font-extrabold tracking-tight">
          {messInfo.name}
        </h1>
        <p className="text-center">{messInfo.address}</p>
      </div> */}

      <div className="flex items-center py-4">
        <Input
          placeholder="নামের মাধ্যমে খুঁজুন..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("name")?.setFilterValue(e.target.value)
          }
          className="w-sm"
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
              .filter((c) => c.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  className="capitalize"
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className="text-red-500 odd:bg-gray-300"
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="odd:bg-gray-100" key={cell.id}>
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
          <TableFooter>
            {table.getFooterGroups().map((footerGroup) => (
              <TableRow key={footerGroup.id}>
                {footerGroup.headers.map((footer) => (
                  <TableCell key={footer.id}>
                    {flexRender(
                      footer.column.columnDef.footer,
                      footer.getContext(),
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableFooter>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
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

      <DownloadPdf />
    </div>
  );
}
