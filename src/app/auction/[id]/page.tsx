"use client";

import { Box, Text } from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/tooltip";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { type CarImage } from "~/types";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import { ToggleTip } from "~/components/ui/toggle-tip";

const SAMPLE_PRICES = [
  29500, 32000, 22250, 19800, 90000, 60000, 79500, 15500, 29000, 19500, 14500,
  40000, 160000, 38000, 51000, 25500, 20500, 8000, 9000, 200000,
];

export default function VehicleDetailsPage() {
  const params = useParams();
  const [vehicle, setVehicle] = useState<CarImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await fetch(
          `https://api.unsplash.com/photos/${params.id}?client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
        );
        const data = await response.json();
        setVehicle({
          ...data,
          price: SAMPLE_PRICES[0],
        });
      } catch (error) {
        console.error("Error fetching vehicle:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      void fetchVehicle();
    }
  }, [params.id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!vehicle) {
    return <div>Vehicle not found</div>;
  }

  return (
    <Box maxW="container.xl" mx="auto" p={8}>
      <Box display="flex" gap={8} flexDirection={{ base: "column", md: "row" }}>
        <Box flex="1">
          {/* // TODO: next/img  */}
          <img
            src={vehicle.urls.regular}
            alt={vehicle.description}
            style={{
              width: "100%",
              height: "500px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        </Box>

        <Box flex="1">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
          >
            <Text fontSize="3xl" fontWeight="bold">
              {vehicle.description || "Vehicle"}
            </Text>

            <Box
              as="button"
              onClick={() => setIsWatchlisted(!isWatchlisted)}
              p={2}
              borderRadius="full"
              _hover={{ bg: "gray.100" }}
              transition="all 0.2s"
            >
              {isWatchlisted ? (
                <StarFilled style={{ fontSize: "24px", color: "#0088CC" }} />
              ) : (
                <StarOutlined style={{ fontSize: "24px", color: "#0088CC" }} />
              )}
            </Box>
          </Box>

          <Text fontSize="2xl" fontWeight="bold" color="gray.700" mb={6}>
            ${vehicle.price?.toLocaleString() ?? "Unknown"}
          </Text>

          <Box
            as="button"
            w="full"
            bg="#0088CC"
            color="white"
            py={3}
            px={4}
            borderRadius="full"
            _hover={{ bg: "#0077B3" }}
            fontWeight="bold"
            mb={4}
          >
            Place Bid
          </Box>

          <Box
            as="button"
            w="full"
            bg="#0088CC"
            color="white"
            py={3}
            px={4}
            borderRadius="full"
            _hover={{ bg: "#0077B3" }}
            fontWeight="bold"
            mb={6}
          >
            Message Seller
          </Box>

          <Box>
            <Text fontSize="xl" fontWeight="bold" mt={6}>
              Paint and exterior
            </Text>
            <Text mt={1}>
              Shows in good condition but could use refinishing
            </Text>

            <Text fontSize="xl" fontWeight="bold" mt={4}>
              Upholstery and interior
            </Text>
            <Text mt={1}>
              Shows in great condition with no strange odors, rips, or stains.
            </Text>

            <Text fontSize="xl" fontWeight="bold" mt={4}>
              Mileage
            </Text>
            <Text mt={1}>
              Being a 1-Owner car, it was driven much more frequently at first
              but, through the years, became more of a weekend/road trip car.
            </Text>

            <Text fontSize="xl" fontWeight="bold" mt={4}>
              Wheels and tires
            </Text>
            <Text mt={1}>
              Factory wheels wrapped in Hancock tires [P185/75R14]
            </Text>

            <Text fontSize="xl" fontWeight="bold" mt={4}>
              Brakes
            </Text>
            <Text mt={1}>
              Factory brakes. They work as intended but could use a refresh.
            </Text>

            <Text fontSize="xl" fontWeight="bold" mt={4}>
              Transmission
            </Text>
            <Text mt={1}>
              Factory transmission. Works as intended [rebuilt in approx. 2015]
            </Text>

            <Text fontSize="xl" fontWeight="bold" mt={4}>
              Warranty
            </Text>
            <Text mt={1}>No</Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
