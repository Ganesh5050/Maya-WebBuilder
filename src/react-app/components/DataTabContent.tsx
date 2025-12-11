import { useState } from 'react';
import { Search, MoreHorizontal, ChevronUp, ChevronDown } from 'lucide-react';

interface TableColumn {
  name: string;
  type: string;
  sortable: boolean;
}

const tables = [
  { name: 'users (Mocha)', columns: 5, rows: 0 },
];

const columns: TableColumn[] = [
  { name: 'id', type: 'INTEGER', sortable: true },
  { name: 'email', type: 'TEXT', sortable: true },
  { name: 'last_signed_in_at', type: 'DATETIME', sortable: true },
  { name: 'updated_at', type: 'DATETIME', sortable: true },
  { name: 'created_at', type: 'DATETIME', sortable: true },
];

export default function DataTabContent() {
  const [selectedTable, setSelectedTable] = useState('users (Mocha)');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (columnName: string) => {
    if (sortColumn === columnName) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnName);
      setSortDirection('asc');
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left Sidebar - Tables */}
      <div className="w-72 border-r border-gray-200 flex flex-col bg-white">
        {/* Header */}
        <div className="p-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900 text-sm">Development</h3>
            <button className="text-gray-400 hover:text-gray-600 rounded-lg font-medium transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: 'rgb(245, 245, 245)',
                boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.04) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.03) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.02) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.01) 0px 13.500468px 13.500468px -2.91667px'
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-500">Tables</span>
            <button className="p-1 text-gray-400 hover:text-gray-600 rounded-lg font-medium transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: 'rgb(245, 245, 245)',
                boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.04) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.03) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.02) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.01) 0px 13.500468px 13.500468px -2.91667px'
              }}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-gray-600 rounded-lg font-medium transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: 'rgb(245, 245, 245)',
                boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.04) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.03) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.02) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.01) 0px 13.500468px 13.500468px -2.91667px'
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tables"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Tables List */}
        <div className="flex-1 overflow-y-auto">
          {tables.map((table) => (
            <button
              key={table.name}
              onClick={() => setSelectedTable(table.name)}
              className={`w-full text-left px-4 py-3 font-medium transition-all duration-200 hover:opacity-90 rounded-lg ${
                selectedTable === table.name ? 'bg-gray-100' : ''
              }`}
              style={{
                backgroundColor: selectedTable === table.name ? 'rgb(245, 245, 245)' : 'transparent',
                boxShadow: selectedTable === table.name
                  ? 'rgba(0, 0, 0, 0.05) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.04) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.03) 0px 3.500468px 3.500468px -1.75px, rgba(0, 0, 0, 0.02) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.01) 0px 13.500468px 13.500468px -2.91667px'
                  : 'none'
              }}
            >
              <div className="font-medium text-gray-900 text-sm">{table.name}</div>
              <div className="text-xs text-gray-500 mt-1">
                {table.columns} columns · {table.rows} rows
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Table View */}
      <div className="flex-1 bg-white flex flex-col">
        {/* Table Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{selectedTable}</h2>
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-500">Showing 0 of 0 results</div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <button className="px-3 py-1.5 text-sm font-medium text-gray-700 rounded-lg transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: 'rgb(245, 245, 245)',
                boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0.500468px 0.500468px -0.583333px, rgba(0, 0, 0, 0.04) 0px 1.500468px 1.500468px -1.16667px, rgba(0, 0, 0, 0.03) 0px 3.500468px 3.500468px -1.75px, rgba(0, 0, 0, 0.02) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.01) 0px 13.500468px 13.500468px -2.91667px'
              }}
            >
              New
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                {columns.map((column) => (
                  <th
                    key={column.name}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    <button
                      onClick={() => handleSort(column.name)}
                      className="flex items-center space-x-1 hover:text-gray-900 font-medium transition-all duration-200 hover:opacity-90 rounded-lg px-2 py-1"
                      style={{
                        backgroundColor: 'rgb(245, 245, 245)',
                        boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0.500468px 0.500468px -0.583333px, rgba(0, 0, 0, 0.04) 0px 1.500468px 1.500468px -1.16667px, rgba(0, 0, 0, 0.03) 0px 3.500468px 3.500468px -1.75px, rgba(0, 0, 0, 0.02) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.01) 0px 13.500468px 13.500468px -2.91667px'
                      }}
                    >
                      <span>{column.name}</span>
                      {column.sortable && (
                        <div className="flex flex-col">
                          <ChevronUp
                            className={`w-3 h-3 -mb-1 ${
                              sortColumn === column.name && sortDirection === 'asc'
                                ? 'text-gray-900'
                                : 'text-gray-400'
                            }`}
                          />
                          <ChevronDown
                            className={`w-3 h-3 ${
                              sortColumn === column.name && sortDirection === 'desc'
                                ? 'text-gray-900'
                                : 'text-gray-400'
                            }`}
                          />
                        </div>
                      )}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    No users yet. Users will appear after logging in through the preview.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
