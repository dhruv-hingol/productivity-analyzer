import { Globe, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { CommonContainer } from "@/common/common-container";
import { CommonTable, type Column } from "@/common/common-table";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SmartEmptyState } from "@/components/SmartEmptyState";

interface UsageDetailsProps {
  today: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filteredDomains: any[];
  columns: Column<any>[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const UsageDetails = ({
  today,
  searchTerm,
  onSearchChange,
  filteredDomains,
  columns,
  selectedDate,
  onDateChange,
}: UsageDetailsProps) => (
  <CommonContainer
    title={
      <>
        Usage Details
        <Text variant="muted" as="span" className="text-sm font-normal ml-2">
          ({today})
        </Text>
      </>
    }
    icon={<Globe size={20} />}
    headerClassName="border-b border-border"
    contentClassName="p-0"
    rightElement={
      <div className="flex items-center gap-3">
        <div className="relative z-10">
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => onDateChange(date || new Date())}
            className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-auto"
            dateFormat="MMM d, yyyy"
          />
        </div>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            size={16}
          />
          <Input
            type="text"
            placeholder="Search domains..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-6 bg-background border-border rounded-xl text-sm focus:border-indigo-500 transition-colors w-full sm:w-64"
          />
        </div>
      </div>
    }
  >
    <CommonTable
      data={filteredDomains}
      columns={columns}
      emptyMessage={<SmartEmptyState date={today} type="table" />}
    />
  </CommonContainer>
);
