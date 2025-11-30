import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileSpreadsheet, FileText, FileJson } from "lucide-react";
import { Product } from "@/data/products";
import { toast } from "sonner";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: Product[];
}

export function ExportDialog({ open, onOpenChange, products }: ExportDialogProps) {
  const exportToCSV = () => {
    const headers = ["ID", "Name", "Category", "Quantity", "Price (PHP)", "Expiry Date", "Status"];
    const csvContent = [
      headers.join(","),
      ...products.map(p => [
        p.id,
        `"${p.name}"`,
        p.category,
        p.quantity,
        p.price,
        p.expiry,
        p.status
      ].join(","))
    ].join("\n");

    downloadFile(csvContent, "inventory-export.csv", "text/csv");
    toast.success("Exported to CSV successfully!");
    onOpenChange(false);
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(products, null, 2);
    downloadFile(jsonContent, "inventory-export.json", "application/json");
    toast.success("Exported to JSON successfully!");
    onOpenChange(false);
  };

  const exportToTXT = () => {
    const txtContent = products.map(p => 
      `Product: ${p.name}\nCategory: ${p.category}\nQuantity: ${p.quantity}\nPrice: ₱${p.price}\nExpiry: ${p.expiry}\nStatus: ${p.status}\n${"─".repeat(40)}`
    ).join("\n\n");

    downloadFile(txtContent, "inventory-export.txt", "text/plain");
    toast.success("Exported to TXT successfully!");
    onOpenChange(false);
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Export Inventory</DialogTitle>
          <DialogDescription>
            Choose your preferred export format. {products.length} products will be exported.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          <Button
            variant="outline"
            className="justify-start h-auto py-4"
            onClick={exportToCSV}
          >
            <FileSpreadsheet className="h-5 w-5 mr-3 text-success" />
            <div className="text-left">
              <p className="font-medium">Export as CSV</p>
              <p className="text-xs text-muted-foreground">Best for spreadsheets (Excel, Google Sheets)</p>
            </div>
          </Button>
          <Button
            variant="outline"
            className="justify-start h-auto py-4"
            onClick={exportToJSON}
          >
            <FileJson className="h-5 w-5 mr-3 text-primary" />
            <div className="text-left">
              <p className="font-medium">Export as JSON</p>
              <p className="text-xs text-muted-foreground">Best for data integration & backup</p>
            </div>
          </Button>
          <Button
            variant="outline"
            className="justify-start h-auto py-4"
            onClick={exportToTXT}
          >
            <FileText className="h-5 w-5 mr-3 text-warning" />
            <div className="text-left">
              <p className="font-medium">Export as TXT</p>
              <p className="text-xs text-muted-foreground">Simple text format for printing</p>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
