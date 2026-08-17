export default function ComingSoonScreen({ title }: { title: string }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <h2 className="text-[20px] font-bold text-[#15161a]">{title}</h2>
      <p className="mt-2 max-w-[240px] text-[13px] text-[#a3a29e]">
        This tab isn&rsquo;t built yet — check back soon.
      </p>
    </div>
  );
}
