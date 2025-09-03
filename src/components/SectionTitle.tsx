export default function SectionTitle({
  icon: Icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl border">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {desc ? (
            <p className="text-sm text-muted-foreground">{desc}</p>
          ) : null}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {/* <Button variant="ghost" size="sm" className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </Button> */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Export CSV</DropdownMenuItem>
            <DropdownMenuItem>Create Report</DropdownMenuItem>
            <DropdownMenuItem>Manage Access</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
    </div>
  );
}
