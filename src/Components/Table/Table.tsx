"use client";
import css from "./Table.module.scss";
import Image from "next/image";
import { useEffect, useState } from "react";
import Pagination from "./Pagination/Pagination";
import Modal from "../Modal/Modal";
import cn from "classnames";

interface CoinsData {
  result: any[];
  totalPages: number;
  totalRecords: number;
}

export default function Table() {
  const [coinsData, setCoinsData] = useState<CoinsData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCoin, setModalCoin] = useState(null);

  function openModal(coin: any) {
    setIsModalOpen(true);
    setModalCoin(coin);
  }

  const closeModal = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${window.location.origin}/api/coins`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          // @ts-ignore
          params: {
            page: currentPage,
            page_size: 10,
          },
        });
        const data = await response.json();
        setCoinsData(data);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    fetchData();
  }, [currentPage]);

  const renderPriceChange = (priceHistory: number[], hours: number) => {
    if (priceHistory.length > hours) {
      const change = calculatePriceDifference(
        priceHistory[0],
        priceHistory[hours]
      );
      return (
        <td className={cn(css.Precent, change > 0 && css.CoinPrecentPlus)}>
          {change}%
        </td>
      );
    }
    return <td>N/A</td>;
  };

  const calculatePriceDifference = (
    currentPrice: number,
    previousPrice: number
  ): number => {
    const res = Number(
      (((currentPrice - previousPrice) / previousPrice) * 100).toFixed(3)
    );
    return res;
  };
  return (
    coinsData && (
      <>
        <div className={css.TableWrapper}>
          <div className={css.Table}>
            <table>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Price</th>
                  <th>MCap</th>
                  <th>Volume</th>
                  <th>1h</th>
                  <th>6h</th>
                  <th>24h</th>
                  <th>7d</th>
                  <th>30d</th>
                </tr>
              </thead>
              <tbody>
                {(coinsData.result as any[]).map((el: any) => (
                  <tr key={el.id} onClick={() => openModal(el)}>
                    <td>
                      <div className={css.CoinSymbol}>
                        {el.image && (
                          <Image
                            width={30}
                            height={30}
                            src={el.image}
                            alt={`${el.symbol}`}
                          />
                        )}
                        {el.symbol}
                      </div>
                    </td>
                    <td>${el.current_price}</td>
                    <td>${el.market_cap}</td>
                    <td>${el.total_volume}</td>
                    {renderPriceChange(el.price_history, 1)}
                    {renderPriceChange(el.price_history, 6)}
                    {renderPriceChange(el.price_history, 24)}
                    {renderPriceChange(el.price_history, 168)}
                    {renderPriceChange(el.price_history, 720)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            totalPages={coinsData.totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          modalCoin={modalCoin}
        />
      </>
    )
  );
}
