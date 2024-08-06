"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  animate,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  createBubble,
  handleClick,
} from "./helpersBubble";
import NextImage from "next/image";
import Modal from "../Modal/Modal";
interface Bubble {
  x: number;
  y: number;
  size: number;
  dx: number;
  dy: number;
  isDragging: false;
  startX: number;
  startY: number;
  startMouseX: number;
  startMouseY: number;
  radius: number;
  content: {
    img: any;
    name: string;
    cource: string;
    innerImg: any;
  };
}

function Bubbles() {
  const [bubbles, setBubbles] = useState<Bubble[] | any>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [windowHeight, setWindowHeight] = useState<number>(0);
  const [modalCoin, setModalCoin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function openModal(coin: any) {
    setIsModalOpen(true);
    setModalCoin(coin);
  }

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const images = {
    redBubbleImage: NextImage,
    greenBubbleImage: NextImage,
  };
  if (typeof window !== "undefined") {
    // @ts-ignore
    images.redBubbleImage = new Image();
    // @ts-ignore
    images.greenBubbleImage = new Image();
    // @ts-ignore
    images.redBubbleImage.src = "./BubblesImages/RedBubble.svg";
    // @ts-ignore
    images.greenBubbleImage.src = "./BubblesImages/GreenBubble.svg";
  }
  const { redBubbleImage, greenBubbleImage } = images;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const PageSize = windowWidth < 500 ? 30 : windowWidth < 1000 ? 45 : 60;
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${window.location.origin}/api/coins?page=1&page_size=${PageSize}`
        );

        const data = await response.json();
        if (!!windowWidth) {
          setBubbles(
            //@ts-ignore
            data.result.map((item, index, array) => {
              const x = Math.random() * windowWidth;
              const y = Math.random() * windowHeight;
              return {
                ...createBubble(
                  item,
                  array,
                  windowWidth,
                  windowHeight,
                  // @ts-ignore
                  openModal
                ),
                x,
                y,
              };
            })
          );
        }
      } catch (error) {
        console.error("Error fetching coins:", error);
      }
    };

    fetchData();
  }, [windowWidth]);

  useEffect(() => {}, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        //@ts-ignore
        animate(ctx, bubbles, canvas, redBubbleImage, greenBubbleImage, 0.2); // передаем 0.2 для максимальной глубины пересечения
      }
    }
  }, [bubbles, windowWidth, windowHeight, redBubbleImage, greenBubbleImage]);

  return (
    <>
      <canvas
        ref={canvasRef}
        width={windowWidth}
        height={windowHeight}
        onMouseDown={(e) => handleMouseDown(e, bubbles, canvasRef)}
        onMouseMove={(e) => handleMouseMove(e, bubbles, canvasRef)}
        onMouseUp={(e) => handleMouseUp(e, bubbles)}
        onDoubleClick={(e) => handleClick(e, bubbles, canvasRef, openModal)}
      />
      <Modal isOpen={isModalOpen} onClose={closeModal} modalCoin={modalCoin} />
    </>
  );
}

export default Bubbles;
