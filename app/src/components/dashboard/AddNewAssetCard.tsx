interface AddNewAssetCardProps {
  onClick: () => void
}

export function AddNewAssetCard({ onClick }: AddNewAssetCardProps) {
  return (
    <div
      onClick={onClick}
      className="border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center p-xl group cursor-pointer hover:border-primary transition-all bg-surface-container-lowest/50"
    >
      <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center group-hover:bg-primary-fixed transition-all mb-md">
        <span className="material-symbols-outlined text-on-surface-variant text-[32px] group-hover:text-primary transition-all">
          cloud_upload
        </span>
      </div>
      <p className="font-headline-sm text-headline-sm text-on-surface-variant group-hover:text-primary transition-all">
        Add New Asset
      </p>
      <p className="font-body-sm text-on-surface-variant text-center mt-sm">
        Drop images here or click to browse files from your drive.
      </p>
    </div>
  )
}
