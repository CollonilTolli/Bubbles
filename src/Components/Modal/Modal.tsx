import css from "./Modal.module.scss";
import { NewCoin } from "@/lib/db";
import React from "react";
import Image from "next/image";
import CoinChart from "./CoinChart/CoinChart";
import cn from "classnames";

const Modal = ({
  isOpen,
  onClose,
  modalCoin,
}: {
  isOpen: boolean;
  onClose: () => void;
  modalCoin: NewCoin | null;
}) => {
  console.log(modalCoin);
  const handleClose = () => {
    onClose();
  };
  function calculatePriceDifference(currentPrice: number, lastPrice: number) {
    if (lastPrice === 0) {
      return 0;
    }
    const priceDifference = currentPrice - lastPrice;
    const percentageDifference = (priceDifference / lastPrice) * 100;

    return Number(percentageDifference.toFixed(2));
  }
  return (
    isOpen && (
      <div className={css.ModalBack} onClick={handleClose}>
        <div className={css.Modal} onClick={(e) => e.stopPropagation()}>
          <button className={css.ModalClose} onClick={handleClose}>
            <svg
              focusable="false"
              aria-hidden="true"
              viewBox="0 0 24 24"
              data-testid="HighlightOffIcon"
            >
              <path d="M14.59 8 12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8"></path>
            </svg>
          </button>
          <div className={css.CoinInfo}>
            <div className={css.CoinTitle}>
              {modalCoin?.image && (
                <Image
                  src={modalCoin?.image}
                  alt={modalCoin?.symbol || ""}
                  width={50}
                  height={50}
                />
              )}
              <span className={css.CoinName}>{modalCoin?.name}</span>
              <span className={css.CoinSymbol}>{modalCoin?.symbol}</span>
            </div>
            <div className={css.CoinPrice}>
              <span>${modalCoin?.current_price}</span>
              <span
                className={cn(
                  css.CoinPrecent,
                  modalCoin?.current_price &&
                    calculatePriceDifference(
                      modalCoin?.current_price,
                      modalCoin?.price_history[1]
                    ) > 0 &&
                    css.CoinPrecentPlus
                )}
              >
                {modalCoin?.current_price &&
                  calculatePriceDifference(
                    modalCoin?.current_price,
                    modalCoin?.price_history[1]
                  )}
                %
              </span>
            </div>
            <ul className={css.InfoList}>
              <li>
                <span>Price</span>
                <span>${modalCoin?.current_price}</span>
              </li>
              <li>
                <span>M Cap</span>
                <span>${modalCoin?.market_cap}</span>
              </li>
              <li>
                <span>FDV</span>
                <span>${modalCoin?.fully_diluted_valuation}</span>
              </li>
              <li>
                <span>24H Vol</span>
                <span>${modalCoin?.price_change_24h}</span>
              </li>
            </ul>
          </div>
          <div className={css.CoinChart}>
            <div className={css.Chart}></div>
            <CoinChart coinData={modalCoin} />
            <div className={css.TimeBlock}>
              <div className={css.TimeStap}>
                <div className={css.Name}>Hour</div>
                <div className={css.Precent}>
                  {modalCoin?.price_history &&
                  modalCoin?.price_history.length > 1 ? (
                    <div>
                      {modalCoin?.current_price &&
                        calculatePriceDifference(
                          modalCoin?.current_price,
                          modalCoin?.price_history[0]
                        )}
                      %
                    </div>
                  ) : (
                    `N/A`
                  )}
                </div>
              </div>
              <div className={css.TimeStap}>
                <div className={css.Name}>Day</div>
                <div className={css.Precent}>
                  {modalCoin?.price_history &&
                  modalCoin?.price_history.length > 24 ? (
                    <div>
                      {modalCoin?.current_price &&
                        calculatePriceDifference(
                          modalCoin?.current_price,
                          modalCoin?.price_history[24]
                        )}
                      %
                    </div>
                  ) : (
                    `N/A`
                  )}
                </div>
              </div>
              <div className={css.TimeStap}>
                <div className={css.Name}>Week</div>
                <div className={css.Precent}>
                  {modalCoin?.price_history &&
                  modalCoin?.price_history.length > 167 ? (
                    <div>
                      {modalCoin?.current_price &&
                        calculatePriceDifference(
                          modalCoin?.current_price,
                          modalCoin?.price_history[167]
                        )}
                      %
                    </div>
                  ) : (
                    `N/A`
                  )}
                </div>
              </div>
              <div className={css.TimeStap}>
                <div className={css.Name}>Month</div>
                <div className={css.Precent}>
                  {modalCoin?.price_history &&
                  modalCoin?.price_history.length > 719 ? (
                    <div>
                      {modalCoin?.current_price &&
                        calculatePriceDifference(
                          modalCoin?.current_price,
                          modalCoin?.price_history[719]
                        )}
                      %
                    </div>
                  ) : (
                    `N/A`
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Modal;
