'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import {
    getCandlestickConfig,
    getChartConfig,
    LIVE_INTERVAL_BUTTONS,
    PERIOD_BUTTONS,
    PERIOD_CONFIG,
} from '@/constants';
import { CandlestickSeries, createChart, IChartApi, ISeriesApi } from 'lightweight-charts';
import { fetcher } from '@/lib/coingecko.actions';
import { convertOHLCData } from '@/lib/utils';

// Added explicit type configurations to satisfy compiler constraints
interface CandlestickChartProps {
    children?: React.ReactNode;
    data: number[][];
    coinId?: string;
    height?: number;
    initialPeriod?: Period;
    liveOhlcv?: any;
    mode?: string;
    liveInterval?: any;
    setLiveInterval?: (val: any) => void;
}

const CandlestickChart = ({
                              children,
                              data,
                              coinId,
                              height = 360,
                              initialPeriod = 'daily',
                              liveOhlcv = null,
                              mode = 'historical',
                              liveInterval,
                              setLiveInterval,
                          }: CandlestickChartProps) => {
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
    const prevOhlcDataLength = useRef<number>(data?.length || 0);

    const [period, setPeriod] = useState<Period>(initialPeriod);
    const [ohlcData, setOhlcData] = useState<number[][]>(data ?? []);
    const [isPending, startTransition] = useTransition();

    // Re-sync local data state if the parent page component pumps down fresh data strings
    useEffect(() => {
        if (data) {
            setOhlcData(data);
        }
    }, [data]);

    const fetchOHLCData = async (selectedPeriod: Period) => {
        if (!coinId) return;
        try {
            const { days, interval } = PERIOD_CONFIG[selectedPeriod];

            const newData = await fetcher<number[][]>(`/coins/${coinId}/ohlc`, {
                vs_currency: 'usd',
                days,
                interval,
                precision: 'full',
            });

            startTransition(() => {
                setOhlcData(newData ?? []);
            });
        } catch (e) {
            console.error('Failed to fetch OHLCData', e);
        }
    };

    const handlePeriodChange = (newPeriod: Period) => {
        if (newPeriod === period) return;

        setPeriod(newPeriod);
        fetchOHLCData(newPeriod);
    };

    useEffect(() => {
        const container = chartContainerRef.current;
        if (!container) return;

        const showTime = ['daily', 'weekly', 'monthly'].includes(period);

        const chart = createChart(container, {
            ...getChartConfig(height, showTime),
            width: container.clientWidth,
        });
        const series = chart.addSeries(CandlestickSeries, getCandlestickConfig());

        const convertedToSeconds = ohlcData.map(
            (item) => [Math.floor(item[0] / 1000), item[1], item[2], item[3], item[4]] as number[],
        );

        series.setData(convertOHLCData(convertedToSeconds as OHLCData[]));
        chart.timeScale().fitContent();

        chartRef.current = chart;
        candleSeriesRef.current = series;

        const observer = new ResizeObserver((entries) => {
            if (!entries.length) return;
            chart.applyOptions({ width: entries[0].contentRect.width });
        });
        observer.observe(container);

        return () => {
            observer.disconnect();
            chart.remove();
            chartRef.current = null;
            candleSeriesRef.current = null;
        };
    }, [height, period, ohlcData]);

    useEffect(() => {
        if (!candleSeriesRef.current) return;

        const convertedToSeconds = ohlcData.map(
            (item) => [Math.floor(item[0] / 1000), item[1], item[2], item[3], item[4]] as number[],
        );

        let merged: number[][];

        if (liveOhlcv) {
            const liveTimestamp = liveOhlcv[0];

            const lastHistoricalCandle = convertedToSeconds[convertedToSeconds.length - 1];

            if (lastHistoricalCandle && lastHistoricalCandle[0] === liveTimestamp) {
                merged = [...convertedToSeconds.slice(0, -1), liveOhlcv];
            } else {
                merged = [...convertedToSeconds, liveOhlcv];
            }
        } else {
            merged = convertedToSeconds;
        }

        merged.sort((a, b) => a[0] - b[0]);

        const converted = convertOHLCData(merged as OHLCData[]);
        candleSeriesRef.current.setData(converted);

        const dataChanged = prevOhlcDataLength.current !== ohlcData.length;

        if (dataChanged || mode === 'historical') {
            chartRef.current?.timeScale().fitContent();
            prevOhlcDataLength.current = ohlcData.length;
        }
    }, [ohlcData, period, liveOhlcv, mode]);

    return (
        /* CRITICAL FIX: Explicitly set the width to 100% and overflow to hidden.
          This stops the lightweight-charts engine from expanding past its flex boundaries
          and guarantees the sidebar can jump right up next to it!
        */
        <div id="candlestick-chart" className="w-full overflow-hidden flex flex-col">
            <div className="chart-header flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="flex-1">{children}</div>

                <div className="button-group flex items-center">
                    <span className="text-sm mx-2 font-medium text-purple-100/50">Period:</span>
                    {PERIOD_BUTTONS.map(({ value, label }) => (
                        <button
                            key={value}
                            className={period === value ? 'config-button-active' : 'config-button'}
                            onClick={() => handlePeriodChange(value)}
                            disabled={isPending}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {liveInterval && (
                    <div className="button-group flex items-center">
                        <span className="text-sm mx-2 font-medium text-purple-100/50">Update Frequency:</span>
                        {LIVE_INTERVAL_BUTTONS.map(({ value, label }) => (
                            <button
                                key={value}
                                className={liveInterval === value ? 'config-button-active' : 'config-button'}
                                onClick={() => setLiveInterval && setLiveInterval(value)}
                                disabled={isPending}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div ref={chartContainerRef} className="chart w-full" style={{ height }} />
        </div>
    );
};

export default CandlestickChart;
