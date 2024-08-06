import { NewCoin } from '@/lib/db';
import { sum } from 'lodash';

export interface Bubble {
  x: number;
  y: number;
  size: number;
  dx: number;
  dy: number;
  isDragging: boolean;
  startX: number;
  startY: number;
  startMouseX: number;
  startMouseY: number;
  radius: number;
  content: {
    img: any
    name?: string | null;
    cource: number;
  };
  item: NewCoin
}



export function roundToFiveDecimalPlaces(number: number) {
  const num = number;
  if (isNaN(num)) {
    return 0;
  }
  return Number(num.toFixed(3));
}

export function calculatePriceDifference(currentPrice: number, lastPrice: number) {
  if (lastPrice === 0) {
    return 0;
  }
  const priceDifference = currentPrice - lastPrice;
  const percentageDifference = (priceDifference / lastPrice) * 100;

  return percentageDifference;
}

const SQUARE_FULFILLMENT_PERCENTAGE = 0.81;
const MAX_SQUARE_COEF = 0.05;
const MIN_SQUARE_COEF = 0.007;

export function newCalculation(arrayValues: number[], square: number): number[] {
  const totalSquare = square * SQUARE_FULFILLMENT_PERCENTAGE * 3;
  const maxSquare = totalSquare * MAX_SQUARE_COEF;
  const minSquare = totalSquare * MIN_SQUARE_COEF;

  const positiveArrayValues = arrayValues.map(x => Math.abs(x));

  const arrayOfRoots = positiveArrayValues.map((x) => Math.sqrt(x))
  const sumValues = sum(arrayOfRoots) + 0.001;

  const squareRatio = totalSquare / sumValues;
  const calculatedSquares = arrayOfRoots.map((x) => {
    let square = squareRatio * x;
    if (square < minSquare) {
      square = minSquare;
    } else if (square > maxSquare) {
      square = maxSquare;
    }
    return square;
  })

  let squareSum = 0;
  const updatedSquares: number[] = []
  calculatedSquares.forEach((square) => {
    if (squareSum + square > totalSquare) {
      square = totalSquare - squareSum;
    }
    squareSum += square;
    updatedSquares.push(square);
  })

  const radiuses = updatedSquares.length > 0 ? updatedSquares.map(square => Math.sqrt(square / Math.PI)) : [];
  return radiuses;
}

export const createBubble = (
  item: NewCoin,
  array: NewCoin[],
  windowWidth: number,
  windowHeight: number
): Bubble => {
  console.log(item, 'item')
  const x = Math.random() * windowWidth;
  const y = Math.random() * windowHeight;
  // @ts-ignore
  const course = roundToFiveDecimalPlaces(calculatePriceDifference(item.current_price, item.price_history[1]));
  // @ts-ignore 
  const validPrices = array.filter(coin => !isNaN(coin.current_price) && !isNaN(coin.price_history[1]) && coin.current_price >= 0 && coin.price_history[1] >= 0);
  const bubbleSizes = newCalculation(
    // @ts-ignore 
    validPrices.map(coin => Math.abs(calculatePriceDifference(coin.current_price, coin.price_history[1]))),
    windowWidth * windowHeight
  );
  const size = bubbleSizes[array.indexOf(item)];

  const maxSpeed = 0.1;
  const dx = (Math.random() - 0.5) * maxSpeed;
  const dy = (Math.random() - 0.5) * maxSpeed;

  const image = new Image();
  // @ts-ignore
  image.src = item.image;

  return {
    x,
    y,
    size,
    dx,
    dy,
    isDragging: false,
    startX: 0,
    startY: 0,
    startMouseX: 0,
    startMouseY: 0,
    radius: 1,
    content: {
      img: image,
      name: item.symbol ? item.symbol.toUpperCase() : '',
      cource: course,
    },
    item
  };
};

function drawBubble(
  ctx: CanvasRenderingContext2D,
  bubble: Bubble,
  redBubbleImage: HTMLImageElement,
  greenBubbleImage: HTMLImageElement
) {
  ctx.drawImage(
    bubble.content.img,
    bubble.x - bubble.radius,
    bubble.y - bubble.radius,
    bubble.radius * 2,
    bubble.radius * 2
  );
  ctx.drawImage(
    (bubble.content.cource) < 0
      ? redBubbleImage
      : greenBubbleImage,
    bubble.x - bubble.size / 2,
    bubble.y - bubble.size / 2,
    bubble.size,
    bubble.size
  );
  ctx.font = `${bubble.size / 6}px Arial`;
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(bubble.content?.name ? bubble.content.name : '', bubble.x, bubble.y - bubble.size / 4);
  ctx.fillText(
    `${bubble.content.cource}%`,
    bubble.x,
    bubble.y + bubble.size / 4
  );

  if (bubble.content.img.complete) {
    const imgX = bubble.x - bubble.size / 8;
    const imgY = bubble.y - bubble.size / 8;

    ctx.drawImage(
      bubble.content.img,
      imgX,
      imgY,
      bubble.size / 4,
      bubble.size / 4
    );
  }
}

