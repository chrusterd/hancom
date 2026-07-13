import { useCallback, useMemo } from 'react'
import DashboardProvider from './context/DashboardProvider'
import useDashboard from './hooks/useDashboard'
import useHashRoute from './hooks/useHashRoute'
import useAssetTicker from './hooks/useAssetTicker'
import useCandles from './hooks/useCandles'
import useBinanceTicker from './hooks/useBinanceTicker'
import useExchangeRate from './hooks/useExchangeRate'
import { getGroup } from './api/assets'
import DocsPage from './components/DocsPage'
import Header from './components/Header'
import HeroTile from './components/HeroTile'
import RangeTabs from './components/RangeTabs'
import ViewToggle from './components/ViewToggle'
import StatTiles from './components/StatTiles'
import AssetList from './components/AssetList'
import PriceChart from './components/PriceChart'
import DataTable from './components/DataTable'
import './App.css'

const EMPTY_HISTORY = []

function Dashboard() {
  const { state, dispatch } = useDashboard()
  const group = getGroup(state.groupId)
  const asset = group.assets.find((item) => item.id === state.market) ?? group.assets[0]
  const isCrypto = group.id === 'crypto'
  const range = group.ranges.find((item) => item.id === state.rangeId) ?? group.ranges[0]

  const { tickers, history, updatedAt } = useAssetTicker(group, state.interval * 1000)
  const { prices: overseasPrices } = useBinanceTicker()
  const usdKrw = useExchangeRate()
  const { candles: rangeCandles, loading } = useCandles(asset, range, isCrypto)
  const ticker = tickers[asset.id]
  const selectedHistory = history[asset.id] ?? EMPTY_HISTORY

  const sessionCandles = useMemo(() => selectedHistory.map((point) => ({
    t: point.t,
    price: point.p,
    high: point.p,
    low: point.p,
    volume: 0,
  })), [selectedHistory])

  // 기간별 캔들을 못 받으면(프록시 꺼짐 등) 세션 히스토리로 대체한다
  const candles = rangeCandles ?? sessionCandles
  const hasRangeData = Boolean(rangeCandles?.length)
  const rangeLabel = hasRangeData ? range.label : '현재 세션'
  // 환율·원자재는 거래대금 개념이 없고, 미국주식은 달러라 원화로 환산해 보여준다
  const hasVolume = isCrypto || group.id === 'kr-stock' || group.id === 'us-stock'

  const rangeStats = useMemo(() => {
    if (!candles?.length) return null
    const volume = candles.reduce((sum, item) => sum + item.volume, 0)
    return {
      high: Math.max(...candles.map((item) => item.high)),
      low: Math.min(...candles.map((item) => item.low)),
      volume: group.id === 'us-stock' ? volume * usdKrw : volume,
    }
  }, [candles, group.id, usdKrw])

  const handleSelect = useCallback((id) => dispatch({ type: 'selectMarket', market: id }), [dispatch])
  const handleGroupSelect = useCallback((groupId) => {
    const nextGroup = getGroup(groupId)
    dispatch({ type: 'selectGroup', groupId, market: nextGroup.assets[0].id })
  }, [dispatch])

  return (
    <div className="dashboard">
      <Header dataMode={ticker?.mode} updatedAt={updatedAt} groupId={group.id} />

      <div className="main-grid">
        <AssetList
          group={group}
          tickers={tickers}
          history={history}
          selected={asset.id}
          onSelect={handleSelect}
          onGroupSelect={handleGroupSelect}
          overseasPrices={overseasPrices}
          usdKrw={usdKrw}
        />

        <div className="chart-col">
          <HeroTile coin={asset} ticker={ticker} history={selectedHistory} />

          <RangeTabs ranges={group.ranges} />
          <StatTiles stats={rangeStats} rangeLabel={rangeLabel} asset={asset} showVolume={hasVolume && hasRangeData} />

          <section className={`card chart-card ${loading && rangeCandles ? 'refreshing' : ''}`}>
            <div className="chart-head">
              <h2 className="chart-title">{asset.name} 가격 추이</h2>
              <span className="chart-sub">{rangeLabel} · {ticker?.source ?? asset.provider}</span>
              <div className="spacer" />
              {isCrypto && <ViewToggle />}
            </div>
            {!candles?.length ? (
              <div className="placeholder">
                <span className="spinner" aria-hidden="true" />
                <span className="loading-text">시세 불러오는 중</span>
              </div>
            ) : state.view === 'table' && isCrypto ? (
              <DataTable candles={candles} rangeId={range.id} />
            ) : (
              <PriceChart candles={candles} rangeId={hasRangeData ? range.id : '5m'} />
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const route = useHashRoute()
  return <DashboardProvider>{route === '#/docs' ? <DocsPage /> : <Dashboard />}</DashboardProvider>
}
