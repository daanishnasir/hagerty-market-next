/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Box,
  Input,
  Tabs,
  SelectValueText,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectRoot,
  Text,
} from "@chakra-ui/react";
import { SearchOutlined, CaretDownOutlined } from "@ant-design/icons";
import { createListCollection } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { type CarImage } from "~/types";
import BidComponent from "./BidComponent";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@uidotdev/usehooks";

const tabData = [
  { value: "all-listings", label: "All listings", isFirst: true },
  { value: "auctions", label: "Auctions" },
  { value: "classifieds", label: "Classifieds", isLast: true },
];

const sortOptions = createListCollection({
  items: [
    { label: "Recommended", value: "recommended" },
    { label: "Least expensive", value: "least-expensive" },
    { label: "Most expensive", value: "most-expensive" },
  ],
});

const SAMPLE_PRICES = [
  29500, 32000, 22250, 19800, 90000, 60000, 79500, 15500, 29000, 19500, 14500,
  40000, 160000, 38000, 51000, 25500, 20500, 8000, 9000, 200000,
];

const CarCard = ({
  image,
  index,
  onClick,
}: {
  image: CarImage;
  index: number;
  onClick: () => void;
}) => {
  const endTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  return (
    <motion.div
      whileHover={{
        scale: 1.03,
        y: -5,
        transition: { duration: 0.2 },
      }}
      style={{
        borderRadius: "8px",
        overflow: "hidden",
        backgroundColor: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        cursor: "pointer",
        height: "360px",
        display: "flex",
        flexDirection: "column",
      }}
      onClick={onClick}
    >
      <img
        src={image.urls.small}
        alt={image.description}
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
        }}
      />
      <div
        style={{
          padding: "12px 16px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "1.1rem",
              fontWeight: "bold",
              marginBottom: "4px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {image.description || "Vehicle"}
          </h3>
          <p
            style={{
              color: "#666",
              fontSize: "0.9rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Location: {image.user.location || "Unknown"}
          </p>
        </div>
      </div>
      <BidComponent
        currentBid={image.price}
        endTime={endTime}
        isAuction={index === 0 || index === 1}
      />
    </motion.div>
  );
};

const CarDetailPanel = ({
  image,
  isOpen,
  onClose,
  index,
}: {
  image: CarImage | null;
  isOpen: boolean;
  onClose: () => void;
  index: number;
}) => {
  const router = useRouter();

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 0.4 : 0 }}
        transition={{ duration: 0.2 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "black",
          zIndex: 999,
          display: isOpen ? "block" : "none",
        }}
        onClick={onClose}
      />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "spring", damping: 20 }}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "400px",
          height: "100vh",
          backgroundColor: "white",
          boxShadow: "-4px 0 10px rgba(0,0,0,0.1)",
          zIndex: 1000,
          padding: "2rem",
          overflowY: "auto",
        }}
      >
        {image && (
          <>
            <Box display="flex" justifyContent="flex-end" mb={4}>
              <Box
                as="button"
                onClick={onClose}
                p={2}
                _hover={{ bg: "gray.100" }}
                borderRadius="md"
              >
                ✕
              </Box>
            </Box>
            <img
              src={image.urls.regular}
              alt={image.description}
              style={{
                width: "100%",
                height: "300px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            <Box mt={4}>
              <Text fontSize="2xl" fontWeight="bold">
                {image.description || "Vehicle"}
              </Text>
              <Text mt={2} color="gray.600">
                Location: {image.user.location || "Unknown"}
              </Text>
              <Text mt={2} fontSize="xl" fontWeight="bold">
                ${image.price?.toLocaleString() ?? "Unknown"}
              </Text>

              <Box
                as="button"
                mt={4}
                w="full"
                bg={index === 0 || index === 1 ? "#C41E3A" : "#E2E8F0"}
                color={index === 0 || index === 1 ? "white" : "gray.600"}
                py={3}
                px={4}
                borderRadius="full"
                border="1px solid"
                borderColor={index === 0 || index === 1 ? "#C41E3A" : "#94A3B8"}
                _hover={{
                  bg: index === 0 || index === 1 ? "#A01830" : "#CBD5E0",
                }}
                fontWeight="bold"
              >
                Place Bid
              </Box>

              <Box
                as="button"
                mt={4}
                w="full"
                bg="#0088CC"
                color="white"
                py={3}
                px={4}
                borderRadius="full"
                _hover={{ bg: "#0077B3" }}
                fontWeight="bold"
              >
                Message Seller
              </Box>

              <Box
                as="button"
                mt={2}
                w="full"
                bg="transparent"
                color="#0088CC"
                py={3}
                px={4}
                borderRadius="full"
                border="2px solid #0088CC"
                _hover={{ bg: "rgba(0, 136, 204, 0.1)" }}
                fontWeight="bold"
                onClick={() => {
                  router.push(`/auction/${image?.id}`);
                }}
              >
                More Details
              </Box>

              <Box mt={6}>
                <Text fontSize="xl" fontWeight="bold">
                  Paint and exterior
                </Text>
                <Text mt={1}>
                  Shows in good condition but could use refinishing
                </Text>

                <Text fontSize="xl" fontWeight="bold" mt={4}>
                  Upholstery and interior
                </Text>
                <Text mt={1}>
                  Shows in great condition with no strange odors, rips, or
                  stains.
                </Text>

                <Text fontSize="xl" fontWeight="bold" mt={4}>
                  Mileage
                </Text>
                <Text mt={1}>
                  Being a 1-Owner car, it was driven much more frequently at
                  first but, through the years, became more of a weekend/road
                  trip car.
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
                  Factory transmission. Works as intended [rebuilt in approx.
                  2015]
                </Text>

                <Text fontSize="xl" fontWeight="bold" mt={4}>
                  Warranty
                </Text>
                <Text mt={1}>No</Text>
              </Box>
            </Box>
          </>
        )}
      </motion.div>
    </>
  );
};

