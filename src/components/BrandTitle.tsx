import './BrandTitle.css'

type BrandTitleProps = {
  as?: 'h1' | 'p' | 'span'
  className?: string
}

export default function BrandTitle({ as: Tag = 'span', className }: BrandTitleProps) {
  return (
    <Tag className={['brand-title', className].filter(Boolean).join(' ')}>
      <span className="brand-title__proper">Proper</span>
      <span className="brand-title__tlv">TLV</span>
    </Tag>
  )
}
