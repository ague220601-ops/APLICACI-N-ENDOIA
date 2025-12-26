import { BibliotecaItem, TablaContent } from '@/data/bibliotecaClinica';

interface ItemTablaProps {
  item: BibliotecaItem;
}

export function ItemTabla({ item }: ItemTablaProps) {
  const content = item.content as TablaContent;
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-700">
            {content.headers?.map((header: string, idx: number) => (
              <th
                key={idx}
                className="text-left px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-800/50"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {content.rows?.map((row: string[], rowIdx: number) => (
            <tr
              key={rowIdx}
              className="border-b border-zinc-100 dark:border-zinc-800 last:border-0"
            >
              {row.map((cell, cellIdx) => (
                <td
                  key={cellIdx}
                  className="px-4 py-3 text-zinc-600 dark:text-zinc-300"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