const SearchCars = () => {
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>(
    "hagerty-dark-mode",
    false,
  );
  const [tab, setTab] = useState<string | null>("all-listings");
  const [sortValue, setSortValue] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedCar, setSelectedCar] = useState<CarImage | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [images, setImages] = useState<CarImage[]>([]);

  const getTabStyles = (tabValue: string) => ({
    padding: "10px 20px",
    border: "1px solid #ccc",
    backgroundColor: tab === tabValue ? "#000" : "#fff",
    color: tab === tabValue ? "#fff" : "#333",
    borderRadius:
      tabValue === "all-listings"
        ? "4px 0 0 4px"
        : tabValue === "classifieds"
          ? "0 4px 4px 0"
          : undefined,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false); // TODO: maybe add skeleton loader later

  const fetchImages = async () => {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${searchValue}&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
    );
    const data = (await response.json()) as { results: CarImage[] };
    setImages(
      data.results.map((img, index) => ({
        ...img,
        originalIndex: index,
        price: SAMPLE_PRICES[index % SAMPLE_PRICES.length]!, // NOTE: will loop back if needed
      })),
    );
  };

  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
  };

  // const debouncedSearchValue = useDebounce(searchValue, 500);

  const handleCardClick = (image: CarImage, index: number) => {
    setSelectedCar(image);
    setSelectedIndex(index);
    setIsPanelOpen(true);
  };

  const getSortedImages = () => {
    if (!sortValue.length) return images;

    return [...images].sort((a, b) => {
      switch (sortValue[0]) {
        case "most-expensive":
          return (b.price ?? 0) - (a.price ?? 0);
        case "least-expensive":
          return (a.price ?? 0) - (b.price ?? 0);
        default:
          return 0;
      }
    });
  };

  return (
    <Box p={4} maxW="container.xl" mx="auto">
      <Box
        position="relative"
        w="full"
        mb={4}
        bg={isDarkMode ? "#333" : "#f4f6f8"}
        border="1px solid"
        borderColor="gray.200"
        borderRadius="full"
        display="flex"
        alignItems="center"
        px={6}
        py={4}
      >
        <SearchOutlined
          style={{
            color: isDarkMode ? "white" : "black",
            fontSize: "32px",
            paddingLeft: "2rem",
          }}
        />
        <Input
          type="text"
          placeholder="Search vehicle make and hit enter"
          border="none"
          _placeholder={{ color: isDarkMode ? "gray.400" : "gray.500" }}
          _focus={{
            boxShadow: "none",
            outline: "none",
            border: "none",
          }}
          bg="transparent"
          fontSize="xl"
          pl={3}
          w="full"
          h="40px"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              await fetchImages();
            }
          }}
          style={{
            color: isDarkMode ? "white" : "black",
          }}
        />
      </Box>

      <Box
        display="flex"
        flexDirection={{ base: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ base: "stretch", md: "center" }}
        gap={4}
        mb={4}
      >
        <Tabs.Root
          defaultValue="all-listings"
          value={tab}
          onValueChange={(e) => setTab(e.value)}
        >
          <Tabs.List width={{ base: "100%", md: "auto" }} display="flex">
            {tabData.map((tab) => (
              <Tabs.Trigger
                key={tab.value}
                value={tab.value}
                style={getTabStyles(tab.value)}
                flex={{ base: 1, md: "none" }}
              >
                {tab.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>

        <Box position="relative" width={{ base: "100%", md: "200px" }}>
          <SelectRoot
            collection={sortOptions}
            width="100%"
            value={sortValue}
            onValueChange={(e) => setSortValue(e.value)}
          >
            <SelectTrigger
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              gap={1}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Box as="span" color="gray.600">
                  Sort by:
                </Box>
                <SelectValueText placeholder="Recommended" />
              </Box>
              <CaretDownOutlined style={{ fontSize: "12px", color: "#666" }} />
            </SelectTrigger>
            <SelectContent
              position="absolute"
              zIndex={1000}
              bg="white"
              boxShadow="lg"
              borderRadius="md"
              mt={1}
              top="100%"
              right={0}
              minWidth="200px"
              py={2}
            >
              {sortOptions.items.map((option) => (
                <SelectItem
                  item={option}
                  key={option.value}
                  px={4}
                  py={2}
                  _hover={{ bg: "gray.100" }}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        </Box>
      </Box>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "2rem",
          padding: "2rem 0",
        }}
      >
        {getSortedImages().map((image: CarImage, index: number) => (
          <div key={image.id}>
            <CarCard
              image={image}
              index={index}
              onClick={() => handleCardClick(image, index)}
            />
          </div>
        ))}
      </div>

      <CarDetailPanel
        image={selectedCar}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        index={selectedIndex}
      />
    </Box>
  );
};

export default SearchCars;