export const animate = (
  ctx: CanvasRenderingContext2D,
  bubbles: Bubble[],
  canvas: HTMLCanvasElement,
  redBubbleImage: HTMLImageElement,
  greenBubbleImage: HTMLImageElement,
  maxOverlap = 0.2 // Максимальная глубина перекрытия
) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bubbles.forEach((bubble, index) => {
    drawBubble(ctx, bubble, redBubbleImage, greenBubbleImage);

    bubbles.forEach((otherBubble, otherIndex) => {
      if (index !== otherIndex) {
        const distance = Math.sqrt(
          Math.pow(bubble.x - otherBubble.x, 2) +
          Math.pow(bubble.y - otherBubble.y, 2)
        );
        const minDistance = bubble.size / 2 + otherBubble.size / 2;
        const overlap = (minDistance - distance) / minDistance;

        if (overlap > 0) {
          // Шары перекрываются - отталкиваем
          const directionX = (otherBubble.x - bubble.x) / distance;
          const directionY = (otherBubble.y - bubble.y) / distance;

          const repulsionForce = (overlap * maxOverlap) * 2; // Сила отталкивания пропорциональна перекрытию
          const maxRepulsionSpeed = 0.5; // Максимальная скорость отталкивания

          // Определяем направление отталкивания
          bubble.dx -= directionX * repulsionForce;
          bubble.dy -= directionY * repulsionForce;
          otherBubble.dx += directionX * repulsionForce;
          otherBubble.dy += directionY * repulsionForce;

          // Ограничиваем максимальную скорость
          bubble.dx = Math.max(Math.min(bubble.dx, maxRepulsionSpeed), -maxRepulsionSpeed);
          bubble.dy = Math.max(Math.min(bubble.dy, maxRepulsionSpeed), -maxRepulsionSpeed);
          otherBubble.dx = Math.max(Math.min(otherBubble.dx, maxRepulsionSpeed), -maxRepulsionSpeed);
          otherBubble.dy = Math.max(Math.min(otherBubble.dy, maxRepulsionSpeed), -maxRepulsionSpeed);
        }
      }
    });

    if (!bubble.isDragging) {
      bubble.x += bubble.dx;
      bubble.y += bubble.dy;
    }

    // Отражение от границ
    if (bubble.x + bubble.size / 2 > canvas.width || bubble.x - bubble.size / 2 < 0) {
      bubble.dx = -bubble.dx;
      bubble.x = Math.max(bubble.x, bubble.size / 2);
      bubble.x = Math.min(bubble.x, canvas.width - bubble.size / 2);
    }
    if (bubble.y + bubble.size / 2 > canvas.height || bubble.y - bubble.size / 2 < 0) {
      bubble.dy = -bubble.dy;
      bubble.y = Math.max(bubble.y, bubble.size / 2);
      bubble.y = Math.min(bubble.y, canvas.height - bubble.size / 2);
    }

    // Если скорости малы, то задаём случайное направление
    const minSpeed = 0.1;
    if (Math.abs(bubble.dx) < minSpeed && Math.abs(bubble.dy) < minSpeed) {
      bubble.dx = (Math.random() - 0.5) * 2 * minSpeed;
      bubble.dy = (Math.random() - 0.5) * 2 * minSpeed;
    }
  });

  requestAnimationFrame(() =>
    animate(ctx, bubbles, canvas, redBubbleImage, greenBubbleImage, maxOverlap)
  );
};




export const handleMouseDown = (e: any, bubbles: Bubble[], canvasRef: any) => {
  const canvas = canvasRef.current;
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const clickedBubble = bubbles.find((bubble, index) => {
    if (
      mouseX > bubble.x - bubble.size / 2 &&
      mouseX < bubble.x + bubble.size / 2 &&
      mouseY > bubble.y - bubble.size / 2 &&
      mouseY < bubble.y + bubble.size / 2
    ) {
      return true;
    }
    return false;
  });

  if (clickedBubble) {
    clickedBubble.isDragging = true;
    clickedBubble.startX = clickedBubble.x;
    clickedBubble.startY = clickedBubble.y;
    clickedBubble.startMouseX = mouseX;
    clickedBubble.startMouseY = mouseY;
  }
};

export const handleMouseMove = (e: any, bubbles: Bubble[], canvasRef: any) => {
  const canvas = canvasRef.current;
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  bubbles.forEach((bubble) => {
    if (bubble.isDragging) {
      const dx = mouseX - bubble.startMouseX;
      const dy = mouseY - bubble.startMouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      let directionX = 0;
      let directionY = 0;
      if (distance > 0) {
        directionX = dx / distance;
        directionY = dy / distance;
      }

      bubble.x = bubble.startX ? bubble.startX + directionX * distance : bubble.x;
      bubble.y = bubble.startY ? bubble.startY + directionY * distance : bubble.y;
    }
  });
};


export const handleMouseUp = (e: any, bubbles: Bubble[]) => {
  bubbles.forEach((bubble) => {
    if (bubble.isDragging) {
      bubble.isDragging = false;
    }
  });
};

export const handleClick = (e: any, bubbles: Bubble[], canvasRef: any, openModal: any) => {
  const rect = canvasRef.current.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const clickedBubble = bubbles.find(bubble => {
    const distance = Math.sqrt(
      Math.pow(mouseX - bubble.x, 2) +
      Math.pow(mouseY - bubble.y, 2)
    );
    return distance <= bubble.size / 2;
  });

  if (clickedBubble) {
    openModal(clickedBubble.item)
  }
};
