import { Link } from "react-router-dom";
import { Button, Flex, HStack, Text, Box } from "@chakra-ui/react";

//console.log(__filename)
export function Navbar() {

  return (
    <Flex
    position="relative"
    h={16}
    alignItems="center"
    bg="red.400"
    px={{ base: 4, md: 8 }} // Responsive horizontal padding
  >
    <HStack gap={2} alignItems="center">
      <Link to="/">
        <Button>Home</Button>
      </Link>
      <Link to="/about">
        <Button>About</Button>
      </Link>
      <Link to="/submission">
        <Button>Submit a Form</Button>
      </Link>
    </HStack>
    <Box
      position={{ base: "relative", md: "absolute" }} // Relative for small screens, absolute for larger screens
      left={{ base: "auto", md: "50%" }} // Only center on larger screens
      transform={{ base: "none", md: "translateX(-50%)" }}
      w="full"
      textAlign="center"
    >
      <Text fontSize="lg" fontWeight="bold" color="white" whiteSpace="nowrap">
        Alachua County Cleanup Report
      </Text>
    </Box>
  </Flex>
);
}
