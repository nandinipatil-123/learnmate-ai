import React, { useState } from 'react';
import { X, Table, Key, ArrowRightLeft, Database, Info, Eye } from 'lucide-react';
import { UNIVERSITY_SCHEMA, SqlTableSchema } from '../../data/sqlPracticeData';
import { getLiveTableRows } from '../../utils/sqlRunner';

interface SqlSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTable?: string;
}

export const SqlSchemaModal: React.FC<SqlSchemaModalProps> = ({
  isOpen,
  onClose,
  initialTable = 'students',
}) => {
  const [selectedTable, setSelectedTable] = useState<string>(initialTable);
  const [viewMode, setViewMode] = useState<'columns' | 'data'>('columns');

  if (!isOpen) return null;

  const currentSchema =
    UNIVERSITY_SCHEMA.find((t) => t.tableName === selectedTable) || UNIVERSITY_SCHEMA[0];

  // Fetch live table rows (or fallback to sampleData)
  const liveRows = getLiveTableRows(currentSchema.tableName);
  const displayRows = liveRows.length > 0 ? liveRows : currentSchema.sampleData;

  return (
    <div
      id="sql-schema-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="sql-schema-modal-content"
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-100">
                  University Database Schema
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 text-xs font-semibold border border-cyan-800/50">
                  5 Relational Tables
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Inspect live tables, attribute definitions, primary/foreign key constraints, and sample data.
              </p>
            </div>
          </div>

          <button
            id="btn-close-schema-modal"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Close Schema Viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Table Selector Tabs */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-950/40 border-b border-slate-800/80 overflow-x-auto">
          {UNIVERSITY_SCHEMA.map((table) => {
            const isSelected = table.tableName === currentSchema.tableName;
            return (
              <button
                key={table.tableName}
                id={`schema-tab-${table.tableName}`}
                onClick={() => setSelectedTable(table.tableName)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>{table.tableName}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isSelected ? 'bg-slate-900/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {table.columns.length} cols
                </span>
              </button>
            );
          })}
        </div>

        {/* Sub-header with Table description & View toggle */}
        <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="font-mono text-cyan-400 font-bold text-sm">
              {currentSchema.tableName}
            </span>
            <span className="text-xs text-slate-400 ml-2">
              — {currentSchema.description}
            </span>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              onClick={() => setViewMode('columns')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'columns'
                  ? 'bg-slate-800 text-cyan-300 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Columns & Types
            </button>
            <button
              onClick={() => setViewMode('data')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'data'
                  ? 'bg-slate-800 text-cyan-300 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sample Data ({displayRows.length} rows)
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {viewMode === 'columns' ? (
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900/90 text-slate-300 border-b border-slate-800">
                    <th className="py-2.5 px-3 font-semibold">Column Name</th>
                    <th className="py-2.5 px-3 font-semibold">Data Type</th>
                    <th className="py-2.5 px-3 font-semibold">Key / Constraint</th>
                    <th className="py-2.5 px-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {currentSchema.columns.map((col) => (
                    <tr key={col.name} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-cyan-300">
                        {col.name}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-emerald-400">
                        {col.type}
                      </td>
                      <td className="py-2.5 px-3">
                        {col.isPrimaryKey ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/60 text-amber-300 text-[10px] font-bold">
                            <Key className="w-3 h-3" />
                            PRIMARY KEY
                          </span>
                        ) : col.foreignKey ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 text-[10px] font-medium">
                            <ArrowRightLeft className="w-3 h-3" />
                            FK → {col.foreignKey}
                          </span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">{col.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900/90 text-slate-300 border-b border-slate-800">
                    <th className="py-2 px-3 w-10 text-slate-500 font-mono text-center">#</th>
                    {currentSchema.columns.map((col) => (
                      <th key={col.name} className="py-2.5 px-3 font-mono text-cyan-400 font-semibold">
                        {col.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {displayRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-2 px-3 text-slate-500 font-mono text-center text-[11px]">
                        {idx + 1}
                      </td>
                      {currentSchema.columns.map((col) => {
                        const val = row[col.name];
                        return (
                          <td key={col.name} className="py-2 px-3 font-mono text-slate-200">
                            {val === null || val === undefined ? (
                              <span className="text-slate-500 italic">NULL</span>
                            ) : typeof val === 'number' ? (
                              <span className="text-amber-300">{val}</span>
                            ) : (
                              <span>{String(val)}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Quick Relationship Guide */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200">Relational Architecture Note: </span>
              <span>
                Foreign keys establish referential integrity: <code className="text-cyan-300">students.dept_id</code> and <code className="text-cyan-300">courses.dept_id</code> reference <code className="text-cyan-300">departments.dept_id</code>. <code className="text-cyan-300">enrollments</code> connects students to courses.
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>In-memory sandbox: Safe isolated execution</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors cursor-pointer"
          >
            Got it, Return to Editor
          </button>
        </div>
      </div>
    </div>
  );
};
