"use client";
import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { NewCoin } from "@/lib/db";

const CoinChart = ({ coinData }: { coinData: NewCoin | null }) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  function formatPriceHistory(priceHistory: number[]) {
    const formattedHistory = [];
    let dateCounter = 0;
    for (let i = 0; i < priceHistory.length && dateCounter < 720; i++) {
      formattedHistory.push({
        date: `${dateCounter} hour ago`,
        value: priceHistory[i] + 1,
      });
      dateCounter++;
    }

    return formattedHistory;
  }
  const res = coinData ? formatPriceHistory(coinData.price_history) : null;

  const data = {
    labels: res ? res.map((e) => e.date) : [],
    datasets: [
      {
        label: "Price dynamics",
        data: res ? res.map((e) => e.value) : [],
        borderColor: `#7eb14a`,
        backgroundColor: `#7eb14a`,
        fill: true,
      },
    ],
  };

  const options = {
    spanGaps: true,
    legend: {
      display: false,
    },

    scales: {
      x: {
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          display: false,
        },
      },
    },
    pan: {
      enabled: true,
      mode: "y",
    },
    zoom: {
      enabled: true,
      mode: "x",
      sensitivity: 0.5,
    },
  };
  return (
    <div>
      <Line
        data={data}
        // @ts-ignore
        options={options}
      />
    </div>
  );
};
export default CoinChart;
