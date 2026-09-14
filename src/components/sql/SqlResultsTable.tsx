import React from 'react';
import { CheckCircle2, AlertTriangle, Clock, Database, FileSpreadsheet } from 'lucide-react';
import { SqlQueryResult } from '../../utils/sqlRunner';

interface SqlResultsTableProps {
  result: SqlQueryResult | null;
  isExecuting?: boolean;
}

export const SqlResultsTable: React.FC<SqlResultsTableProps> = ({
  result,
  isExecuting = false,
}) => {
  if (isExecuting) {
    return (
      <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
        <p className="text-xs text-slate-400 font-medium">Executing query in safe in-memory database...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="p-8 rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 flex flex-col items-center justify-center text-center space-y-2">
        <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
          <FileSpreadsheet className="w-5 h-5" />
        </div>
        <p className="text-sm font-semibold text-slate-300">No Query Executed Yet</p>
        <p className="text-xs text-slate-500 max-w-sm">
          Write your query above and click <span className="text-cyan-400 font-semibold">Run SQL</span> to see the tabular result set.
        </p>
      </div>
    );
  }

  // Error State
  if (!result.success || result.error) {
    return (
      <div className="rounded-2xl border border-rose-800/60 bg-rose-950/20 p-4 space-y-2">
        <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>SQL Execution Error</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-950 border border-rose-900/50 font-mono text-xs text-rose-300 overflow-x-auto whitespace-pre-wrap">
          {result.error}
        </div>
        <p className="text-[11px] text-slate-400">
          Tip: Check table spelling, column names in the schema, commas between columns, and matching quotes.
        </p>
      </div>
    );
  }

  // DML mutation notification (INSERT, UPDATE, DELETE)
  const isDml = result.queryType === 'INSERT' || result.queryType === 'UPDATE' || result.queryType === 'DELETE';

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl space-y-0">
      {/* Execution Meta Header */}
      <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-950/70 border border-emerald-800/60 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Query Executed
          </span>
          <span className="text-xs text-slate-400 font-medium">
            {isDml ? (
              <span>{result.affectedRows || 1} row(s) affected</span>
            ) : (
              <span>
                {result.rowCount} {result.rowCount === 1 ? 'row' : 'rows'} returned
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500" />
            {result.executionTimeMs} ms
          </span>
          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-semibold">
            {result.queryType}
          </span>
        </div>
      </div>

      {/* Result Table Body */}
      {result.rows.length === 0 ? (
        <div className="p-6 text-center text-xs text-slate-400">
          Query returned 0 matching records.
        </div>
      ) : (
        <div className="overflow-x-auto max-h-[320px] overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-slate-900 z-10">
              <tr className="border-b border-slate-800 text-slate-300 font-mono">
                <th className="py-2.5 px-3 w-10 text-slate-500 text-center font-mono text-[11px]">#</th>
                {result.columns.map((col) => (
                  <th key={col} className="py-2.5 px-3 font-semibold text-cyan-400">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {result.rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-2 px-3 text-slate-500 font-mono text-center text-[11px]">
                    {rIdx + 1}
                  </td>
                  {result.columns.map((col) => {
                    const val = row[col];
                    return (
                      <td key={col} className="py-2 px-3 font-mono text-slate-200">
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
    </div>
  );
};
