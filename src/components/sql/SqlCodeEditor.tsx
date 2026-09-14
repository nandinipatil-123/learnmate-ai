import React, { useRef } from 'react';
import { Play, RotateCcw, Sparkles, Trash2, Keyboard } from 'lucide-react';

interface SqlCodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  onRun: () => void;
  onResetStarter: () => void;
  isExecuting?: boolean;
}

const COMMON_SQL_KEYWORDS = [
  'SELECT',
  'FROM',
  'WHERE',
  'GROUP BY',
  'HAVING',
  'ORDER BY',
  'INNER JOIN',
  'ON',
  'INSERT INTO',
  'VALUES',
  'UPDATE',
  'SET',
  'DELETE FROM',
  'DISTINCT',
  'COUNT(*)',
];

export const SqlCodeEditor: React.FC<SqlCodeEditorProps> = ({
  value,
  onChange,
  onRun,
  onResetStarter,
  isExecuting = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Calculate line numbers
  const lines = value.split('\n');
  const lineCount = Math.max(lines.length, 6);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  // Handle Tab key and Ctrl+Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);

      // Restore cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  // Insert keyword token at cursor position
  const handleInsertToken = (token: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(value ? `${value} ${token}` : token);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue =
      value.substring(0, start) + (start > 0 && !value[start - 1].match(/\s/) ? ' ' : '') + token + ' ' + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      const nextPos = start + token.length + 1;
      textarea.selectionStart = textarea.selectionEnd = nextPos;
    }, 0);
  };

  // Quick uppercase formatter for SQL keywords
  const handleFormatSql = () => {
    const keywords = [
      'select', 'from', 'where', 'and', 'or', 'not', 'group by', 'order by',
      'having', 'inner join', 'left join', 'right join', 'join', 'on', 'as',
      'distinct', 'count', 'avg', 'sum', 'min', 'max', 'asc', 'desc',
      'insert into', 'values', 'update', 'set', 'delete from', 'delete',
      'limit', 'like', 'in', 'between', 'is null', 'is not null',
    ];

    let formatted = value;
    keywords.forEach((kw) => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      formatted = formatted.replace(regex, kw.toUpperCase());
    });

    onChange(formatted);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl flex flex-col">
      {/* Editor Top Bar */}
      <div className="px-3 sm:px-4 py-2 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            SQL Query Editor
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline font-mono">
            (Standard SQL / AlaSQL Engine)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleFormatSql}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors"
            title="Capitalize SQL Keywords"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Format</span>
          </button>
          <button
            onClick={onResetStarter}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors"
            title="Reset to original starter code"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Reset Code</span>
          </button>
          <button
            onClick={() => onChange('')}
            className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            title="Clear Editor"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor Body with Gutter */}
      <div className="flex-1 flex min-h-[160px] sm:min-h-[190px] relative bg-slate-950 font-mono text-sm">
        {/* Line Numbers Gutter */}
        <div className="py-3 px-2 bg-slate-950 border-r border-slate-800/80 text-slate-600 select-none text-right font-mono text-xs w-9 shrink-0 leading-6">
          {lineNumbers.map((num) => (
            <div key={num}>{num}</div>
          ))}
        </div>

        {/* Text Area Input */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoComplete="off"
          placeholder="-- Write your SQL query here... e.g. SELECT * FROM students;"
          className="w-full flex-1 p-3 bg-transparent text-slate-100 placeholder-slate-600 font-mono text-sm leading-6 resize-none focus:outline-hidden focus:ring-0"
        />
      </div>

      {/* Quick SQL Keyword Toolbar */}
      <div className="px-3 py-2 bg-slate-900/60 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-xs">
        <span className="text-[11px] text-slate-500 font-medium shrink-0 flex items-center gap-1 mr-1">
          <Keyboard className="w-3 h-3 text-slate-400" />
          Insert:
        </span>
        {COMMON_SQL_KEYWORDS.map((kw) => (
          <button
            key={kw}
            onClick={() => handleInsertToken(kw)}
            className="px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white font-mono text-[11px] shrink-0 transition-colors cursor-pointer border border-slate-700/50"
          >
            {kw}
          </button>
        ))}
      </div>
    </div>
  );
};
