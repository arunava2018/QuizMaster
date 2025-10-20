"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface DataModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  data: any[];
  loading?: boolean;
}

export function DataModal({ title, isOpen, onClose, data, loading }: DataModalProps) {
  const getColumns = (arr: any[]) => {
    if (!arr || arr.length === 0) return [];
    const sample = arr[0];
    return Object.keys(sample).filter(
      (key) => !["_id", "__v", "clerkUserId", "createdAt", "updatedAt"].includes(key)
    );
  };

  const columns = getColumns(data);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
        </DialogHeader>

        {/* Loading & Empty States */}
        {loading ? (
          <div className="flex justify-center items-center h-24 text-muted-foreground">
            Loading...
          </div>
        ) : data.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No data available.
          </div>
        ) : (
          <div className="space-y-4 mt-4 max-h-[420px] overflow-y-auto">
            {data.map((item, index) => (
              <div
                key={index}
                className="border border-border bg-card/50 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Top Header Row */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground text-base">
                    {item.title || item.name || `Item ${index + 1}`}
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    #{index + 1}
                  </Badge>
                </div>

                <Separator className="my-2" />

                {/* Details */}
                <div className="grid gap-1.5">
                  {columns.map((key) => (
                    <div key={key} className="flex gap-2 text-sm">
                      <span className="font-medium capitalize text-foreground/90 w-32">
                        {key}:
                      </span>
                      <span className="text-muted-foreground flex-1 break-words">
                        {renderCell(item[key])}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* Helper function for cleaner rendering */
function renderCell(value: any) {
  if (Array.isArray(value)) {
    return value.join(", ");
  } else if (typeof value === "object" && value !== null) {
    return JSON.stringify(value);
  } else if (value === "" || value === null || value === undefined) {
    return <span className="italic text-muted-foreground">N/A</span>;
  }
  return String(value);
}
