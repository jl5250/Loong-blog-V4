export default function Loading() {
  return (
    <div className="flex-1 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
        <p className="font-sans text-sm text-text-muted">墨韵渐显...</p>
      </div>
    </div>
  );
}
