import { memo } from 'react'
import { ASSET_GROUPS } from '../api/assets'
import Sparkline from './Sparkline'
import Delta from './Delta'
import { fmtAssetPrice, fmtUsd } from '../utils/format'

const EMPTY = []

const AssetRow = memo(function AssetRow({ asset, ticker, history, selected, onSelect, overseasPrice, usdKrw }) {
  const overseasKrw = overseasPrice != null ? overseasPrice * usdKrw : null
  const premium = overseasKrw && ticker ? (ticker.trade_price / overseasKrw - 1) * 100 : null

  return (
    <button type="button" className={`coin-row ${selected ? 'selected' : ''}`} aria-pressed={selected} onClick={() => onSelect(asset.id)}>
      <span className="symbol-badge" aria-hidden="true">{asset.symbol}</span>
      <span className="coin-meta">
        <span className="coin-name">{asset.name}</span>
        <span className="coin-code">{asset.code}</span>
      </span>
      <span className="coin-spark"><Sparkline data={history} width={64} height={24} /></span>
      <span className="coin-nums">
        {ticker
          ? <span className="coin-price">{fmtAssetPrice(ticker.trade_price, asset.currency)}</span>
          : <span className="skeleton skeleton-price" aria-label="시세 불러오는 중" />}
        {ticker && <Delta rate={ticker.signed_change_rate} />}
      </span>
      <span className="asset-source">
        <span className={`source-dot ${ticker?.mode ?? 'loading'}`} aria-hidden="true" />
        {ticker?.source ?? asset.provider}
        {asset.group === 'crypto' && overseasPrice != null && (
          <>
            <span>· 바이낸스 ${fmtUsd(overseasPrice)}</span>
            {premium != null && <span className={`premium ${premium >= 0 ? 'up' : 'down'}`}>{premium >= 0 ? '김프' : '역프'} {Math.abs(premium).toFixed(2)}%</span>}
          </>
        )}
      </span>
    </button>
  )
})

export default function AssetList({ group, tickers, history, selected, onSelect, onGroupSelect, overseasPrices = {}, usdKrw }) {
  return (
    <aside className="card coin-list asset-list" aria-label="자산 목록">
      <nav className="asset-tabs" aria-label="자산군">
        {ASSET_GROUPS.map((item) => (
          <button key={item.id} type="button" className={item.id === group.id ? 'active' : ''} onClick={() => onGroupSelect(item.id)}>{item.label}</button>
        ))}
      </nav>
      <div className="asset-rows">
        {group.assets.map((asset) => (
          <AssetRow key={asset.id} asset={asset} ticker={tickers[asset.id]} history={history[asset.id] ?? EMPTY} selected={asset.id === selected} onSelect={onSelect} overseasPrice={overseasPrices[asset.code]} usdKrw={usdKrw} />
        ))}
      </div>
    </aside>
  )
}
