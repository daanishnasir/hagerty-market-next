"use client";

import { useState, useEffect } from "react";
import { Box, Text } from "@chakra-ui/react";
import { ClockCircleOutlined } from "@ant-design/icons";

interface BidComponentProps {
  currentBid: number;
  endTime: string;
  isAuction?: boolean;
}

const BidComponent = ({
  currentBid,
  endTime,
  isAuction = false,
}: BidComponentProps) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (!isAuction) {
      //NOTE: For non-auction items, show "1 day" or "2 days"
      const daysLeft = Math.ceil(Math.random() * 2); // NOTE: Randomly show either 1 or 2 bid days left,
      setTimeLeft(`${daysLeft} day${daysLeft > 1 ? "s" : ""}`);
      return;
    }

    const calculateTimeLeft = () => {
      const endDateTime = new Date(endTime).getTime();
      const now = new Date().getTime();
      const difference = endDateTime - now;

      if (difference <= 0) {
        setTimeLeft("Ended");
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      );
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [endTime, isAuction]);

  return (
    <Box
      display="flex"
      backgroundColor={isAuction ? "#C41E3A" : "#E8E9EB"}
      color={isAuction ? "white" : "black"}
      borderBottomRadius="8px"
      overflow="hidden"
      height="56px"
      marginTop="auto"
    >
      <Box
        flex="0 0 auto"
        borderRight={`1px solid ${isAuction ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)"}`}
        p={2}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box as="span" fontSize="lg" lineHeight={1}>
          ⚡
        </Box>
      </Box>
      <Box
        flex="1"
        borderRight={`1px solid ${isAuction ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)"}`}
        p={2}
        textAlign="center"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontWeight="bold">Bid ${currentBid.toLocaleString()}</Text>
      </Box>
      <Box
        flex="0 0 auto"
        p={2}
        minWidth="120px"
        textAlign="center"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text>
          {!isAuction && <ClockCircleOutlined style={{ marginRight: "4px" }} />}
          {timeLeft}
        </Text>
      </Box>
    </Box>
  );
};

export default BidComponent;
