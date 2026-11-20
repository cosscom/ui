type HeaderBannerProps = {
  alt: string;
  src?: string;
};

export function HeaderBanner({ alt, src }: HeaderBannerProps) {
  if (!src) {
    return null;
  }

  return (
    <div className="rounded-ss-xl px-1 pt-1">
      <div className="relative aspect-4/1 overflow-hidden">
        <img
          alt={alt}
          className="size-full rounded-t-[calc(var(--radius-xl)-2px)] @3xl:rounded-se-none object-cover object-top"
          src={src}
        />
      </div>
    </div>
  );
}
