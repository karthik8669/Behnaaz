export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-xs rounded-2xl border border-[#ecd9cf] bg-white/85 p-6 text-center shadow-sm">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#ecd9cf] border-t-[#7b4456]" />

        <p className="mt-4 text-sm font-semibold text-[#6f3f50]">
          Loading Behnaaz...
        </p>

        <div className="mt-3 flex items-center justify-center gap-1.5">
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#7b4456] [animation-delay:-0.3s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#b08b57] [animation-delay:-0.15s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#7b4456]" />
        </div>
      </div>
    </div>
  );
}
