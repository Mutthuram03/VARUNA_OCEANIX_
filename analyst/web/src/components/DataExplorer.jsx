import { useState, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Filter,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Download,
} from "lucide-react";
import { HazardReportService } from "../firebase/services";

export default function DataExplorer({ darkMode }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [hazardTypeFilter, setHazardTypeFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");

  // Load data from Firebase
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await HazardReportService.getReports({
          timeRange: timeFilter || '30d',
          limit: 1000
        });
        
        if (result.success) {
          // Transform data for table
          const transformedData = result.reports.map(report => ({
            id: report.id,
            hazardType: report.hazardType || 'Unknown',
            region: report.location?.address || 'Unknown',
            severity: report.severity || 'Unknown',
            reportDate: report.createdAt?.toDate ? 
              report.createdAt.toDate().toISOString().split('T')[0] : 
              new Date(report.createdAt).toISOString().split('T')[0],
            status: report.status || 'Unknown',
            affectedArea: report.affectedArea || 'N/A',
            description: report.description || '',
            reporter: report.reporterInfo?.name || 'Anonymous',
            coordinates: report.location ? 
              `${report.location.latitude?.toFixed(4)}, ${report.location.longitude?.toFixed(4)}` : 
              'N/A'
          }));
          setData(transformedData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [timeFilter]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Report ID",
        cell: ({ getValue }) => (
          <span
            className={`font-mono text-sm ${darkMode ? "text-blue-400" : "text-blue-600"}`}
          >
            {getValue()}
          </span>
        ),
      },
      {
        accessorKey: "hazardType",
        header: "Hazard Type",
        cell: ({ getValue }) => (
          <span className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
            {getValue()}
          </span>
        ),
      },
      {
        accessorKey: "region",
        header: "Region",
        cell: ({ getValue }) => (
          <span className={darkMode ? "text-gray-300" : "text-gray-600"}>
            {getValue()}
          </span>
        ),
      },
      {
        accessorKey: "severity",
        header: "Severity",
        cell: ({ getValue }) => {
          const severity = getValue();
          const severityColors = {
            'critical': 'bg-red-100 text-red-800',
            'high': 'bg-orange-100 text-orange-800',
            'medium': 'bg-yellow-100 text-yellow-800',
            'low': 'bg-green-100 text-green-800',
          };
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                severityColors[severity?.toLowerCase()] || 'bg-gray-100 text-gray-800'
              }`}
            >
              {severity}
            </span>
          );
        },
      },
      {
        accessorKey: "reportDate",
        header: "Report Date",
        cell: ({ getValue }) => (
          <span className={darkMode ? "text-gray-300" : "text-gray-600"}>
            {getValue()}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue();
          const statusColors = {
            'verified': 'bg-green-100 text-green-800',
            'pending': 'bg-yellow-100 text-yellow-800',
            'investigating': 'bg-blue-100 text-blue-800',
            'rejected': 'bg-red-100 text-red-800',
            'resolved': 'bg-gray-100 text-gray-800',
          };
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                statusColors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
              }`}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: "affectedArea",
        header: "Affected Area",
        cell: ({ getValue }) => (
          <span className={darkMode ? "text-gray-300" : "text-gray-600"}>
            {getValue()}
          </span>
        ),
      },
      {
        accessorKey: "reporter",
        header: "Reporter",
        cell: ({ getValue }) => (
          <span className={darkMode ? "text-gray-300" : "text-gray-600"}>
            {getValue()}
          </span>
        ),
      },
    ],
    [darkMode]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const exportData = () => {
    const csvContent = [
      columns.map(col => col.header).join(','),
      ...data.map(row => 
        columns.map(col => 
          `"${row[col.accessorKey] || ''}"`
        ).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hazard-reports-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const uniqueHazardTypes = [...new Set(data.map(item => item.hazardType))];
  const uniqueRegions = [...new Set(data.map(item => item.region))];

  if (loading) {
    return (
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mr-3" />
          <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            Loading data...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
      <div className="mb-6">
        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Hazard Reports Data Explorer
        </h2>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search all columns..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className={`px-3 py-2 border rounded-md text-sm ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
          
          <select
            value={hazardTypeFilter}
            onChange={(e) => setHazardTypeFilter(e.target.value)}
            className={`px-3 py-2 border rounded-md text-sm ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">All Hazard Types</option>
            {uniqueHazardTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className={`px-3 py-2 border rounded-md text-sm ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">All Regions</option>
            {uniqueRegions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
          
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className={`px-3 py-2 border rounded-md text-sm ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">All Time</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          
          <button
            onClick={exportData}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="border-b border-gray-200 dark:border-gray-700">
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}
                  >
                    <div
                      className={`flex items-center space-x-1 ${
                        header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                      }`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <span>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </span>
                      {header.column.getCanSort() && (
                        <span className="ml-1">
                          {header.column.getIsSorted() === 'asc' ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : header.column.getIsSorted() === 'desc' ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronUp className="w-4 h-4 opacity-50" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{' '}
          of {table.getFilteredRowModel().rows.length} results
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className={`p-2 rounded-md ${
              table.getCanPreviousPage()
                ? 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className={`p-2 rounded-md ${
              table.getCanPreviousPage()
                ? 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
            }`}
          >
            Previous
          </button>
          
          <span className={`px-3 py-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className={`p-2 rounded-md ${
              table.getCanNextPage()
                ? 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
            }`}
          >
            Next
          </button>
          
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className={`p-2 rounded-md ${
              table.getCanNextPage()
                ? 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}